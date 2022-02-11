import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { SubscriptionService } from 'src/agency/agency_subscription.service'
import { CandidateAssessmentService } from 'src/candidate/candidate-assessment.service'
import { Logger } from '@nestjs/common'
import { SocketService } from '../notification/socket.service'

@Injectable()
export class SchedulesService {
    private logger = new Logger('Schedules Service')
    constructor(
        private readonly subscriptionService: SubscriptionService,
        private readonly candidateAssessmentService: CandidateAssessmentService,
        private readonly socketService: SocketService
    ) { }

    @Cron('0 1 * * *')
    async handleCronSubscriptionPayment() {
        try {
            await this.subscriptionService.cronPaymentSubscription()
        } catch (error) {
            console.log(error)
            this.logger.error(error)
        }
    }
    
    @Cron('* 1 * * *')
    async handleCronCheckNotStartCandidateStatus() {
        try {
            await this.candidateAssessmentService.syncCandidateAssessments(['Not Started'])
        } catch (error) {
            console.log(error)
            this.logger.error(error)
        }
    }
    
    // @Cron('* 2 * * *')
    // async handleCronCheckInProgressCandidateStatus() {
    //     try {
    //         await this.candidateAssessmentService.syncCandidateAssessments(['In Progress'])
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    @Cron('0 3 * * *')
    async handleCronNotificationPaymentUnsuccess(): Promise<void>{
        try {
            const notifications = await this.subscriptionService.getAllPaymentUnsuccess()
            if(!notifications.length) return
            for (let notification of notifications){
                await this.socketService.handleGenerateAndSendNotification(
                    notification
                )
            }
        }catch (e) {this.logger.error(e) }
    }
}
