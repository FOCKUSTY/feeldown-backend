import type { ExecutionContext } from "@nestjs/common";
import type { Request } from "express";

import { Parameters } from "@1/enums";

import { createParameterDecoratorWithRequiredPipes } from "@/utils";
import { USER_FIND_OPTIONS_ERRORS } from "@/errors";
import { UserFindOptionsPipe } from "@/pipes";

export const UserFindOptions = createParameterDecoratorWithRequiredPipes(
  (parameter: Parameters, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const value = request.params[parameter];
    if (!value) {
      throw USER_FIND_OPTIONS_ERRORS.PARAMETER_IS_NOT_DEFINED.execute({
        parameter,
      });
    }

    return {
      value,
      request,
    };
  },
  [UserFindOptionsPipe],
);
