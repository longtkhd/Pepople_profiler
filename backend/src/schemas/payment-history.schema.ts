import { Ref, prop, plugin } from "@typegoose/typegoose";
import { Agency } from "./agency.schema";
import { BaseModel, PaginateMethod } from "./base.model";
import { Package } from "./package.schema";

import * as mongoosePaginate from 'mongoose-paginate-v2'

export enum PaymentStatus {
    SUCCESS,
    ERROR
}

@plugin(mongoosePaginate)
export class PaymentHistory extends BaseModel {
    @prop({ ref: () => Package })
    package_id: Ref<Package>;

    @prop({ ref: () => Agency })
    agency_id: Ref<Agency>;

    @prop()
    email: string;

    @prop()
    token: string;

    @prop()
    payment_date: Date;

    @prop()
    amount: number;

    @prop()
    currency: string;

    @prop()
    description: string;

    @prop()
    transfer: []

    @prop()
    amount_refunded: number;

    @prop()
    total_fees: number;

    @prop()
    merchant_entitlement: number;

    @prop()
    refund_pending: boolean;

    @prop()
    authorisation_expired: boolean;

    @prop()
    captured: boolean;

    @prop()
    captured_at: Date;

    @prop()
    settlement_currency: string;

    @prop()
    active_chargebacks: boolean;

    @prop()
    metadata: {};

    @prop({ enum: PaymentStatus, default: PaymentStatus.SUCCESS})
    status: PaymentStatus;

    static paginate: PaginateMethod<PaymentHistory>;
}