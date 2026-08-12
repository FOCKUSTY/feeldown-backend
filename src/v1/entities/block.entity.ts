import type { Block } from "@1/types";

import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsDate, IsUUID as IsUuid } from "class-validator";
import { Type } from "class-transformer";

@ApiSchema({ name: "BlockSchema" })
export class BlockEntity implements Block {
  @ApiProperty()
  @IsUuid(7)
  id: string;

  @ApiProperty()
  @IsUuid(7)
  blockerId: string;

  @ApiProperty()
  @IsUuid(7)
  blockedId: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}
