import type { Post } from "@1/types";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema({
  name: "PostSchema",
})
export class PostEntity implements Post {
  @ApiProperty({
    example: "b85227f2-6852-4242-a169-a0d9c0c88e31",
  })
  id: string;

  @ApiProperty({
    example: "6fbafe80-81a0-4ea8-9571-a8efa56fc66e",
  })
  userId: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 256,
    example: "Самый крутой пост",
  })
  title: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 256,
    example: "best_post",
  })
  postname: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 8192,
    example:
      "IyDQn9C+0YfQtdC80YMgYmFzZTY0Pw0KDQrQmtCw0LbQtdGC0YHRjyDQvtC9INGD0LbQuNC80LDQtdGCINCx0L7Qu9GM0YjQvtC5INC+0LHRitC10Lwg0YLQtdC60YHRgtCwLCDQstC+0YIg0L/QviDRjdGC0L7QvNGD",
  })
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export type { Post };
