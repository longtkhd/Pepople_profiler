import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsArray, IsMongoId } from 'class-validator';
import { FilterQuery } from 'mongoose';
import { ObjectId } from 'mongodb';

import { PaginationDto } from '../../shared/base.dto';

import { InterviewStatus, Job, JobStatus } from 'src/schemas/job.schema';

export class JobClientContactFilterDto {
    @ApiProperty()
    @IsOptional()
    client_id?: string;

    @ApiProperty()
    @IsOptional()
    job_id?: string;
}
export class ChangeStatusInterviewDto {
    @ApiProperty()
    status: number;
    @ApiProperty()
    client_contact_id?: string;
}
export class JobFilterParamDto extends PaginationDto {
    @ApiProperty()
    @IsMongoId()
    @IsOptional()
    recruiter_id?: string;

    @ApiProperty()
    @IsMongoId()
    @IsOptional()
    agency_id?: string;

    @ApiProperty()
    @IsMongoId()
    @IsOptional()
    client_id?: string;

    @ApiProperty()
    @IsMongoId()
    @IsOptional()
    exclude_candidate_id?: string;

    @ApiProperty()
    @IsArray()
    @IsOptional()
    exclude_job_id?: string[];

    @ApiProperty({ enum: JobStatus, enumName: 'JobStatus' })
    status: [JobStatus];

    public buildFilterQuery(): FilterQuery<Job> {
        const query: FilterQuery<Job> = {};
        if (this.recruiter_id) {
            query.assigned_user = new ObjectId(this.recruiter_id);
        }
        if (this.agency_id) {
            query.agency_id = new ObjectId(this.agency_id);
        }
        if (this.status) {
            query.status = {
                $in: this.status,
            };
        }
        if (this.exclude_job_id && this.exclude_job_id.length) {
            query._id = {
                $nin: this.exclude_job_id.map((x) => new ObjectId(x)),
            };
        }
        if (this.client_id) {
            query.client_id = new ObjectId(this.client_id);
        }

        if (this.keyword && this.keyword.trim().length > 0) {
            query.$text = {
                $search: `"${this.keyword}"`,
            };
        }
        query.is_deleted = { $ne: true };
        return query;
    }
}

export class CreateJobDto {
    @ApiProperty()
    @Expose()
    business_name: string;

    @ApiProperty()
    @Expose()
    contact_email: string;

    @ApiProperty()
    @Expose()
    @IsOptional()
    job_title: string;

    @ApiProperty()
    @Expose()
    @IsOptional()
    first_name: string;

    @ApiProperty()
    @Expose()
    @IsOptional()
    last_name: string;

    @ApiProperty()
    @Expose()
    @IsOptional()
    contact_number: string;

    @ApiProperty()
    @Expose()
    @IsOptional()
    client_id: string;

    @ApiProperty()
    @Expose()
    @IsOptional()
    client_contact_id: string;

    @ApiProperty()
    @Expose()
    @IsOptional()
    work_type: string;

    @ApiProperty()
    @Expose()
    @IsOptional()
    recruitment_activity: JobRecruitmentActivityDto[];
}

export class AddJobContactDto {
    @ApiProperty()
    job_id: string;

    @ApiProperty()
    contact_id: string;
}

export class ChangeJobStatusDto {
    @ApiProperty()
    status: number;

    @ApiProperty()
    @IsArray()
    job_id: [string];
}

export class ChangeJobRecruiterDto {
    @ApiProperty()
    @IsMongoId()
    assign_user: string;

    @ApiProperty()
    @IsArray()
    job_id: [string];
}

export class UpdateJobRequestDto {
    @ApiProperty()
    @IsOptional()
    work_type: string;

    @ApiProperty()
    @IsOptional()
    job_title: string;
}

export class JobRecruitmentActivityDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    icon: string;

    @ApiProperty()
    @Expose()
    key: any;

    @ApiProperty()
    @Expose()
    value: any;
}
export class UpdateJobRecruitmentActivityDto {
    recruitment_activity: JobRecruitmentActivityDto[];
    exclude_from_report: boolean;
}
