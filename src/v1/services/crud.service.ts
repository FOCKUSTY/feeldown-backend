/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import type {
  AdditionalFunctionsParameters,
  CrudFilter,
  FunctionsParameters,
  FunctionsReturn,
  Model,
  Modificators,
  PrismaModel,
} from "@1/types";

export abstract class CrudService<
  ModelName extends PrismaModel,
  Types extends FunctionsParameters<ModelName> = FunctionsParameters<ModelName>,
  Add extends AdditionalFunctionsParameters<unknown> =
    AdditionalFunctionsParameters,
  Ret extends FunctionsReturn<ModelName> = FunctionsReturn<ModelName>,
> {
  public constructor(
    protected readonly model: Model<ModelName>,
    protected readonly modificators: Modificators<ModelName, Types, Add> = {},
  ) {}

  public async get(
    filter: Types["get"],
    ...additional: Add["get"]
  ): Promise<Ret["get"]> {
    const { sort, sortBy, limit, offset, where } = filter;
    const whereClause = this.buildWhere({ where });
    const modifiedWhere =
      this.modificators.where?.get?.(filter, additional) || whereClause;

    //@ts-ignore
    return this.model.findMany({
      where: modifiedWhere,
      orderBy: { [sortBy]: sort },
      skip: offset,
      take: limit,
    });
  }

  public async getOne(
    where: Types["getOne"],
    ...additional: Add["getOne"]
  ): Promise<Ret["getOne"]> {
    const modifiedWhere =
      this.modificators.where?.getOne?.(where, additional) || where;
    //@ts-ignore
    return this.model.findUnique({ where: modifiedWhere });
  }

  public async create(
    data: Types["create"],
    ..._: Add["create"]
  ): Promise<Ret["create"]> {
    //@ts-ignore
    return this.model.create({ data });
  }

  public async update(
    where: Types["update"][0],
    data: Types["update"][1],
    ...additional: Add["update"]
  ): Promise<Ret["update"]> {
    const modifiedWhere =
      this.modificators.where?.update?.([where, data], additional) || where;
    //@ts-ignore
    return this.model.update({ where: modifiedWhere, data });
  }

  public async delete(
    where: Types["delete"],
    ...additional: Add["delete"]
  ): Promise<Ret["delete"]> {
    const modifiedWhere =
      this.modificators.where?.delete?.(where, additional) || where;
    //@ts-ignore
    return this.model.delete({ where: modifiedWhere });
  }

  protected buildWhere(
    where: Omit<CrudFilter<ModelName>, "sort" | "sortBy" | "limit" | "offset">,
  ) {
    return Object.fromEntries(
      Object.entries(where).filter(([, value]) => value !== undefined),
    );
  }
}
