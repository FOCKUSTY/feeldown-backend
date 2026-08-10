/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Operation } from "@prisma/client/runtime/client";
import type { Prisma } from "@/database/generated/client";

import type { BaseFilter } from "./filter.types";
import type { PrismaService } from "@/database";
import type { Prettify } from "@/types";

export type PrismaModel = Prisma.ModelName;
export type CrudArgs<
  ModelName extends PrismaModel,
  T extends Operation,
> = Prisma.Args<CrudModel<ModelName>, T>;

export type CrudModel<ModelName extends PrismaModel> =
  PrismaService[Uncapitalize<ModelName>];

export type CrudWhere<
  ModelName extends PrismaModel,
  O extends Operation,
> = CrudArgs<ModelName, O>["where"];

export type CrudWhereUnique<ModelName extends PrismaModel> = CrudArgs<
  ModelName,
  "findUnique"
>["where"];

export type CrudWhereMany<ModelName extends PrismaModel> = CrudArgs<
  ModelName,
  "findMany"
>["where"];

export type CrudCreateInput<ModelName extends PrismaModel> = CrudArgs<
  ModelName,
  "create"
>["data"];

export type CrudUpdateInput<ModelName extends PrismaModel> = CrudArgs<
  ModelName,
  "update"
>["data"];

export type CrudEntity<ModelName extends PrismaModel> = NonNullable<
  Prisma.Result<
    CrudModel<ModelName>,
    { where: CrudWhereUnique<ModelName> },
    "findUnique"
  >
>;
export type CrudSelect<ModelName extends PrismaModel> = NonNullable<
  CrudArgs<ModelName, "findMany">["select"]
>;
export type CrudInclude<ModelName extends PrismaModel> = NonNullable<
  CrudArgs<ModelName, "findMany">["include"]
>;
export type CrudOmit<ModelName extends PrismaModel> = NonNullable<
  CrudArgs<ModelName, "findMany">["omit"]
>;

export type CrudFindMany<ModelName extends PrismaModel> = BaseFilter & {
  sortBy: keyof CrudEntity<ModelName>;
  where?: CrudWhereMany<ModelName>;
  select?: CrudSelect<ModelName>;
  include?: CrudInclude<ModelName>;
  omit?: CrudOmit<ModelName>;
};

export type CrudMethod<Parameters extends unknown[] = any[], Return = any> = (
  ...parameters: Parameters
) => Return;

export type CrudMethods = Record<
  "get" | "getOne" | "create" | "update" | "delete",
  CrudMethod
>;

export type CrudMethodsParameters<ModelName extends PrismaModel> = {
  get: CrudFindMany<ModelName>;
  getOne: CrudWhereUnique<ModelName>;
  create: CrudCreateInput<ModelName>;
  update: {
    where: CrudWhere<ModelName, "update">;
    data: CrudUpdateInput<ModelName>;
  };
  delete: CrudWhere<ModelName, "delete">;
};

export type UnknownCrudMethodParameters = Record<keyof CrudMethods, unknown>;

export type CrudCompare<
  Types extends Record<string, unknown>,
  Parameters extends Record<string, unknown>,
> = {
  [Key in keyof Parameters]-?: NonNullable<Parameters[Key]>;
} & Omit<Types, keyof Parameters>;

export type CrudWhereModificator<
  ModelName extends PrismaModel,
  Parameters extends Partial<UnknownCrudMethodParameters>,
  Types extends CrudCompare<CrudMethodsParameters<ModelName>, Parameters>,
> = Omit<
  {
    [Key in keyof Parameters]: (
      input: Parameters[Key],
    ) => CrudWhereUnique<ModelName>;
  } & {
    [Key in Exclude<keyof Types, keyof Parameters>]?: (
      input: Types[Key],
    ) => CrudWhereUnique<ModelName>;
  },
  "create"
>;

export type CrudEventsParameters<
  Types extends UnknownCrudMethodParameters,
  Method extends keyof Types,
> = {
  before: { base: Types[Method] };
  after: { base: Types[Method]; result: any };
};

export type CrudEventsParametersWithoutSomeKey<
  Types extends UnknownCrudMethodParameters,
  Method extends keyof Types,
  ToExclude extends string,
  Events extends CrudEventsParameters<Types, Method> = CrudEventsParameters<
    Types,
    Method
  >,
> = {
  [Key in keyof Events]: Omit<Events[Key], ToExclude>;
};

export type CrudEvents<Types extends UnknownCrudMethodParameters> = Partial<
  Prettify<
    {
      //@ts-ignore
      [Key in keyof Types as `after${Capitalize<Key>}`]: (
        input: CrudEventsParameters<Types, Key>["after"],
      ) => Promise<void>;
    } & {
      //@ts-ignore
      [Key in keyof Types as `before${Capitalize<Key>}`]: (
        input: CrudEventsParameters<Types, Key>["before"],
      ) => Promise<void>;
    }
  >
>;

export type CrudModificators<
  ModelName extends PrismaModel,
  Parameters extends Partial<UnknownCrudMethodParameters>,
  Types extends CrudCompare<CrudMethodsParameters<ModelName>, Parameters>,
> = {
  where: CrudWhereModificator<ModelName, Parameters, Types>;
};

export type CrudValidatorsOrThrow<
  Types extends Partial<UnknownCrudMethodParameters>,
> = Partial<{
  //@ts-ignore
  [Key in keyof Types as `validate${Capitalize<Key>}`]: (
    input: Types[Key],
  ) => Promise<true>;
}>;

export type CrudValidator<Methods extends keyof CrudMethods> = {
  [Key in Methods as `validate${Capitalize<Key>}`]: (
    input: any,
  ) => Promise<true>;
};

export type CrudEventsMethods =
  `${"after" | "before"}${Capitalize<keyof CrudMethods>}`;

export type CrudListener<Methods extends CrudEventsMethods> = {
  [Key in Methods]: (input: any) => Promise<void>;
};

export type { Operation, Prisma };
