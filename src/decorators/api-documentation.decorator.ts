import type {
  ApiDocumentationOptions,
  ApiParameterIn,
  ApiParameterInType,
} from "@/types";
import { applyDecorators } from "@nestjs/common";
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiHeader,
  ApiBody,
  ApiResponse,
} from "@nestjs/swagger";

const parameterDecorators: {
  [Key in ApiParameterIn]: (
    parameter: ApiParameterInType<Key>,
  ) => MethodDecorator;
} = {
  path: ApiParam,
  query: ApiQuery,
  header: ApiHeader,
  cookie: ApiParam,
};

export function ApiDocumentation(options: ApiDocumentationOptions) {
  const decorators: MethodDecorator[] = [];
  const { parameters, requestBody, responses, ...operationRest } = options;
  decorators.push(ApiOperation(operationRest));

  if (parameters) {
    for (const parameter of parameters) {
      const decorator = parameterDecorators[parameter.in];
      if (!decorator) {
        continue;
      }

      decorators.push(decorator(parameter as any));
    }
  }

  if (requestBody) {
    decorators.push(ApiBody(requestBody));
  }

  if (responses) {
    for (const [status, response] of Object.entries(responses)) {
      decorators.push(
        ApiResponse({
          status: parseInt(status),
          ...response,
        }),
      );
    }
  }

  return applyDecorators(...decorators);
}
