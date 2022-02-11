import {
    index,
    modelOptions,
    mongoose,
    plugin,
    prop,
    Ref,
    Severity,
} from '@typegoose/typegoose';
import { v1 } from 'uuid';
import * as mongoosePaginate from 'mongoose-paginate-v2';

import { BaseModel, PaginateMethod } from './base.model';

import { User } from './user.schema';
import { Agency } from './agency.schema';
import { Client, ClientContact } from './client.schema';
import * as _ from 'lodash';
import { Expose } from 'class-transformer';
import { Candidate, CandidateJob } from './candidate.schema';

export class RecruitmentActivity {
    @prop({ default: v1 })
    @Expose()
    id: string;
    @prop()
    @Expose()
    icon?: string;
    @prop()
    @Expose()
    key?: any;
    @prop()
    @Expose()
    value?: any;
}

export enum JobStatus {
    OPEN = 1,
    IN_PROGRESS = 2,
    CLOSE = 6,
}

export enum WorkType {
    PERMANENT = 1,
    CONTRACT = 2,
    TEMP = 3,
}

export enum FeedbackStatus {
    Interested = 1,
    Disscus = 2,
}

export enum InterviewStatus {
    pre_interview = 0,
    interview = 1,
    has_interview = 2,
}
export class InterviewTime extends BaseModel {
    @prop() date: Date;
    @prop() time_start: Date;
    @prop() time_end: Date;
    @prop({ ref: () => Job }) job_id: Ref<Job>; // cua job nao
    @prop({ ref: () => User }) created_by: Ref<User>; // agency~~client tao ra
    @prop() info: string;
    @prop() create_by: ClientContact;
    @prop({default: "Asia/Bangkok"}) time_zone: string;
}
export class JobClientContact extends BaseModel {
    @prop({ ref: () => ClientContact }) client_contact_id: Ref<ClientContact>;
    @prop({ ref: () => Job }) job_id: Ref<Job>;
    @prop() invite_token: string;
    @prop({ ref: () => User }) created_by: Ref<User>;
    @prop({ ref: () => User }) invited_by: Ref<User>;
    @prop() invited_date: Date;
    @prop() last_seen_date: Date;
    @prop() is_invite: boolean;
    @prop() in_review: boolean;
    @prop() has_feedback: boolean;
    @prop() interview_time: any[];
    @prop({ enum: InterviewStatus, default: InterviewStatus.pre_interview })
    interview_status: InterviewStatus;
}

export class ClientFeedback extends BaseModel {
    @prop({ ref: () => ClientContact }) created_by: Ref<ClientContact>;
    @prop({ ref: () => JobClientContact })
    job_client_contact_id: Ref<JobClientContact>;
    @prop({ ref: () => Candidate }) candidate_id: Ref<Candidate>;
    @prop() comment: string;
    @prop() rate: number;
    @prop() email: string;
    @prop({ enum: FeedbackStatus, default: FeedbackStatus.Interested })
    status: FeedbackStatus;
}

@index({ text_search: 'text' })
@plugin(mongoosePaginate)
@modelOptions({
    options: { allowMixed: Severity.ALLOW },
    schemaOptions: {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        toObject: { virtuals: true },
    },
})
export class Job extends BaseModel {
    @Expose()
    @prop({ enum: JobStatus, default: JobStatus.OPEN })
    status: JobStatus;

    @prop({ default: false }) is_deleted: boolean;
    @Expose()
    @prop()
    job_role: string;
    @Expose()
    @prop()
    work_type: string;
    @Expose()
    @prop()
    job_title: string;
    @Expose()
    @prop()
    job_tracking?: number;
    @Expose()
    @prop()
    include_assessment_report?: boolean;
    @Expose()
    @prop()
    include_activity: boolean;
    @Expose()
    @prop()
    short_list_count: number;
    @Expose()
    @prop({ default: false })
    exclude_from_report: boolean;

    @Expose()
    @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
    assigned_user: Ref<User>;
    @Expose()
    @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
    created_by: Ref<User>;
    @Expose()
    @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
    updated_by?: Ref<User>;
    @Expose()
    @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Client })
    client_id: Ref<Client>;
    @Expose()
    @prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Agency })
    agency_id: Ref<Agency>;

    // @prop({ type: () => [mongoose.Types.ObjectId] })
    // client_list?: mongoose.Types.ObjectId[]

    @prop({ type: () => [RecruitmentActivity] })
    recruitment_activity: RecruitmentActivity[];
    @prop({
        type: () => [JobClientContact],
        ref: () => JobClientContact,
        foreignField: 'job_id',
        localField: '_id',
        justOne: false,
    })
    client_contact_list: [Ref<JobClientContact>];
    get job_status(): any {
        let invited_count = 0;
        let feedback_count = 0;
        let review_count = 0;

        //if (this.created_job_list && this.created_job_list.length) { count += _.filter(this.created_job_list, (c: any) => c.status !== JobStatus.CLOSE).length }
        if (this.client_contact_list && this.client_contact_list.length) {
            invited_count += _.filter(
                this.client_contact_list,
                (c: any) => c.is_invite,
            ).length;

            // eslint-disable-next-line no-unused-vars
            review_count += _.filter(
                this.client_contact_list,
                (c: any) => c.in_review,
            ).length;

            feedback_count += _.filter(
                this.client_contact_list,
                (c: any) => c.has_feedback,
            ).length;
        }

        if (feedback_count) {
            return 'received';
        }
        if (invited_count) {
            return 'submitted';
        }
        if (this.status === JobStatus.CLOSE) {
            return JobStatus.CLOSE;
        }
        return JobStatus.OPEN;
    }
    @Expose()
    @prop({
        type: () => [CandidateJob],
        ref: () => CandidateJob,
        foreignField: 'job_id',
        localField: '_id',
        justOne: false,
        count: true,
    })
    candidate_count: number;
    @prop() text_search: string;
    static paginate: PaginateMethod<Job>;
}
