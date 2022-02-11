import { Injectable, Logger } from '@nestjs/common'
import { Server } from 'socket.io'
import { NotificationService } from './notification.service'
import { UsersService } from '../user/user.service'
import { MailService } from '../mail/mail.service'
import { CreateNotificationDto } from './dto/create-notification.dto'
import { ObjectId } from 'mongodb'
import { Notification, NotificationType } from '../schemas/notification.schema'
import { FilterQuery } from 'mongoose'

@Injectable()
export class SocketService {
    public socket: Server = null;
    private logger = new Logger('SocketService');
    constructor(
        private readonly notificationService: NotificationService,
        private readonly userService: UsersService,
        private readonly mailService: MailService,
    ) { }

    /**
     * Send notice to all user role admin
     * @param: {string} content: content notification
     * @param: {number} type: type notifiaction
     * @param: {string} senderId: Id user send notifivation
     */
    async sendNoticeToAdmin(
        title: string,
        content: string,
        type: NotificationType,
        senderId?: string
    ): Promise<void> {
        const admins = await this.userService.findUserByRole('admin')
        if (!admins.length) return
        for (const admin of admins) {
            await this.makeNotification(admin.id, title, content, type, senderId, true)
        }
    }

    /**
     * Send singleton notice in monthly
     * @param: {string} content: content notification
     * @param: {number} type: type notifiaction
     * @param: {string} senderId: Id user send notifivation
     */
    async sendSingleNoticeInMonthly(
        receiverId: string,
        title: string,
        content: string,
        type: NotificationType,
        senderId?: string,
    ): Promise<void> {
        const currentMonth = new Date().getMonth() + 1
        const currentYear = new Date().getFullYear()
        const query: FilterQuery<Notification> = {
            $and: [
                { $expr: { $eq: [{ $month: '$created_date' }, currentMonth] } },
                { $expr: { $eq: [{ $year: '$created_date' }, currentYear] } },
                { receiver_id: new ObjectId(receiverId), type: type }
            ]
        }
        const notice = await this.notificationService.findOne(query)
        if (notice) return
        await this.makeNotification(receiverId, title, content, type, senderId)
    }

    /**
     * Make notification
     * @param: {string} receiverId: Id user receiver notification
     * @param: {string} content: content notification
     * @param: {number} type: type notifiaction
     * @param: {string} senderId: Id user send notifivation
     * **/
    async makeNotification(
        receiverId: string,
        title: string,
        content: string,
        type: NotificationType,
        senderId?: string,
        isAdmin?: boolean,
    ): Promise<void> {
        try {
            const notification = new CreateNotificationDto()
            notification.receiver_id = new ObjectId(receiverId)
            notification.type = type
            notification.content = content
            notification.title = title
            if (senderId) notification.sender_id = new ObjectId(senderId)
            await this.handleGenerateAndSendNotification(notification, isAdmin)
        } catch (e) { this.logger.error(e) }
    }

    /**
     * Save notifitaction to database and send notifications to receiver
     * @param: { CreateNotificationDto } payload: data notification
     * */
    async handleGenerateAndSendNotification(
        payload: CreateNotificationDto,
        isAdmin?: boolean,
    ): Promise<void> {
        try {
            const {
                sender_id,
                // eslint-disable-next-line no-unused-vars
                receiver_id,
                type
            } = payload
            const notification_db = await this.notificationService.create(
                payload
            )
            const receiver = await this.userService.findById(
                payload.receiver_id.toString()
            )
            const sender = sender_id ? await this.userService.findById(
                sender_id?.toString()
            ) : undefined
            if (receiver && notification_db) {
                const notificationSettings = receiver.notification_settings
                const receiverNotification = notificationSettings.find(
                    noti => noti.type === type
                )
                if (receiverNotification) {
                    if (receiverNotification.by_website) {
                        this.socket.emit(
                            'serverSendNotification', notification_db
                        )
                    }
                    if (receiverNotification.by_email) {
                        await this.mailService.SendNotification(
                            receiver,
                            notification_db,
                            sender
                        )
                    }
                }
                if (isAdmin) {
                    await this.mailService.SendNotification(
                        receiver,
                        notification_db
                    )
                }
            }
        } catch (e) { this.logger.error(e) }
    }
}