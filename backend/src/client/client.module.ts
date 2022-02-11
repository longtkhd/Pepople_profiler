import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { forwardRef, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Client, ClientContact } from 'src/schemas/client.schema';
import { UserModule } from 'src/user/user.module';
import { JobModule } from 'src/job/job.module';
import { ClientContactService } from './client_contact.service';
import { MailModule } from 'src/mail/mail.module';
import { ClientJobDashboardController } from './client-job-dashboard.controller';
import { CandidateModule } from 'src/candidate/candidate.module';
import { ClientJobDashboardService } from './client-job-dashboard.service';
import { AgencyModule } from 'src/agency/agency.module';
import {
    ClientFeedback,
    InterviewTime,
    JobClientContact,
} from 'src/schemas/job.schema';
import { NotificationModule } from 'src/notification/notification.module';
import { InterviewTimeService } from 'src/interviewTime/interviewTime.service';
import { Candidate, CandidateJob } from 'src/schemas/candidate.schema';
import { InterviewNotifi } from './interview_notifi.service';

@Module({
    imports: [
        TypegooseModule.forFeature([
            Client,
            ClientContact,
            ClientFeedback,
            InterviewTime,
            JobClientContact,
            Candidate,
            CandidateJob,
        ]),
        forwardRef(() => JobModule),
        forwardRef(() => UserModule),
        forwardRef(() => AgencyModule),
        forwardRef(() => CandidateModule),
        forwardRef(() => MailModule),
        forwardRef(() => NotificationModule),
    ],
    controllers: [ClientController, ClientJobDashboardController],
    providers: [
        ClientService,
        ClientContactService,
        ClientJobDashboardService,
        InterviewTimeService,
        InterviewNotifi,
    ],
    exports: [ClientService, ClientContactService, ClientJobDashboardService],
})
export class ClientModule {}
