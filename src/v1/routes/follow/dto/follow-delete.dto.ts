import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class FollowDeleteDto {
  @ApiProperty({
    description: "id пользователя",
  })
  @IsString()
  userId: string;
}
