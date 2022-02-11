import { ApiProperty } from '@nestjs/swagger'
import { IsArray } from 'class-validator'
import { Type } from 'class-transformer/decorators'

import { PaginationDto } from '../../shared/base.dto'
import {
    NotificationDto
} from './notification.dto'

export class GetNotificationDto extends PaginationDto {
  @Type(() => NotificationDto)
  @IsArray()
  @ApiProperty({ type: [NotificationDto] })
  notifications: NotificationDto[];
  
  @ApiProperty()
  un_read_count: number;
}