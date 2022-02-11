import { mongoose, prop, plugin } from '@typegoose/typegoose'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import { BaseModel, PaginateMethod } from './base.model'

export enum NotificationType { 
    RECRUITER_INVITE_ACCEPTED = 1,
    REQUEST_EMAIL_UPDATE = 2,
    RECRUITER_CHANGE_NAME = 3,
    PAYMENT_UNSUCCESS = 4,
    SEVEN_DAY_NOTIFY = 5,
    ONE_DAY_NOTIFY = 6,
    DEATIVATED_ACCONNT = 7,
    PRODUCT_ENHANCE = 8,
    COMPANY_ENHANCE = 9,
    EMAIL_UPDATED = 10,
    CANDIDATE_START_ASSETMENT = 11,
    CANDIDATE_COMPLETE_ASSETMENT = 12,
    CLIENT_VIEWED_REPORT = 13,
    CLIENT_PROVIDE_FEEDBACK = 14,
    CANCEL_SUBSCRIPTION= 15,
    TALENT_ASSESSMENT = 16,
    CV_PARSING = 17,
    TALENT_ASSESSMENT_REACHES = 18,
    CV_PARSING_REACHES = 19,
}

export enum NotificationStatus { 
    READ = 1,
    UNREAD = 0
}

@plugin(mongoosePaginate)
export class Notification extends BaseModel {
    @prop() sender_id: mongoose.Types.ObjectId;
    @prop() receiver_id: mongoose.Types.ObjectId;
    @prop() title: string;
    @prop() content: string;
    @prop({ default: Date.now() }) created_date: Date;
    @prop({ enum: NotificationType }) type: NotificationType;
    @prop({ enum: NotificationStatus, default: NotificationStatus.UNREAD }) status: NotificationStatus;
    @prop() reference_id: string;
    @prop({ default: false }) is_deleted: boolean;
    static paginate: PaginateMethod<Notification>;
}