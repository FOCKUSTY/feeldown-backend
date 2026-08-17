import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class BlockDeleteDto {
  @ApiProperty({
    description: "ID пользователя, которого нужно разблокировать",
  })
  @IsString()
  userId: string;
}
