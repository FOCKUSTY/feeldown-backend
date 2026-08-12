import type { Notification } from "@1/types";
import { NotificationType, ReferenceType } from "@1/types";

import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import {
  IsUUID as IsUuid,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDate,
} from "class-validator";
import { Type } from "class-transformer";
import { Schema } from "@1/enums";

@ApiSchema({ name: Schema.NOTIFICATION })
export class NotificationEntity implements Notification {
  @ApiProperty()
  @IsUuid(7)
  id: string;

  @ApiProperty()
  @IsUuid(7)
  recipientId: string;

  @ApiProperty({ nullable: true })
  @IsUuid(7)
  @IsOptional()
  actorId: string | null;

  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ enum: ReferenceType })
  @IsEnum(ReferenceType)
  referenceType: ReferenceType;

  @ApiProperty()
  @IsString()
  referenceId: string;

  @ApiProperty()
  @IsBoolean()
  readed: boolean;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}

export type { Notification };
