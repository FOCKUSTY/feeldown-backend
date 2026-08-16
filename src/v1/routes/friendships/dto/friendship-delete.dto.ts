import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class FriendshipDeleteDto {
  @ApiProperty({
    description: "id друга",
  })
  @IsString()
  userId: string;
}
