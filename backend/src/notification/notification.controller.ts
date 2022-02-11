import { Controller, Get, Post, Body, Param, Delete, Put, HttpStatus, UseGuards, Res, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JWTAuthGuard } from '../auth/guards/auth.guard'
import { CreateNotificationDto } from './dto/create-notification.dto'
import { GetNotificationDto } from './dto/get-notification.dto'
import { DeleteNotificationsReqDto, UpdateNotificationReqDto } from './dto/update-notification.dto'
import { NotificationFilterParam } from './dto/notification.dto'
import { BaseResponse } from 'src/shared/base.dto'
import { User } from '../shared/decorators/user.decorator'

import { NotificationService } from './notification.service'

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post()
    create(@Body() createNotificationDto: CreateNotificationDto) {
        return this.notificationService.create(createNotificationDto)
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard)
    @ApiOperation({ summary: 'API to get notifications of user' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetNotificationDto,
        description: 'API to get notifications of user'
    })
    async findAll(
        @Res() res,
        @User() user,
        @Query() notificationFilterParam: NotificationFilterParam,
    ): Promise<BaseResponse<GetNotificationDto>> {
        const response: BaseResponse<GetNotificationDto> = { success: true }
        const userId = user.id
        try {
            const notifications = await this.notificationService.paginateList(userId, notificationFilterParam)
            response.data = notifications
        } catch (error) {
            response.success = false
            response.error = error
        }
        return res.status(HttpStatus.OK).json(response)
    }

    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard)
    @ApiOperation({ summary: 'API to update a notification' })
    async update(
        @Res() res,
        @Body() body: UpdateNotificationReqDto,
        @Param('id') id: string,
    ): Promise<BaseResponse<any>> {
        const response: BaseResponse<any> = { success: true }
        try {
            const notification = await this.notificationService.updateNotification(id, body)
            response.data = notification
            return res.status(HttpStatus.OK).json(response)
        } catch (error) {
            response.success = false
            response.error = error.message
            return res.status(HttpStatus.BAD_REQUEST).json(response)
        }
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard)
    @ApiOperation({ summary: 'API to delete a notification' })
    async remove(
        @Res() res,
        @Param('id') id: string,
    ): Promise<BaseResponse<any>> {
        const response: BaseResponse<any> = { success: true }
        try {
            const notification = await this.notificationService.deleteNotification(id)
            response.data = notification
        } catch (error) {
            response.success = false
            response.error = error.message
        }
        return res.status(HttpStatus.OK).json(response)
    }


    @Post('deleteNotification')
    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard)
    @ApiOperation({ summary: 'API to delete multiple notification' })
    async removeMultiple(
        @Res() res,
        @Body() ids: DeleteNotificationsReqDto,
    ): Promise<BaseResponse<any>> {
        const response: BaseResponse<any> = { success: true }
        try {
            if (!ids && !ids.list) {
                return res.status(HttpStatus.OK).json(response)
            }
            const promises = ids.list.map(async id => {
                const notification = await this.notificationService.deleteNotification(id)
                return notification
            })
            response.data = Promise.all(promises)
        } catch (error) {
            response.success = false
            response.error = error.message
        }
        return res.status(HttpStatus.OK).json(response)
    }

}
