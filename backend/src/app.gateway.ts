import { Logger } from '@nestjs/common'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line no-unused-vars
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'

import { NotificationService } from './notification/notification.service'
import { UsersService } from './user/user.service'
import { MailService } from './mail/mail.service'
import { SocketService } from './notification/socket.service'

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private readonly notificationService: NotificationService,
        private readonly userService: UsersService,
        private readonly mailService: MailService,
        private readonly socketService: SocketService
    ) { }
    private logger = new Logger('AppGateway');
    @WebSocketServer() server;

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // eslint-disable-next-line no-unused-vars
    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client conected: ${client.id}`)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // eslint-disable-next-line no-unused-vars
    afterInit(server: Server) {
        this.logger.log('Initialized')
        this.socketService.socket = server
    }

    @SubscribeMessage('clientSendNotification')
    async handleMessage(client: Socket, payload: any): Promise<any> {
        const {
            sender_id,
            receiver_id,
            type
        } = payload
        const receiver = await this.userService.findById(receiver_id)

        if (receiver) {
            const notificationSettings = receiver.notification_settings
            const receiverNotification = notificationSettings.find(noti => noti.type === type)

            if (receiverNotification) {
                // check for the website and email notification 

                if (receiverNotification.by_website) {
                    // Save notification to db
                    const notification_db = await this.notificationService.create(payload)

                    // emit notification to receiver

                    this.server.emit(
                        'serverSendNotification', notification_db
                    )
                }
                if (receiverNotification.by_email) {
                    // send email to receiver
                    await this.mailService.SendNotification(receiver, payload, sender_id)
                }
            }
        }
    }
}
