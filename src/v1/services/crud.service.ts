/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Operation } from "@prisma/client/runtime/client";
import type { Prisma } from "@/database/generated/client";
import type { BaseFilter } from "@1/types";

import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database";

export type PrismaModel = Prisma.ModelName;
export type Args<
  ModelName extends PrismaModel,
  T extends Operation,
> = Prisma.Args<Model<ModelName>, T>;
export type Model<ModelName extends PrismaModel> =
  PrismaService[Uncapitalize<ModelName>];
export type Where<ModelName extends PrismaModel> = Args<
  ModelName,
  "findUnique"
>["where"];
export type CreateInput<ModelName extends PrismaModel> = Args<
  ModelName,
  "create"
>["data"];
export type UpdateInput<ModelName extends PrismaModel> = Args<
  ModelName,
  "update"
>["data"];
export type Entity<ModelName extends PrismaModel> = NonNullable<
  Prisma.Result<Model<ModelName>, { where: Where<ModelName> }, "findUnique">
>;
export type Result<
  ModelName extends PrismaModel,
  Op extends Operation,
> = Prisma.Result<Model<ModelName>, { where: Where<ModelName> }, Op>;

export type Filter<ModelName extends Prisma.ModelName> = BaseFilter & {
  sortBy: keyof Entity<ModelName>;
};

export type FunctionsParameters<ModelName extends PrismaModel> = {
  get: Filter<ModelName>;
  getOne: Where<ModelName>;
  create: CreateInput<ModelName>;
  update: [Where<ModelName>, UpdateInput<ModelName>];
  delete: Where<ModelName>;
};

export type FunctionsReturn<ModelName extends PrismaModel> = {
  get: Entity<ModelName>[];
  getOne: Entity<ModelName> | null;
  create: Result<ModelName, "create">;
  update: Result<ModelName, "update">;
  delete: Result<ModelName, "delete">;
};

export type AdditionalFunctionsParameters<T = never> = Record<
  keyof FunctionsParameters<PrismaModel>,
  T[]
>;

export type Compare<
  ModelName extends PrismaModel,
  Types extends Partial<FunctionsParameters<ModelName>>,
> = {
  [P in keyof Types]-?: NonNullable<Types[P]>;
} & Omit<FunctionsParameters<ModelName>, keyof Types>;

export type CompareAdditional<
  Add extends Partial<AdditionalFunctionsParameters<unknown>>,
> = {
  [P in keyof Add]-?: NonNullable<Add[P]>;
} & Omit<AdditionalFunctionsParameters, keyof Add>;

export type CompareReturn<
  ModelName extends PrismaModel,
  Ret extends Partial<FunctionsReturn<ModelName>>,
> = {
  [P in keyof Ret]-?: NonNullable<Ret[P]>;
} & Omit<FunctionsReturn<ModelName>, keyof Ret>;

export type Modificator<
  ModelName extends PrismaModel,
  Types extends FunctionsParameters<ModelName>,
  Add extends AdditionalFunctionsParameters<unknown>,
> = Partial<{
  //@ts-ignore
  [P in keyof Types]: (...input: [Types[P], Add[P]]) => Where<ModelName>;
}>;

export type Modificators<
  ModelName extends PrismaModel,
  Types extends FunctionsParameters<ModelName>,
  Add extends AdditionalFunctionsParameters<unknown>,
> = Partial<{
  where: Modificator<ModelName, Types, Add>;
}>;

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
    const { sort, sortBy, limit, offset, ...where } = filter;
    const whereClause = this.buildWhere(where);
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
    where: Omit<Filter<ModelName>, "sort" | "sortBy" | "limit" | "offset">,
  ) {
    return Object.fromEntries(
      Object.entries(where).filter(([, value]) => value !== undefined),
    );
  }
}
