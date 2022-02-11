import { AgencyService } from './agency.service'
import { AgencyController } from './agency.controller'
import { forwardRef, Module } from '@nestjs/common'
import { Agency, Subscription } from '../schemas/agency.schema'

import { AwsModule } from '../aws/aws.module'
import { UserModule } from '../user/user.module'

import { TypegooseModule } from 'nestjs-typegoose'
import { RecruiterModule } from '../recruiter/recruiter.module'
import { PackageModule } from 'src/package/package.module'
import { SubscriptionService } from './agency_subscription.service'
import { MailModule } from 'src/mail/mail.module'
import { PaymentHistory } from 'src/schemas/payment-history.schema'
import { PaymentHistoryService } from './payment-history.service'
import { DaxtraIntegrationModule } from 'src/daxtra.Integration/daxtra-integration.module'
import { CandidateModule } from 'src/candidate/candidate.module'

@Module({
    imports: [
        TypegooseModule.forFeature([Agency, Subscription, PaymentHistory]),
        forwardRef(() => RecruiterModule),
        MailModule,
        AwsModule, forwardRef(() => UserModule),
        forwardRef(() => PackageModule),
        forwardRef(() => DaxtraIntegrationModule),
        forwardRef(() => CandidateModule),
    ],
    controllers: [
        AgencyController
    ],
    providers: [
        AgencyService, SubscriptionService, PaymentHistoryService
    ],
    exports: [AgencyService, SubscriptionService]
})
export class AgencyModule { }
