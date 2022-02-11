import { mongoose, prop } from '@typegoose/typegoose'
import { BaseModel } from './base.model'

export enum EmailType {
    ClientInvite = 0,
    CandidateInvite = 1,
    Other = 2
}

export class MailTemplate extends BaseModel{
    @prop()
    name: string

    @prop({ enum: EmailType })
    type: EmailType

    @prop()
    subject: string

    @prop()
    content: string

    @prop()
    created_by: mongoose.Types.ObjectId;
    
    @prop()
    is_deleted?: boolean
}