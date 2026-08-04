import type { PostFilter } from "@1/types";

import {
  AVAILABLE_SORT_ORDERING,
  AVAILABLE_POST_SORT_TYPES,
} from "@1/constants";
import { HttpException, PipeTransform } from "@nestjs/common";
import { SORT_ERRORS } from "@1/errors";

abstract class BaseSortPipe<T extends string> implements PipeTransform {
  protected constructor(
    private readonly available: readonly T[],
    private readonly exception: HttpException,
  ) {}

  public transform(value: string) {
    return this.validate(value);
  }

  protected validate(value: string) {
    const valided = (this.available as readonly string[]).includes(value);
    if (valided) {
      return value as T;
    }

    return this.exception;
  }
}

export class SortOrderingPipe extends BaseSortPipe<PostFilter["sort"]> {
  public constructor() {
    super(
      AVAILABLE_SORT_ORDERING,
      SORT_ERRORS.SORT_ORDERING_IS_NOT_VALID.exception,
    );
  }
}

export class SortByPipe extends BaseSortPipe<PostFilter["sortBy"]> {
  public constructor() {
    super(
      AVAILABLE_POST_SORT_TYPES,
      SORT_ERRORS.SORT_TYPE_IS_NOT_VALID.exception,
    );
  }
}
