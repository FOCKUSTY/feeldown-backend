/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import type {
  AdditionalFunctionsParameters,
  Entity,
  FindMany,
  FunctionsParameters,
  Model,
  Modificators,
  Prisma,
  PrismaModel,
  Select,
  Where,
  WhereMany,
} from "@1/types";
import { isRFC3339 } from "class-validator";

export type NN<T> = T & {};

export abstract class CrudService<
  ModelName extends PrismaModel,
  Types extends FunctionsParameters<ModelName> = FunctionsParameters<ModelName>,
  Add extends AdditionalFunctionsParameters<unknown> =
    AdditionalFunctionsParameters,
> {
  public constructor(
    protected readonly model: Model<ModelName>,
    protected readonly modificators: Modificators<ModelName, Types, Add> = {},
  ) {}

  public async get<
    F extends Types["get"],
    R = Prisma.Result<Model<ModelName>, F, "findMany">,
  >(filter: F, ...additional: Add["get"]): Promise<R> {
    const { sort, sortBy, limit, offset, where, include, omit, select } =
      filter;
    const whereClause = this.buildWhere({ where });
    const modifiedWhere =
      this.modificators.where?.get?.(filter, additional) || whereClause;

    //@ts-ignore
    return this.model.findMany({
      where: modifiedWhere,
      orderBy: { [sortBy]: sort },
      skip: offset,
      take: limit,
      include,
      omit,
      select,
    });
  }

  public async getOne<
    W extends Types["getOne"],
    R = Prisma.Result<Model<ModelName>, { where: W }, "findUnique">,
  >(where: W, ...additional: Add["getOne"]): Promise<R | null> {
    const modifiedWhere =
      this.modificators.where?.getOne?.(where, additional) || where;
    //@ts-ignore
    return this.model.findUnique({ where: modifiedWhere });
  }

  public async create(
    data: Types["create"],
    ..._: Add["create"]
  ): Promise<
    Prisma.Result<Model<ModelName>, { data: Types["create"] }, "create">
  > {
    //@ts-ignore
    return this.model.create({ data });
  }

  public async update(
    where: Types["update"][0],
    data: Types["update"][1],
    ...additional: Add["update"]
  ): Promise<
    Prisma.Result<
      Model<ModelName>,
      { where: Types["update"][0]; data: Types["update"][1] },
      "update"
    >
  > {
    const modifiedWhere =
      this.modificators.where?.update?.([where, data], additional) || where;
    //@ts-ignore
    return this.model.update({ where: modifiedWhere, data });
  }

  public async delete(
    where: Types["delete"],
    ...additional: Add["delete"]
  ): Promise<
    Prisma.Result<Model<ModelName>, { where: Types["delete"] }, "delete">
  > {
    const modifiedWhere =
      this.modificators.where?.delete?.(where, additional) || where;
    //@ts-ignore
    return this.model.delete({ where: modifiedWhere });
  }

  protected async getRelated<
    F extends Omit<Types["get"], "where">,
    W extends NN<Types["get"]["where"]>,
    S extends keyof Select<ModelName>,
    R = Prisma.Result<
      Model<ModelName>,
      F & { where: W; select: Record<S, true> },
      "findUnique"
    >,
  >(filter: Omit<Types["get"], "where">, where: W, selectField: S): Promise<R> {
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

  protected async getRelatedOr<
    F extends Omit<Types["get"], "where">,
    W extends NN<Types["get"]["where"]>,
    Or extends keyof Entity<ModelName>,
    OrValue extends Entity<ModelName>[Or],
    S extends keyof Select<ModelName>,
    //@ts-ignore
    FB extends keyof NN<
      Prisma.Result<Model<ModelName>, { select: Record<S, true> }, "findUnique">
    >[S],
    //@ts-ignore
    R = NN<
      Prisma.Result<
        Model<ModelName>,
        F & { where: W & { OR: Record<Or, OrValue> }; select: Record<S, true> },
        "findUnique"
      >
    >[S][],
  >(data: {
    filter: F;
    where: W;
    or: Or[];
    value: OrValue;
    selectFields: S[];
    findBy: FB;
  }): Promise<R> {
    const items = await this.get({
      ...data.filter,
      where: {
        ...data.where,
        OR: data.or.map((k) => ({ [k]: data.value })),
      },
      select: Object.fromEntries(data.selectFields.map((s) => [s, true])),
    });

    //@ts-ignore
    return items.map((item) => {
      const field = data.selectFields.filter(
        //@ts-ignore
        (field) => item[field][data.findBy] === data.or.value,
      );
      //@ts-ignore
      return item[field];
    });
  }

  private buildWhere(
    where: Omit<FindMany<ModelName>, "sort" | "sortBy" | "limit" | "offset">,
  ) {
    return Object.fromEntries(
      Object.entries(where).filter(([, value]) => value !== undefined),
    );
  }
}
