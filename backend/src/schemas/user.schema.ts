import * as bcrypt from 'bcrypt'
import { ObjectID as DBObjectID } from 'mongodb'
import { BaseModel, PaginateMethod } from './base.model'
import { index, modelOptions, plugin, pre, prop, Ref, Severity } from '@typegoose/typegoose'
import * as _ from 'lodash'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import { Agency } from './agency.schema'
import { Job, JobStatus } from './job.schema'
import { NotificationSetting } from './notification-setting.schema'
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { v1 } from 'uuid'
export class Profile {
    @prop() avatar: string;
}

@modelOptions({
    options: { allowMixed: Severity.ALLOW },
    schemaOptions: {
        toJSON: {
            virtuals: true,
            getters: true
        },
        toObject: { virtuals: true }
    }
})

export class UserTextSearch {
    first_name: string;
    last_name: string;
    email: string;
}

@pre<User>('save', function (next) {
    if(this.is_deleted){
        this.email = `deleted${v1()}@deleted.deleted`
    }
    next()
})
@index({ text_search: 'text' })
@plugin(mongoosePaginate)
export class User extends BaseModel {
    //@Transform((id: ObjectID) => id.toHexString(), {toPlainOnly: true})
    //@ObjectIdColumn()  _id: DBObjectID;
    @ApiProperty()
    @prop({ required: true, unique: true }) email: string;
    @ApiProperty()
    @prop() first_name: string;
    @ApiProperty()
    @prop() last_name: string;
    @Exclude()
    @prop() password: string;
    @Exclude()
    @prop() password_salt: string;
    @prop() role: string;
    @prop() status: number;
    @prop() job_title: string;
    @prop({ ref: () => Agency }) agency_id: Ref<Agency>;
    @prop() phone_number: string;
    @prop() country_code: string;
    @prop({ default: false }) is_verify: boolean;
    @prop({ default: false }) is_deleted: boolean;
    @prop({ default: true }) is_active: boolean;
    @prop({ type: () => [NotificationSetting] }) notification_settings?: NotificationSetting[];
    @prop() created_by?: DBObjectID;
    @prop() text_search: string;
    @prop({ ref: () => Job, foreignField: 'assigned_user', localField: '_id', justOne: false, type: () => [Job] }) assigned_job_list: [Ref<Job>];
    @prop({ ref: () => Job, foreignField: 'created_by', localField: '_id', justOne: false, type: () => [Job] }) created_job_list: [Ref<Job>];
    @prop({ _id: false })
    profile: Profile;
    static paginate: PaginateMethod<User>;
    get open_job(): number {
        let count = 0
        //if (this.created_job_list && this.created_job_list.length) { count += _.filter(this.created_job_list, (c: any) => c.status !== JobStatus.CLOSE).length }
        if (this.assigned_job_list && this.assigned_job_list.length) { count += _.filter(this.assigned_job_list, (c: any) => c.is_deleted != true && c.status !== JobStatus.CLOSE).length }
        return count
    }
    get close_job(): number {
        let count = 0
        //if (this.created_job_list && this.created_job_list.length) { count += _.filter(this.created_job_list, (c: any) => c.status === JobStatus.CLOSE).length }
        if (this.assigned_job_list && this.assigned_job_list.length) { count += _.filter(this.assigned_job_list, (c: any) => c.is_deleted != true && c.status === JobStatus.CLOSE).length }
        return count
    }
    async hashPassword() {
        this.password_salt = bcrypt.genSaltSync(10)
        this.password = await bcrypt.hash(this.password, this.password_salt)
    }

    async comparePassword(attempt: string): Promise<boolean> {
        if (!this.password || !this.is_verify) return false

        //const test =  await bcrypt.hash(attempt, bcrypt.genSaltSync(10))
        const compare = await bcrypt.compare(attempt, this.password)

        return compare
    }

}