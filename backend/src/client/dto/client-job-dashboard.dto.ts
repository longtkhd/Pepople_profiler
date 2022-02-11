import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { AgencyInfoDto, CompanyInfoDto } from 'src/agency/dto/agency'
import { CandidateJobFeedbackStatus } from 'src/candidate/dto/candidate'
import { JobDetailDto, OutJobClientContactDto } from 'src/job/dto/job.res.dto'
import { Agency } from 'src/schemas/agency.schema'
import { JobClientContact } from 'src/schemas/job.schema'
import { User } from 'src/schemas/user.schema'

export class ClientJobDashboardDetail {
    @ApiProperty()
    @Expose()
    @Type(() => JobClientContact)
    job_client_contact: OutJobClientContactDto

    @ApiProperty()
    @IsOptional()
    @Type(() => JobDetailDto)
    job_detail: JobDetailDto

    @ApiProperty()
    @Type(() => CandidateJobFeedbackStatus)
    @IsOptional()
    candidate_list: CandidateJobFeedbackStatus[]

    @ApiProperty()
    @Type(() => CompanyInfoDto)
    @IsOptional()
    company_info: CompanyInfoDto

    @ApiProperty()
    @IsOptional()
    agency_id: string

    @ApiProperty()
    @IsOptional()
    agency: AgencyInfoDto

    @ApiProperty()
    @IsOptional()
    invited_by: string;

    @ApiProperty()
    @IsOptional()
    phone: string;
}
