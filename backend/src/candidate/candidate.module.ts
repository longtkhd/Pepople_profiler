import { forwardRef, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AgencyModule } from 'src/agency/agency.module';
import { AwsModule } from 'src/aws/aws.module';
import { DaxtraIntegrationModule } from 'src/daxtra.Integration/daxtra-integration.module';
import { JobModule } from 'src/job/job.module';
import { MailModule } from 'src/mail/mail.module';
import { ProjectAssessmentModule } from 'src/projectAssessment/projectAssessment.module';

import {
    Candidate,
    CandidateDocument,
    CandidateJob,
    AssessmentReport,
} from 'src/schemas/candidate.schema';
import { InterviewTime, Job, JobClientContact } from 'src/schemas/job.schema';
import { TPTestsIntegrateModule } from 'src/tptests/tptestsintegrate.module';
import { CandidateAssessmentService } from './candidate-assessment.service';
import { CandidateDocumentService } from './candidate-document.service';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { CandidateJobService } from './job-candidate.service';
import { UserModule } from '../user/user.module';
import { Agency } from 'src/schemas/agency.schema';
import { InterviewTimeService } from 'src/interviewTime/interviewTime.service';
import { ClientContact } from 'src/schemas/client.schema';
import { ClientContactService } from 'src/client/client_contact.service';
import { InterviewNotifi } from 'src/client/interview_notifi.service';

@Module({
    imports: [
        TypegooseModule.forFeature([
            Candidate,
            CandidateJob,
            CandidateDocument,
            AssessmentReport,
            JobClientContact,
            Job,
            Agency,
            InterviewTime,
            ClientContact,
        ]),
        forwardRef(() => JobModule),
        TPTestsIntegrateModule,
        forwardRef(() => DaxtraIntegrationModule),
        forwardRef(() => AgencyModule),
        UserModule,
        MailModule,
        ProjectAssessmentModule,
        AwsModule,
    ],
    controllers: [CandidateController],
    providers: [
        CandidateService,
        CandidateJobService,
        CandidateDocumentService,
        CandidateAssessmentService,
        CandidateJobService,
        InterviewTimeService,
        ClientContactService,
        InterviewNotifi
    ],
    exports: [
        CandidateService,
        CandidateJobService,
        CandidateDocumentService,
        CandidateAssessmentService,
    ],
})
export class CandidateModule {}
