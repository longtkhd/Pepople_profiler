import { Expose, Type } from 'class-transformer'
import { index, modelOptions, plugin, prop, Ref, Severity } from '@typegoose/typegoose'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import * as autopopulate from 'mongoose-autopopulate'

import { User } from './user.schema'
import { Package } from './package.schema'
import { BaseModel, PaginateMethod } from './base.model'

import { BillingType } from 'src/agency/dto/agency'

export enum AgencySizeEnum {
    MaxFiveRecruiter = 0,
    MaxFifteenRecruiter = 1,
    MaxThirtyRecruiter = 2,
    NoLimitRecruiter = 3
}

export class CompanyInfo {
    @prop() logo?: string
    @prop() industry?: string
    @prop() agency_size?: AgencySizeEnum
    @prop() background_image?: string
    @prop() font_color?: string
    @prop() link_color?: string
    @prop() button_color?: string

}

@plugin(autopopulate as any)
export class Subscription extends BaseModel {
    @prop({ autopopulate: true, ref: () => Package }) package_id: Ref<Package>;
    @prop({ ref: () => Agency }) agency_id: Ref<Agency>;
    @prop() price: number;
    @prop() price_before_tax: number;
    @prop() subscription_date: Date;
    @prop() expire_trial_date: Date;
    @prop({ default: null }) expire_date: Date;
    @prop() payment_success: boolean;
    @prop({ enum: BillingType, default: BillingType.YEARLY })
    billing_type: BillingType;
    @prop() day_reminder_email: Date;
    @prop() next_payment_date: Date;
    @prop({ default: 0 }) time_send_notification: number;
}

export class PaymentInfo {
    @prop() card_token: string;
    @prop() customer_email: string;
    @prop() name: string;
    @prop() scheme: string;
    @prop() address_line1: string;
    @prop() address_line2: string;
    @prop() address_city: string;
    @prop() address_postcode: string;
    @prop() address_state: string;
    @prop() address_country: string;
    @prop() customer_token: string;
    @prop() primary: string;
    @prop() display_number: string;
    // @prop() card_number: string;
    // @prop() cvc: string;
    @prop() issuing_country: string;
    @prop() verify_date: Date;
    @prop() expiry_month: number;
    @prop() expiry_year: number;
}

@plugin(mongoosePaginate)
@modelOptions({
    options: { allowMixed: Severity.ALLOW },
    schemaOptions: {
        toJSON: {
            virtuals: true,
            getters: true,
            transform: function (doc, ret) {
                Object.setPrototypeOf(ret, Object.getPrototypeOf(new Agency()))
            }
        },
    }
})

@index({ agency_name: 'text' })
@plugin(autopopulate as any)
export class Agency extends BaseModel {
    @prop({ ref: () => User }) created_by: Ref<User>;//mongoose.Types.ObjectId

    @prop({ required: true, ref: () => User }) owner_id: Ref<User>;

    @prop({ required: true }) agency_name: string
    @prop() country_code: string

    @prop({ _id: false })
    @Type(() => CompanyInfo)
    company_info: CompanyInfo

    @prop()
    signed_logo_url: string

    @prop()
    logo_expire_date: Date
    
    @prop()
    signed_background_url: string

    @prop({ autopopulate: true, ref: () => Subscription })
    public subscription_plan: Ref<Subscription>

    @prop()
    public billing_period: number
    @prop() public is_send_welcome?: boolean
    // @arrayProp({ items: () => mongoose.Types.ObjectId })
    // public recruiter_list: mongoose.Types.ObjectId[]

    @prop()
    public status: number

    @Expose()
    @prop({ type: () => [User], ref: () => User, foreignField: 'agency_id', localField: '_id', justOne: false, count: true, match: { 'is_deleted': { $ne: true } } })
    recruiter_count: number;
    @prop({ _id: false })
    @Type(() => PaymentInfo)
    public payment_info: PaymentInfo
    static paginate: PaginateMethod<Agency>;

    @prop()
    is_deleted?: boolean
}