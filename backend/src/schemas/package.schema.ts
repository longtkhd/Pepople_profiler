import { plugin, prop, Ref } from '@typegoose/typegoose'
import { User } from '../schemas/user.schema'
import { BaseModel, PaginateMethod } from './base.model'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import { AgencySizeEnum } from './agency.schema'

@plugin(mongoosePaginate)
export class Package extends BaseModel {
    @prop({ required: true })
    package_name: string;
    @prop()
    description: string;
    @prop({ required: true })
    price: number;
    @prop()
    max_recruiter: number;
    @prop()
    max_cv_parsing: number;
    @prop()
    max_assessment_limit: number;
    @prop()
    color: string;
    @prop({ enum: AgencySizeEnum })
    package_size: AgencySizeEnum;

    @prop({ ref: () => User })
    created_by: Ref<User>;

    static paginate: PaginateMethod<Package>;
}