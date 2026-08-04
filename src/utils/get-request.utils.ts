import type { ExecutionContext, ParamDecoratorEnhancer } from "@nestjs/common";
import type { Pipe } from "@/types";

import { createParameterDecoratorWithRequiredPipes } from "./create-decorator.utils";

export const getRequestParameterDecorator = (
  pipes: Pipe[] = [],
  enchanters: ParamDecoratorEnhancer[] = [],
) => {
  const decorator = createParameterDecoratorWithRequiredPipes(
    (_, context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest<Request>();
      return request;
    },
    pipes,
    enchanters,
  );

  return decorator;
};
