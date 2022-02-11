import { JobController } from './job.controller';
import { JobService } from './job.service';
import { forwardRef, Module } from '@nestjs/common';
import {
    ClientFeedback,
    InterviewTime,
    Job,
    JobClientContact,
} from 'src/schemas/job.schema';
import { TypegooseModule } from 'nestjs-typegoose';

import { ClientModule } from 'src/client/client.module';
import { JobClientContactService } from './job-client-contact.service';
import { MapperService } from 'src/shared/mapper/mapper.service';
import { CandidateModule } from 'src/candidate/candidate.module';
import { AwsModule } from 'src/aws/aws.module';
import { InterviewTimeService } from 'src/interviewTime/interviewTime.service';
import { ClientContact } from 'src/schemas/client.schema';
import { Candidate, CandidateJob } from 'src/schemas/candidate.schema';
import { InterviewNotifi } from 'src/client/interview_notifi.service';
import { MailService } from 'src/mail/mail.service';
import { MailLogs } from 'src/schemas/mailLog.schema';

//import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypegooseModule.forFeature([
            Job,
            JobClientContact,
            ClientFeedback,
            InterviewTime,
            ClientContact,
            Candidate,
            CandidateJob,
            MailLogs
        ]),
        forwardRef(() => ClientModule),
        forwardRef(() => CandidateModule),
        MapperService,
        AwsModule,
    ],
    controllers: [JobController],
    providers: [JobService, JobClientContactService, InterviewTimeService, InterviewNotifi, MailService],
    exports: [JobService, JobClientContactService],
})
export class JobModule {}
