import type { User } from "@1/types";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema({
  name: "UserSchema",
})
export class UserEntity implements User {
  @ApiProperty({
    example: "cdb0fa08-cefb-46d0-b75c-a0cb8c57c024",
  })
  id: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 1024,
  })
  description: string;

  @ApiProperty({
    minLength: 3,
    maxLength: 32,
    example: "fockusty",
  })
  username: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 128,
    example: "FOCKUSTY",
  })
  nickname: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;
}

export type { User };
