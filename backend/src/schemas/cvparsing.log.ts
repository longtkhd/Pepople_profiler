import { prop, Ref } from '@typegoose/typegoose'
import { Agency } from './agency.schema'
import { BaseModel } from './base.model'
import { User } from './user.schema'

export class CVParsingLog extends BaseModel {
    @prop({}) name: string
    @prop({ ref: () => Agency }) agency_id: Ref<Agency>;
    @prop({ ref: () => User }) created_by: Ref<User>;
    @prop() result: any
}