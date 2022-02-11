import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer/decorators'
import { IsMongoId, IsOptional } from 'class-validator'
import { ObjectID as DBObjectID } from 'mongodb'

import { PaginationDto } from '../../shared/base.dto'
import { BaseModel } from '../../schemas/base.model'


export class NotificationFilterParam extends PaginationDto {
  @ApiProperty()
  @IsOptional()
  lastSeenNotification?: Date
}

export class NotificationDto extends BaseModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @IsMongoId()
  @Type(() => DBObjectID)
  sender_id: DBObjectID;

  @ApiProperty()
  @IsMongoId()
  @Type(() => DBObjectID)
  receiver_id: DBObjectID;

  @ApiProperty()
  created_date: Date;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  type: number;

  @ApiProperty()
  status: number;

  @ApiProperty()
  reference_id: string;

  @ApiProperty()
  is_deleted: boolean;
}

export class UpdateNotificationState extends NotificationDto {
  status = 0;
  is_deleted = false;
  public prepareDelete(uuid:string) {
      this.sender_id = null,
      this.receiver_id = null,
      this.type = null,
      this.content = `deleted${uuid}`
      this.reference_id = `deleted${uuid}`
  }
}