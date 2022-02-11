import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { PaginationDto } from '../../shared/base.dto'
import { JobListDto as JobDto } from '../../job/dto/job.res.dto'
import { Client } from 'src/schemas/client.schema'
import { FilterQuery } from 'mongoose'
import { ObjectId } from 'mongodb'
import { ClientContact } from 'src/schemas/client.schema'
import { ClientFeedback } from 'src/schemas/job.schema'
import { Candidate } from 'src/schemas/candidate.schema'

export class ClientContactDto {
    @ApiProperty()
    contact_number: string;

    @ApiProperty()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    first_name: string;

    @ApiProperty()
    @IsNotEmpty()
    last_name: string;
}

export class AddListClientContactDto {
    @Type(() => ClientContactDto)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [ClientContactDto] })
    contact_list: [ClientContactDto];
}

export class EditClientContactDto extends ClientContactDto {
    @ApiProperty()
    id: string
}

export class AddClientContactToJobDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    client_id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    job_id: string
}

export class InClientFeedbackDto {
    @ApiProperty()
    client_id: string;

    @ApiProperty()
    job_id: string;

    @ApiProperty()
    candidate_id: string;
}

export class AddClientFeedbackDto {
    @ApiProperty()
    @Expose()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @Expose()
    candidate_id: string;

    @ApiProperty()
    @Expose()
    rate: number;

    @ApiProperty()
    @Expose()
    status: number;

    @ApiProperty()
    @IsOptional()
    comment: string;
}
export class OutClientFeedbackDto {
    @ApiProperty()
    @Expose()
    job_client_contact_id: string;

    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    candidate_id: string;

    @ApiProperty()
    @Expose()
    email: string;

    @ApiProperty()
    @Expose()
    candidate_name: string;

    @ApiProperty()
    @Expose()
    rate: number;

    @ApiProperty()
    @Expose()
    status: number;

    @ApiProperty()
    @Expose()
    comment: string;

    static fromDB(dbobj: ClientFeedback) {
        const r = new OutClientFeedbackDto()
        if (!dbobj) return null
        r.id = dbobj.id
        r.candidate_id = dbobj?.candidate_id.toString()
        r.job_client_contact_id = dbobj?.job_client_contact_id.toString()
        r.comment = dbobj.comment
        r.rate = dbobj.rate
        r.status = dbobj.status
        r.email = dbobj.email
        if (dbobj.candidate_id) {
            const candidate = (dbobj.candidate_id as Candidate)
            if (candidate && candidate.id) {
                r.candidate_name = candidate.candidate_name
                r.candidate_id = candidate.id
            }
        }
        return r
    }
}

export class OutListClientFeedbackDto {
    @Type(() => OutClientFeedbackDto)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [OutClientFeedbackDto] })
    feedback_list: OutClientFeedbackDto[];
}

export class ClientDetailDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    business_name: string;

    @ApiProperty()
    industry: string;

    @Type(() => ClientContactDto)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [ClientContactDto] })
    contact_list?: [ClientContactDto];
}



export class CreateClientDetailDto {
    @ApiProperty()
    business_name: string;

    @ApiProperty()
    industry: string;

    @Type(() => ClientContactDto)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [ClientContactDto] })
    contact_list?: [ClientContactDto];
}

export class InviteMail {
    @ApiProperty()
    mail_content: string;
}
export class ClientInfoDto {

    @ApiProperty()
    id: string;

    @ApiProperty()
    industry: string;

    @ApiProperty()
    @IsNotEmpty()
    business_name: string;
}

export class ClientContactInfoInProjetDto extends ClientContactDto {
    @ApiProperty()
    is_invited: boolean;
    @ApiProperty()
    is_inreview: boolean;
    @ApiProperty()
    is_feedback: boolean;
}

export class ClientDto extends ClientInfoDto {

    @Type(() => ClientContactDto)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [ClientContactDto] })
    contact_list: [ClientContactDto];

    @Type(() => JobDto)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [JobDto] })
    job_list: [JobDto];
}

export class ClientListDto extends PaginationDto {
    @Type(() => ClientInfoDto)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [ClientInfoDto] })
    client_list: ClientInfoDto[];
}

export class ClientListByProjectDto extends PaginationDto {
    @Type(() => ClientContactInfoInProjetDto)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [ClientContactInfoInProjetDto] })
    client_list: [ClientContactInfoInProjetDto];
}
export class InFilterClientParamDto extends PaginationDto {
    @ApiProperty()
    agency_id: string;

    @ApiProperty()
    created_by: string;

    public buildFilterQuery(): FilterQuery<Client> {
        const query: FilterQuery<Client> = {}
        if (this.agency_id) query.agency_id = new ObjectId(this.agency_id)
        if (this.created_by) query.created_by = new ObjectId(this.created_by)
        query.is_deleted = false
        if (this.keyword && this.keyword.trim().length > 0) {
            query.$text = {
                $search: `"${this.keyword}"`
            }
        }
        return query
    }

}

export class InFilterContactClientParamDto extends PaginationDto {
    @ApiProperty()
    client_id: string;

    @ApiProperty()
    job_id: string;

    public buildFilterQuery(): FilterQuery<ClientContact> {
        const query: FilterQuery<ClientContact> = {}
        if (this.client_id) query.client_id = new ObjectId(this.client_id)
        //TODO filter by job_id
        //if (this.created_by) query.created_by = new ObjectId(this.created_by)
        return query
    }
}

export class ContactToJobDTO extends ClientContactDto {

    @ApiProperty()
    @IsOptional()
    id: string;

    @ApiProperty()
    @IsOptional()
    client_id: string;

}

export class AddMultipleClientContact {
    @ApiProperty({ type: [ContactToJobDTO]})
    @IsNotEmpty()
    client_contact_list: ContactToJobDTO[];

}

export class MultipleClientContact {
    @ApiProperty()
    @IsNotEmpty()
    client_contact_list: string[];

    @ApiProperty()
    subject: string

    @ApiProperty()
    body: string
}

export class InviteClientJobMail {
    @ApiProperty()
    subject: string

    @ApiProperty()
    body: string
}


