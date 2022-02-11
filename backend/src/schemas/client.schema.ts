import { index, plugin, prop, Ref } from '@typegoose/typegoose'
import * as mongoosePaginate from 'mongoose-paginate-v2'

import { BaseModel, PaginateMethod } from './base.model'
import { Agency } from './agency.schema'
import { User } from './user.schema'
import { Job, JobStatus } from './job.schema'
import * as _ from 'lodash'

export class ClientContactTextSearch {
    first_name: string;
    last_name: string;
    email: string;
}


@plugin(mongoosePaginate)
export class ClientContact extends BaseModel {
    @prop() first_name: string;
    @prop() last_name: string;
    @prop() contract_number: string;
    @prop({ default: false }) is_deleted: boolean;
    @prop({ required: true }) email: string;

    @prop({ ref: () => Client }) client_id: Ref<Client>;
    @prop({ ref: () => User }) created_by: Ref<User>;
    @prop({ ref: () => User })
    updated_by?: Ref<User>;
    static paginate: PaginateMethod<ClientContact>;
}

@index({ text_search: 'text' })
@plugin(mongoosePaginate)
export class Client extends BaseModel {
    @prop() business_name: string;
    @prop() industry?: string;

    @prop({ ref: () => ClientContact, foreignField: 'client_id', localField: '_id', justOne: false, type: () => [ClientContact] })
    contact_list?: [Ref<ClientContact>];
    @prop({ default: false }) is_deleted: boolean;
    @prop({ ref: () => Agency })
    agency_id: Ref<Agency>;

    @prop({
        ref: () => Job,
        foreignField: 'client_id',
        localField: '_id',
        type: () => [Job],
    })
    job_list: Ref<Job>[]

    @prop({ ref: () => User })
    created_by: Ref<User>;
    @prop({ ref: () => User })
    updated_by?: Ref<User>;

    @prop() text_search: string;

    static paginate: PaginateMethod<Client>;

    get open_job(): number {
        let count = 0
        //if (this.created_job_list && this.created_job_list.length) { count += _.filter(this.created_job_list, (c: any) => c.status !== JobStatus.CLOSE).length }
        if (this.job_list && this.job_list.length) { count += _.filter(this.job_list, (c: any) => c.is_deleted!=true && c.status !== JobStatus.CLOSE).length }
        return count
    }
    get close_job(): number {
        let count = 0
        //if (this.created_job_list && this.created_job_list.length) { count += _.filter(this.created_job_list, (c: any) => c.status === JobStatus.CLOSE).length }
        if (this.job_list && this.job_list.length) { count += _.filter(this.job_list, (c: any) => c.is_deleted!=true && c.status === JobStatus.CLOSE).length }
        return count
    }
}
