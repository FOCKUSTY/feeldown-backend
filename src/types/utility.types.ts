import type { INestApplication } from "@nestjs/common";
import type {
  OpenAPIObject as OpenApiObject,
  SwaggerCustomOptions,
} from "@nestjs/swagger";

type ToFunction<Type> = Type extends unknown
  ? (parameter: Type) => void
  : never;

/**
 * Преобразует объединение (A | B) в пересечение (A & B)
 */
export type UnionToIntersection<Type> =
  ToFunction<Type> extends (Parameter: infer U) => void ? U : never;

export type SwaggerConfig<T = unknown> = {
  version: string;
  pathname: string;
  app: INestApplication<T>;
  factory: OpenApiObject;
  options: SwaggerCustomOptions;
};

export type Prettify<T> = {
  [P in keyof T]: T[P];
} & {};
