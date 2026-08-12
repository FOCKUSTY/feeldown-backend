import { Schema } from "@1/enums";
import type { FriendRequest } from "@1/types";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsString } from "class-validator";

@ApiSchema({
  name: Schema.FRIENDSHIP_CREATE,
})
export class FriendshipCreateDto implements Partial<FriendRequest> {
  @ApiProperty({
    description: "Получатель",
  })
  @IsString()
  receiverId: string;
}
