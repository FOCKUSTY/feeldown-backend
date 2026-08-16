/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  CrudCompare,
  CrudMethods,
  CrudMethodsParameters,
  CrudEvents,
  CrudFindMany,
  CrudModel,
  CrudModificators,
  Prisma,
  PrismaModel,
  CrudSelect,
  UnknownCrudMethodParameters,
  CrudValidatorsOrThrow,
  CrudEventsParametersWithoutSomeKey,
} from "@1/types";

import { CRUD_ERRORS } from "@1/errors";

export abstract class CrudService<
  ModelName extends PrismaModel,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  Parameters extends Partial<UnknownCrudMethodParameters> = {},
  Types extends CrudCompare<CrudMethodsParameters<ModelName>, Parameters> =
    CrudCompare<CrudMethodsParameters<ModelName>, Parameters>,
> implements CrudMethods {
  public static readonly DEFAULT_DEPENDENCIES = {
    modificators: {
      where: {},
    },
    events: {},
  };

  protected readonly _modificators: CrudModificators<
    ModelName,
    Parameters,
    Types
  >;
  protected readonly _events: CrudEvents<Types>;
  protected readonly _validators: CrudValidatorsOrThrow<Types>;

  public constructor(
    protected readonly model: CrudModel<ModelName>,
    dependencies: {
      modificators: CrudModificators<ModelName, Parameters, Types>;
      validatorsOrThrow?: CrudValidatorsOrThrow<Types>;
      events?: CrudEvents<Types>;
    },
  ) {
    this._modificators = dependencies?.modificators;
    this._validators = dependencies?.validatorsOrThrow ?? {};
    this._events = dependencies?.events ?? {};
  }

  public async get<
    F extends Types["get"],
    R = Prisma.Result<CrudModel<ModelName>, F, "findMany">,
  >(filter: F): Promise<R> {
    await this.validateOrThrow("get", filter);
    const { sort, sortBy, limit, where, include, omit, select, cursor } =
      filter;
    const whereClause = this.buildWhere({ where });
    const modifiedWhere =
      this._modificators.where?.get?.(filter) || whereClause;

    const cursorObject = cursor ? { id: cursor } : undefined;
    const skip = cursor ? 1 : 0;
    const orderBy = cursor
      ? [
          {
            [sortBy]: sort,
          },
          {
            id: sort,
          },
        ]
      : { [sortBy]: sort };

    const execute = () =>
      //@ts-ignore
      this.model.findMany({
        ...modifiedWhere,
        orderBy,
        skip,
        cursor: cursorObject,
        take: limit,
        include,
        omit,
        select,
      });

    return this.applyEvents({
      method: "get",
      data: {
        before: { base: filter },
        after: { base: filter },
      },
      execute,
    });
  }

  public async getOne<
    W extends Types["getOne"],
    R = Prisma.Result<CrudModel<ModelName>, W, "findUnique">,
  >(where: W): Promise<NonNullable<R>> {
    await this.validateOrThrow("getOne", where);
    const modifiedWhere = this._modificators.where?.getOne?.(where) || where;

    //@ts-ignore
    const execute = () => this.model.findUnique({ where: modifiedWhere });
    const result = await this.applyEvents({
      method: "getOne",
      data: {
        before: { base: where },
        after: { base: where },
      },
      execute,
    });

    if (!result) {
      throw CRUD_ERRORS.NOT_FOUND.exception;
    }

    //@ts-ignore
    return result;
  }

  public async getRelated<
    F extends Omit<Types["get"], "where">,
    W extends NonNullable<Types["get"]["where"]>,
    S extends keyof CrudSelect<ModelName>,
    R = Prisma.Result<
      CrudModel<ModelName>,
      F & { where: W; select: Record<S, true> },
      "findUnique"
    >,
  >({
    filter,
    where,
    selectField,
  }: {
    filter: F;
    where: W;
    selectField: S;
  }): Promise<R> {
    const items = await this.get({
      ...filter,
      where,
      select: {
        [selectField]: true,
      },
    } as Types["get"]);

    //@ts-ignore
    return items.map((item) => item[selectField]);
  }

  public async create(
    data: Types["create"],
  ): Promise<
    Prisma.Result<CrudModel<ModelName>, { data: Types["create"] }, "create">
  > {
    await this.validateOrThrow("create", data);

    //@ts-ignore
    const execute = () => this.model.create({ data });
    return this.applyEvents({
      method: "create",
      data: {
        after: { base: data },
        before: { base: data },
      },
      execute,
    });
  }

  public async update(
    update: Types["update"],
  ): Promise<Prisma.Result<CrudModel<ModelName>, Types["update"], "update">> {
    await this.validateOrThrow("update", update);
    const modifiedWhere =
      this._modificators.where?.update?.(update) || update.where;

    const execute = () =>
      //@ts-ignore
      this.model.update({
        where: modifiedWhere,
        data: update.data,
      });

    return this.applyEvents({
      method: "update",
      data: {
        after: { base: update },
        before: { base: update },
      },
      execute,
    });
  }

  public async delete(
    where: Types["delete"],
  ): Promise<
    Prisma.Result<CrudModel<ModelName>, { where: Types["delete"] }, "delete">
  > {
    await this.validateOrThrow("delete", where);
    const modifiedWhere = this._modificators.where?.delete?.(where) || where;

    //@ts-ignore
    const execute = () => this.model.delete({ where: modifiedWhere });
    return this.applyEvents({
      method: "delete",
      data: {
        after: { base: where },
        before: { base: where },
      },
      execute,
    });
  }

  protected async validateOrThrow<Method extends keyof CrudMethods>(
    method: Method,
    data: Types[Method],
  ) {
    const key = this.getValidatorKey(method);
    //@ts-ignore
    const validated = await this._validators?.[key]?.(data);
    if (validated === undefined) {
      return true;
    }

    if (!validated) {
      throw CRUD_ERRORS.NOT_VALID.exception;
    }

    return validated;
  }

  protected buildWhere(
    where: Omit<
      CrudFindMany<ModelName>,
      "sort" | "sortBy" | "limit" | "offset"
    >,
  ) {
    return Object.fromEntries(
      Object.entries(where).filter(([, value]) => value !== undefined),
    );
  }

  private async applyEvents<Method extends keyof CrudMethods, Result>({
    data,
    method,
    execute,
  }: {
    method: Method;
    data: CrudEventsParametersWithoutSomeKey<Types, Method, "result">;
    execute: () => Promise<Result>;
  }) {
    const keys = this.getEventsKey(method);

    //@ts-ignore
    await this._events?.[keys.before]?.(data.before);

    const result = await execute();

    //@ts-ignore
    await this._events?.[keys.after]?.({
      ...data.after,
      result,
    });

    return result;
  }

  private getEventsKey<Method extends keyof CrudMethods>(method: Method) {
    const before = this.setPrefixAndCapitalize("before", method);
    const after = this.setPrefixAndCapitalize("after", method);
    return { before, after };
  }

  private getValidatorKey<Method extends keyof CrudMethods>(method: Method) {
    return this.setPrefixAndCapitalize("validate", method);
  }

  private setPrefixAndCapitalize<Prefix extends string, Value extends string>(
    prefix: Prefix,
    value: Value,
  ) {
    const [first, ...other] = value;
    const output = prefix + first.toUpperCase() + other.join("");
    return output as `${Prefix}${Capitalize<Value>}`;
  }
}
