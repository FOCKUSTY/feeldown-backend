import type { PipeTransform, Type } from "@nestjs/common";

export type Pipe =
  PipeTransform<unknown, unknown> | Type<PipeTransform<unknown, unknown>>;
