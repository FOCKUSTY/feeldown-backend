import type { FriendRequest } from "@1/types";
import { UpdateFriendship } from "@1/enums";

import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

@ApiSchema({
  name: "FriendshipUpdateDto",
})
export class FriendshipUpdateDto implements Partial<FriendRequest> {
  @ApiProperty({
    description: "Статус отношений",
    enum: UpdateFriendship,
  })
  @IsEnum(UpdateFriendship)
  status: UpdateFriendship;
}
