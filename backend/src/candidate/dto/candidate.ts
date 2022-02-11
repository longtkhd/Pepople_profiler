import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
    IsArray,
    IsMongoId,
    IsOptional,
    ValidateNested,
} from 'class-validator';
import { ObjectID } from 'mongodb';
import { FilterQuery } from 'mongoose';
import {
    Candidate,
    CandidateJob,
    CompetenceAssessmentWheels,
} from 'src/schemas/candidate.schema';
import { PaginationDto } from 'src/shared/base.dto';

export class CandidateFilterParamDto extends PaginationDto {
    public buildFilterQuery(): FilterQuery<Candidate> {
        const query: FilterQuery<Candidate> = {};
        if (this.agency_id) query.agency_id = new ObjectID(this.agency_id);
        //if (this.job_id) query.job_id = new ObjectID(this.job_id)
        if (this.created_by) query.created_by = new ObjectID(this.created_by);
        if (this.exclude_id && this.exclude_id.length) {
            query._id = {
                $nin: this.exclude_id.map((x) => new ObjectID(x)),
            };
        }
        return query;
    }

    @ApiProperty()
    agency_id: string;

    @ApiProperty()
    created_by: string;

    @ApiProperty()
    @IsOptional()
    @IsMongoId()
    not_in_job_id?: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    exclude_id?: string[];
}

export class CandidateAggregateFilterParamDto extends PaginationDto {
    @ApiProperty()
    job_id: string;

    @ApiProperty()
    agency_id: string;

    @ApiProperty()
    created_by: string;
}

export class CandidateSummary {
    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;
}

export class CandidateInfo {
    @ApiProperty()
    id: string;

    @ApiProperty()
    agency_id: string;

    @ApiProperty()
    @IsOptional()
    candidate_name: string;

    @ApiProperty()
    @IsOptional()
    phone: string;

    @ApiProperty()
    @IsOptional()
    candidate_email: string;

    @ApiProperty()
    @IsOptional()
    current_position: string;

    @ApiProperty()
    @IsOptional()
    current_employer: string;

    @ApiProperty()
    @IsOptional()
    exp_rem: string;

    @ApiProperty()
    @IsOptional()
    notice_period: string;

    @ApiProperty()
    @IsOptional()
    assessment_status: string;

    @ApiProperty()
    @IsOptional()
    tp_username: string;

    @ApiProperty()
    @IsOptional()
    linked_in_recommend: string;

    @ApiProperty()
    interview_status: number;
}

export class CandidateJobInfo extends CandidateInfo {
    @ApiProperty()
    job_id: string;

    @ApiProperty()
    job_title: string;
    static fromDB(dbo: CandidateJob) {
        const res = new CandidateJobInfo();
        if (dbo.candidate_id) {
            const candidate = dbo.candidate_id as Candidate;
            if (candidate.id) {
                res.id = candidate.id;
                res.candidate_name = candidate.candidate_name;
                res.candidate_email = candidate.candidate_email;
                res.current_position = candidate.current_position;
                res.current_employer = candidate.current_employer;
                res.exp_rem = candidate.exp_rem;
                res.notice_period = candidate.notice_period;
                res.interview_status = dbo.interview_status;
            }
        }
        return res;
    }
}

export class CandidateJobFeedbackStatus extends CandidateJobInfo {
    @ApiProperty()
    status: number;
}
export class AdditionalInfo {
    @ApiProperty()
    @IsOptional()
    name: string;

    @ApiProperty()
    @IsOptional()
    value: string;
}

export class UploadCVInfo extends CandidateInfo {}
export class InCandidateParseDto {
    @ApiProperty()
    agency_id: string;

    @ApiProperty()
    job_id: string;
}
export class CandidateParseResultDto {
    @ApiProperty()
    list: CandidateParseResult[];
}
export class CandidateParseResult extends CandidateInfo {
    @ApiProperty()
    parse_id: string;

    @ApiProperty()
    @IsOptional()
    parse_status: string;

    @ApiProperty()
    file_md5: string;

    @ApiProperty()
    file_name: string;
}

export class CandidateDetailDto extends CandidateInfo {
    @ApiProperty()
    resume_text: string;

    @Type(() => AdditionalInfo)
    @ApiProperty({ type: [AdditionalInfo] })
    @Expose()
    @IsOptional()
    additional_infos: AdditionalInfo[];

    @IsOptional()
    assessment_reports?: any[];

    @Type(() => CandidateSummary)
    @ApiProperty({ type: [CandidateSummary] })
    @IsOptional()
    @Expose()
    summaries: [CandidateSummary];

    @ApiProperty()
    @Expose()
    @IsOptional()
    background_check: boolean;

    @ApiProperty()
    @Expose()
    @IsOptional()
    include_assessment_report: boolean;

    @ApiProperty()
    @Expose()
    @IsOptional()
    background_comment: string;

    @ApiProperty()
    @Expose()
    @IsOptional()
    right_to_work: boolean;

    @Expose()
    @IsOptional()
    postalAddress: any;

    @ApiProperty()
    @Expose()
    @IsOptional()
    right_to_work_comment: string;

    @ApiProperty()
    @Expose()
    @IsOptional()
    linked_in_recommend: string;

    @Type(() => CompetenceAssessmentWheels)
    @ApiProperty()
    @IsOptional()
    recruiter_assessments: CompetenceAssessmentWheels;
    @IsOptional()
    CompetencyProfileReport: any[];
    @IsOptional()
    PersonalityProfileReport: any[];
}
export class CandidateDocumentDto {
    @Expose()
    @ApiProperty()
    @Expose()
    id: string;

    @Expose()
    @ApiProperty()
    file_name: string;

    @ApiProperty()
    @Expose()
    file_md5: string;

    @ApiProperty()
    @Expose()
    type: number;

    @ApiProperty()
    @Expose()
    is_public: boolean;

    @Expose()
    @ApiProperty()
    created_at: string;

    @ApiProperty()
    buffer: Buffer;
}
export class CandidateDocumentList extends PaginationDto {
    @Type(() => CandidateDocumentDto)
    @IsArray()
    @ApiProperty({ type: [CandidateDocumentDto] })
    documents: CandidateDocumentDto[];
}

export class CandidateListDto extends PaginationDto {
    @Type(() => CandidateInfo)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [CandidateInfo] })
    candidate_list: CandidateInfo[];
}

export class CandidateJobListDto {
    @Type(() => CandidateJobInfo)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [CandidateJobInfo] })
    candidate_list: CandidateJobInfo[];
}

export class OutCandidateJobAssessmentInvite {
    @ApiProperty()
    job_id: string;

    @ApiProperty()
    candidate_id: string;
    @ApiProperty()
    candidate_name: string;
    @ApiProperty()
    candidate_email: string;
    @ApiProperty()
    assessment_name: string;

    @ApiProperty()
    assessment_link: string;
    @ApiProperty()
    project_assessment: string;
    assessment_id: string;
}
