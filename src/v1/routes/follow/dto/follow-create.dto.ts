import { Schema } from "@1/enums";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsString } from "class-validator";

@ApiSchema({ name: Schema.FOLLOW_CREATE })
export class FollowCreateDto {
  @ApiProperty()
  @IsString()
  followeeId: string;
}
