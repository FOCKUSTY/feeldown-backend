import type { Operation } from "@prisma/client/runtime/client";
import type { Prisma } from "@/database/generated/client";

import type { PrismaService } from "@/database";
import type { BaseFilter } from "./filter.types";

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

export type CrudFilter<ModelName extends Prisma.ModelName> = BaseFilter & {
  sortBy: keyof Entity<ModelName>;
};

export type FunctionsParameters<ModelName extends PrismaModel> = {
  get: CrudFilter<ModelName>;
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

export type CompareParameters<
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  [P in keyof Types]: (...input: [Types[P], Add[P]]) => Where<ModelName>;
}>;

export type Modificators<
  ModelName extends PrismaModel,
  Types extends FunctionsParameters<ModelName>,
  Add extends AdditionalFunctionsParameters<unknown>,
> = Partial<{
  where: Modificator<ModelName, Types, Add>;
}>;
