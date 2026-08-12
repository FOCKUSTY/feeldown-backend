import type { ApiOperationOptions, ApiQueryMetadata } from "@nestjs/swagger";
import type { RoutesSettings, RoutesObject } from "./route-object.type";

export type ApiParameterIn = "path" | "query" | "header" | "cookie";

type ApiParameterData = {
  name: string;
  required?: boolean;
  schema?: any;
  description?: string;
  example?: any;
};

export type ApiParameter =
  | (ApiParameterData & {
      in: "header";
    })
  | (ApiParameterData & {
      in: "path";
    })
  | (ApiParameterData & {
      in: "query";
    })
  | (ApiParameterData & {
      in: "cookie";
    })
  | {
      in: "query";
      type: NonNullable<ApiQueryMetadata["type"]>;
    };

export type ApiParameterInType<In extends ApiParameterIn> = Extract<
  ApiParameter,
  { in: In }
>;

export type ApiDocumentationOptions = Omit<
  ApiOperationOptions,
  "parameters"
> & {
  parameters?: ApiParameter[];
  requestBody?: any;
  responses?: Record<string, any>;
};

export type Operations<T extends RoutesObject> = RoutesSettings<
  T,
  ApiDocumentationOptions
>;
