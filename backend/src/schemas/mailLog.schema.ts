
import { BaseModel } from './base.model'
import { modelOptions, prop, Severity } from '@typegoose/typegoose'
import { mongoose } from '@typegoose/typegoose'

export enum MailType {
    RegisterAgency = 1,
    RegisterRecruiter,
    ForgotPassword,
    Notification,
    AgencyWelcomeEmail,
    CandidateReportsLink,
    SubscriptionReminderMail,
    InviteJobClientContact,
    InviteAssessmentCandidate,
    RequestChangeEmail,
}
@modelOptions({
    options: { allowMixed: Severity.ALLOW },
    schemaOptions: {
        toJSON: {
            virtuals: true,
            getters: true,
        },
    }
})
export class MailLogs extends BaseModel {
    @prop() created_by: mongoose.Types.ObjectId;
    @prop() sender_email: string;
    @prop() sender_name: string;
    @prop() subject: string;
    @prop() body: string;
    @prop() receiver: string;
    @prop() type: number;
    @prop() ref_id: string;
    //  static get model(): ModelType<MailLogs> {
    //     return new MailLogs().getModelForClass(MailLogs, { schemaOptions });
    // }
    // static get modelName(): string {
    //     return this.model.modelName;
    //   }
}