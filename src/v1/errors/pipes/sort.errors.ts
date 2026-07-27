import { HttpStatus } from "@nestjs/common";

import { fockerorFactory } from "@/errors";
import { AVAILABLE_SORT_ORDERING, AVAILABLE_SORT_TYPES } from "@1/constants";

export const SORT_ERRORS = fockerorFactory.execute("SORT EXCEPTION", {
  SORT_ORDERING_IS_NOT_VALIDED: {
    message: `sort ordering can be: ${AVAILABLE_SORT_ORDERING.join(",")}`,
    description: `Упорядочивание может быть только ${AVAILABLE_SORT_ORDERING.join(",")}`,
    status: HttpStatus.BAD_REQUEST,
  },

  SORT_TYPE_IS_NOT_VALIDED: {
    message: `sort type can be: ${AVAILABLE_SORT_TYPES.join(",")}`,
    description: `сортировка может быть только по: ${AVAILABLE_SORT_TYPES.join(",")}`,
    status: HttpStatus.BAD_REQUEST,
  },
});

export default SORT_ERRORS;
