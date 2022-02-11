import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import { Expose, Type } from 'class-transformer/decorators';

import { PaginationDto } from '../../shared/base.dto';
import { JobRecruitmentActivityDto } from './job.req.dto';
import { JobClientContact } from 'src/schemas/job.schema';
import { ClientContact } from 'src/schemas/client.schema';
import { User } from 'src/schemas/user.schema';

export class JobDetailDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    status: number;

    @ApiProperty()
    @Expose()
    display_status: any;

    @ApiProperty()
    @Expose()
    job_role: string;
    @ApiProperty()
    @Expose()
    work_type: number;
    @ApiProperty()
    @Expose()
    job_title: string;
    @ApiProperty()
    @Expose()
    job_tracking?: number;
    @ApiProperty()
    @Expose()
    include_assessment_report?: boolean;
    @ApiProperty()
    @Expose()
    include_activity: boolean;
    @ApiProperty()
    @Expose()
    short_list_count: number;
    @ApiProperty()
    @Expose()
    exclude_from_report: boolean;

    @ApiProperty()
    @Expose()
    assigned_user: string;

    @ApiProperty()
    person_in_charge: string;

    @ApiProperty()
    @Expose()
    created_by: string;
    @ApiProperty()
    @Expose()
    updated_by?: string;
    @ApiProperty()
    @Expose()
    client_id: string;

    @ApiProperty()
    business_name: string;

    @ApiProperty()
    @Expose()
    agency_id: string;

    // @prop({ type: () => [mongoose.Types.ObjectId] })
    // client_list?: mongoose.Types.ObjectId[]
    @ApiProperty()
    @Expose()
    recruitment_activity: JobRecruitmentActivityDto[];

    @ApiProperty()
    @Expose()
    client_contact_list: [];

    @ApiProperty()
    @IsOptional()
    phone_number: string;
}

export class JobListDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    business_name: string;

    @ApiProperty()
    person_in_charge: string;

    @ApiProperty()
    assigned_user_id: string;

    @ApiProperty()
    client_id: string;

    @ApiProperty()
    @Expose()
    work_type: number;

    @ApiProperty()
    @Expose()
    status: number;

    @ApiProperty()
    @Expose()
    display_status: any;

    @ApiProperty()
    @Expose()
    candidate_count: number;
    @ApiProperty()
    @Expose()
    job_title: string;
}

export class OutJobListingDto extends PaginationDto {
    @Type(() => JobListDto)
    @IsArray()
    @ApiProperty({ type: [JobListDto] })
    job_list: JobListDto[];
}

export class ChangeJobStatusResultDto {
    @ApiProperty()
    job_id: string;
    @ApiProperty()
    success: boolean;
    @ApiProperty()
    message: string;
}

export class ChangeJobAssignUserResultDto {
    @ApiProperty()
    job_id: string;
    @ApiProperty()
    success: boolean;
    @ApiProperty()
    message: string;
}

export class OutChangeJobsStatusResultDto {
    @ApiProperty()
    @IsArray()
    job_status: ChangeJobStatusResultDto[];
}

export class ListJobRecruitmentActivityDto {
    @ApiProperty()
    @Expose()
    job_id: string;

    @ApiProperty()
    @Expose()
    exclude_from_report: boolean;

    @Type(() => JobRecruitmentActivityDto)
    @IsArray()
    // @ValidateNested({ each: true })
    @ApiProperty({ type: [JobRecruitmentActivityDto] })
    @Expose()
    recruitment_activity: JobRecruitmentActivityDto[];
}
export class OutJobClientContactDto {
    @ApiProperty()
    @Expose()
    job_client_contact_id: string;
    @ApiProperty()
    @Expose()
    invite_token: string;

    @ApiProperty()
    @Expose()
    invited_by: string;

    @ApiProperty()
    @Expose()
    invited_phone: string;

    @ApiProperty()
    @Expose()
    created_by: string;

    @ApiProperty()
    @Expose()
    invited_date: Date;

    @ApiProperty()
    @Expose()
    last_seen_date: Date;

    @ApiProperty()
    @Expose()
    is_invite: boolean;

    @ApiProperty()
    @Expose()
    in_review: boolean;

    @ApiProperty()
    @Expose()
    has_feedback: boolean;

    @ApiProperty()
    @Expose()
    first_name: string;

    @ApiProperty()
    @Expose()
    last_name: string;

    @ApiProperty()
    @Expose()
    contract_number: string;
    @ApiProperty()
    @Expose()
    is_deleted: boolean;
    @ApiProperty()
    @Expose()
    email: string;
    @ApiProperty()
    @Expose()
    client_id: string;
    @ApiProperty()
    @Expose()
    client_contact_id: string;
    @ApiProperty()
    @Expose()
    job_id: string;

    @ApiProperty()
    agency_id: string;

    @ApiProperty()
    @Expose()
    interview_status: number;

    subject: string;
    body: string;

    static fromDB(dbobj: JobClientContact) {
        const r = new OutJobClientContactDto();
        if (!dbobj) return null;
        if (dbobj.client_contact_id) {
            const clientContact = dbobj.client_contact_id as ClientContact;
            if (clientContact && clientContact.id) {
                r.client_contact_id = (
                    dbobj.client_contact_id as ClientContact
                ).id;

                r.client_id = (
                    dbobj.client_contact_id as ClientContact
                ).client_id.toString();
                r.email = (dbobj.client_contact_id as ClientContact).email;
                r.first_name = (
                    dbobj.client_contact_id as ClientContact
                ).first_name;
                r.last_name = (
                    dbobj.client_contact_id as ClientContact
                ).last_name;
                r.contract_number = (
                    dbobj.client_contact_id as ClientContact
                ).contract_number;
            }
        }
        if (dbobj.created_by) {
            const user = dbobj.created_by as User;
            if (user && user.email) {
                r.agency_id = user.agency_id.toString();
                r.invited_by = user.email;
                r.invited_phone = user.phone_number;
            }
        }
        if (dbobj.invited_by) {
            const invited_user = dbobj.invited_by as User;
            if (invited_user && invited_user.email) {
                r.invited_by = invited_user.email;
                r.invited_phone = invited_user.phone_number;
            }
        }
        //r.invited_by = dbobj.invited_by.toString()
        r.job_client_contact_id = dbobj.id.toString();
        r.job_id = dbobj.job_id.toString();
        r.is_invite = dbobj.is_invite || false;
        r.invited_date = dbobj.invited_date;
        r.last_seen_date = dbobj.last_seen_date;
        r.in_review = dbobj.in_review || false;
        r.has_feedback = dbobj.has_feedback || false;
        r.invite_token = dbobj.invite_token;
        r.interview_status = dbobj.interview_status;
        return r;
    }
}

export class ClientContactMailDto {
    @ApiProperty()
    @Expose()
    _id: string;

    @ApiProperty()
    @Expose()
    email: string;

    @ApiProperty()
    @Expose()
    first_name: string;

    @ApiProperty()
    @Expose()
    last_name: string;
}

export class JobClientContactMailDto {
    @ApiProperty()
    @Expose()
    invite_token: string;

    @ApiProperty()
    @Expose()
    invited_date: Date;

    @ApiProperty()
    @Expose()
    last_seen_date: Date;

    @ApiProperty()
    @Type(() => ClientContactMailDto)
    @Expose()
    client_contact_id: ClientContactMailDto;

    @ApiProperty()
    @Expose()
    is_invite: boolean;

    @ApiProperty()
    @Expose()
    in_review: boolean;

    @ApiProperty()
    @Expose()
    has_feedback: boolean;
}
