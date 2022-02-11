import { modelOptions, prop, Severity } from '@typegoose/typegoose'


import { BaseModel } from './base.model'

export enum TokenType {
    VerifyAgency = 1,
    ForgotPass,
    VerifyRecruiter
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
export class Token extends BaseModel {
    @prop() email: string;
    @prop() expires_at?: Date;
    @prop({ default: false }) is_expired?: boolean;
    @prop() type?: number;
    @prop() ip_address: string;
    @prop() data?: any;

    // static get model(): ModelType<Token> {
    //     return new Token().getModelForClass(Token, { schemaOptions });
    // }
    // static get modelName(): string {
    //     return this.model.modelName;
    //   }
}