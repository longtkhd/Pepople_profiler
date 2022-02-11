import { prop } from '@typegoose/typegoose'
import { BaseModel } from './base.model'

export class AssessmentIndustry extends BaseModel {
    @prop()
    name: string

    @prop()
    is_deleted?: boolean
}

export class AssessmentType extends BaseModel {
    @prop()
    name: string
    @prop()
    is_deleted?: boolean
}

export class ProjectAssessment extends BaseModel {
    @prop()
    name: string

    @prop()
    project_access_key: string

    // @prop({ ref: () => AssessmentIndustry })
    // industry: Ref<AssessmentIndustry>;

    // @prop({ ref: () => AssessmentType })
    // type: Ref<AssessmentType>;

    @prop()
    is_deleted?: boolean
}