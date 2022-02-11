import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer/decorators'
import { IsMongoId } from 'class-validator'
import { ObjectID as DBObjectID } from 'mongodb'
export class CreateNotificationDto {
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
