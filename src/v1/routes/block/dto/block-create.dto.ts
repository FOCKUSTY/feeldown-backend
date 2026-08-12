import { Schema } from "@1/enums";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsString } from "class-validator";

@ApiSchema({ name: Schema.BLOCK_CREATE })
export class BlockCreateDto {
  @ApiProperty()
  @IsString()
  blockedId: string;
}
