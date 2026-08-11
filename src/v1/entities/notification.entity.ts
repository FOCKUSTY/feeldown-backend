import type { Notification } from "@1/types";
import { NotificationType, ReferenceType } from "@1/types";

import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import {
  IsUUID,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDate,
} from "class-validator";
import { Type } from "class-transformer";

@ApiSchema({ name: "NotificationSchema" })
export class NotificationEntity implements Notification {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  recipientId: string;

  @ApiProperty({ nullable: true })
  @IsUUID()
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
