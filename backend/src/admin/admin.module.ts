import { AdminService } from './admin.service'
import { Controller, forwardRef, Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { ApiTags } from '@nestjs/swagger'
import { AgencyModule } from 'src/agency/agency.module'
import { TypegooseModule } from 'nestjs-typegoose'
import { PackageModule } from 'src/package/package.module'
import { Country } from 'src/schemas/country.schema'
import { CsvModule } from 'nest-csv-parser/dist/csv.module'
import { Industry } from 'src/schemas/industry.schema'
import { AssessmentIndustry, AssessmentType } from 'src/schemas/assessments.schema'
import { UserModule } from 'src/user/user.module'
import { DaxtraIntegrationModule } from 'src/daxtra.Integration/daxtra-integration.module'
import { CandidateModule } from 'src/candidate/candidate.module'
import { JobModule } from 'src/job/job.module'
import { ClientModule } from 'src/client/client.module'
//import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypegooseModule.forFeature([Country, Industry, AssessmentIndustry, AssessmentType]),
        AgencyModule, 
        PackageModule, 
        CsvModule, 
        forwardRef(() => UserModule), 
        forwardRef(() => ClientModule), 
        forwardRef(() => JobModule),
        DaxtraIntegrationModule, 
        CandidateModule
    ],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService]
})
@Controller('admin')
@ApiTags('admin')
export class AdminModule { }
