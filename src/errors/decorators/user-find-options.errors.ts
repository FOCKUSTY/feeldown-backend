import { HttpStatus } from "@nestjs/common";
import { fockerorFactory } from "../error.factory";

export const USER_FIND_OPTIONS_ERRORS = fockerorFactory.execute(
  "USER FIND OPTIONS EXCEPTIONS",
  {
    PARAMETER_IS_NOT_DEFINED: {
      message: "Parameter ${{ parameter }} is not defined",
      description: "Параметр ${{ parameter }} не был объявлен",
      status: HttpStatus.BAD_REQUEST,
    },
  },
);
