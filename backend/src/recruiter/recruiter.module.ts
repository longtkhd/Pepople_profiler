import { RecruiterService } from './recruiter.service'
import { RecruiterController } from './recruiter.controller'
import { forwardRef, Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { MailModule } from '../mail/mail.module'
import { TokenModule } from '../token/token.module'
import { DaxtraIntegrationModule } from 'src/daxtra.Integration/daxtra-integration.module'
import { CandidateModule } from 'src/candidate/candidate.module'
import { AgencyModule } from 'src/agency/agency.module';

@Module({
    imports: [forwardRef(() => UserModule), MailModule, TokenModule, forwardRef(() => DaxtraIntegrationModule), forwardRef(() => CandidateModule), forwardRef(() => AgencyModule)],
    exports: [RecruiterService],
    controllers: [
        RecruiterController,],
    providers: [
        RecruiterService,],
})
export class RecruiterModule { }
