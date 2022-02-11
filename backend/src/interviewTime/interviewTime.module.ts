
import { forwardRef, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Client, ClientContact } from 'src/schemas/client.schema';
import { UserModule } from 'src/user/user.module';
import { JobModule } from 'src/job/job.module';
import { CandidateModule } from 'src/candidate/candidate.module';
import { AgencyModule } from 'src/agency/agency.module';
import {
    ClientFeedback,
    InterviewTime,
    JobClientContact,
} from 'src/schemas/job.schema';
import { Candidate, CandidateJob } from 'src/schemas/candidate.schema';
import { InterviewController } from './invterviewTime.controller';
import { InterviewTimeService } from './interviewTime.service';
import { InterviewNotifi } from 'src/client/interview_notifi.service';
import { MailService } from 'src/mail/mail.service';
import { MailLogs } from 'src/schemas/mailLog.schema';
import { SESManagerService } from 'src/aws/ses-manager.service';
import { S3ManagerService } from 'src/aws/s3-manager.service';

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
            MailLogs
        ]),
        forwardRef(() => JobModule),
        forwardRef(() => UserModule),
        forwardRef(() => AgencyModule),
        forwardRef(() => CandidateModule),
    ],
    controllers: [InterviewController],
    providers: [InterviewTimeService, InterviewNotifi, MailService, SESManagerService, S3ManagerService],
    exports: [InterviewTimeModlue],
})
export class InterviewTimeModlue {}
