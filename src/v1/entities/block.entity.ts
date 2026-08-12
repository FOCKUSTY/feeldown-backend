import type { Block } from "@1/types";

import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsDate, IsUUID } from "class-validator";
import { Type } from "class-transformer";

@ApiSchema({ name: "BlockSchema" })
export class BlockEntity implements Block {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  blockerId: string;

  @ApiProperty()
  @IsUUID()
  blockedId: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}
