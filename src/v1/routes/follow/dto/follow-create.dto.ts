import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class FollowCreateDto {
  @ApiProperty()
  @IsString()
  followeeId: string;
}
