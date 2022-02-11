import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class UpdateNotificationReqDto {
    @ApiProperty()
    @IsOptional()
    status: number
}

export class DeleteNotificationsReqDto {
    @ApiProperty()
    list: string[]
}