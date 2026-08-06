import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class BlockCreateDto {
  @ApiProperty()
  @IsString()
  blockedId: string;
}
