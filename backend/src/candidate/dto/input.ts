import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator'

import { ObjectID } from 'mongodb'
import { FilterQuery } from 'mongoose'
import { InternetWebAddress, PostalAddress } from 'src/daxtra.Integration/dto/response.dto'
import { CandidateDocument, CandidateJob } from 'src/schemas/candidate.schema'
import { PaginationDto } from 'src/shared/base.dto'

export class CandidateJobFilterParamDto {
    public buildFilterQuery() {
        const query: FilterQuery<CandidateJob> = {}
        if (this.candidate_id) query.candidate_id = new ObjectID(this.candidate_id)
        if (this.job_id) query.job_id = new ObjectID(this.job_id)

        if (this.keyword && this.keyword.trim().length > 0) {
            query.$text = {
                $search: `"${this.keyword}"`
            }
        }
        return query
    }
    @ApiProperty()
    @IsOptional()
    job_id?: string;

    @ApiProperty()
    @IsOptional()
    keyword?: string;

    @ApiProperty()
    @IsMongoId()
    @IsOptional()
    candidate_id?: string;

    @ApiProperty()
    created_by: string;
}

export class InCandidateAssessmentDto {
    @ApiProperty()
    subject: string

    @ApiProperty()
    body: string

    @ApiProperty()
    @IsOptional()
    @IsMongoId()
    candidate_id?: string;

    @ApiProperty()
    @IsOptional()
    industry: string;

    @ApiProperty()
    @IsOptional()
    type: string;

    @ApiProperty()
    @IsOptional()
    @IsMongoId()
    job_id?: string;
}
export class CVParserFieldDto {
    email: string
    name: string
    current_possition: string
    current_employer: string
    phone: string
    InternetWebAddress: InternetWebAddress[]
    text_resume: string
    executiveSummary: string
    PostalAddress_main: PostalAddress
    public get linkedIn(): string {
        if (this.InternetWebAddress && this.InternetWebAddress.length) {
            const linkedIn = this.InternetWebAddress.find(x => x.type === 'linkedin')
            return linkedIn ? linkedIn.content : ''
        }
        return ''
    }

}

export class FilterAssessmentReport {

    @ApiProperty()
    @IsOptional()
    @IsMongoId()
    agency_id?: string;

    @ApiProperty()
    @IsOptional()
    from_date: string;

    @ApiProperty()
    @IsOptional()
    to_date: string;
}

export class DocumentFilterParamDto extends PaginationDto {
    public buildFilterQuery(): FilterQuery<CandidateDocument> {
        const query: FilterQuery<CandidateDocument> = {}
        return query
    }
}
export class CandidateJobFilterDto {
    @ApiProperty()
    @IsOptional()
    job_id: string;
}
export class GenerateReportQuery {
    @ApiProperty()
    @IsArray({ message: 'ARRAY_CANDIDATE_REQUIRED' })
    candidate_id: string[];

    @ApiProperty()
    @IsString({ message: 'JOB_ID_REQUIRED' })
    job_id: string;
}

export class GenerateReportInviteTokenQuery {
    @ApiProperty()
    @IsString({ message: 'INVITE_TOKEN_REQUIRED' })
    invite_token: string;

    @ApiProperty()
    @IsString({ message: 'CLIENT_CONTACT_REQUIRED' })
    client_contact_id: string;

    // @ApiProperty()
    // @IsString({ message: 'AGENCY_ID_REQUIRED' })
    // agency_id: string;

    @ApiProperty()
    @IsOptional()
    candidate_id?: string[];
}