import {
    index,
    modelOptions,
    plugin,
    prop,
    Ref,
    Severity,
} from '@typegoose/typegoose';
import {
    AggregatePaginateMethod,
    BaseModel,
    PaginateMethod,
} from './base.model';
import { Agency } from './agency.schema';
import { User } from './user.schema';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { ClientFeedback, Job } from './job.schema';
import { AssessmentIndustry, AssessmentType } from './assessments.schema';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TestDetail } from 'src/tptests/dto/response.mode';

export class CandidateSummary {
    @prop() title: string;
    @prop() description: string;
}

export class AdditionalInfo {
    @prop() name: string;
    @prop() value: string;
}

/**
 * Competence
 */
export class Competence {
    @prop()
    @ApiProperty()
    id: string;
    @prop()
    @ApiProperty()
    name: string;
    @prop()
    @ApiProperty()
    value: number;
    @prop()
    @ApiProperty()
    weight: string;
    @prop()
    @ApiProperty()
    status: number;
    @prop()
    @ApiProperty()
    is_active: boolean;
}

export class CompetenceWheel {
    @prop()
    @ApiProperty()
    _id: string;

    @prop()
    @ApiProperty()
    wheel_name: string;

    @prop({ _id: false, type: () => Competence })
    @Type(() => Competence)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [Competence] })
    competency_list: Competence[];
}

export class CompetenceAssessmentWheels {
    @prop()
    @ApiProperty()
    is_apply: boolean;

    @prop({ type: () => CompetenceWheel })
    @Type(() => CompetenceWheel)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [CompetenceWheel] })
    wheels: [CompetenceWheel];
}
@plugin(mongoosePaginate)
export class CandidateDocument extends BaseModel {
    @prop({ ref: () => Candidate })
    candidate_id: Ref<Candidate>;
    @prop()
    file_name: string;
    @prop({ ref: () => Agency })
    agency_id: Ref<Agency>;

    // @prop() include_assessment_report?: boolean;
    // @prop() include_activity: boolean;
    // @prop({ default: false }) is_deleted: boolean;
    @prop()
    file_md5: string;
    @prop()
    type: number;
    @prop()
    status: number;
    @prop()
    is_deleted?: boolean;
    @prop({ default: false })
    is_public: boolean;
    static aggregatePaginate: AggregatePaginateMethod<any>;
    static paginate: PaginateMethod<CandidateDocument>;
}
@plugin(mongoosePaginate)
export class CandidateJob extends BaseModel {
    @prop({ ref: () => User }) created_by: Ref<User>;
    @prop({ ref: () => User }) updated_by?: Ref<User>;
    @prop({ ref: () => Job }) job_id: Ref<Job>;
    @prop({ ref: () => Candidate }) candidate_id: Ref<Candidate>;
    @prop({ ref: () => ClientFeedback }) feedbacks: ClientFeedback[];
    @Type(() => CompetenceAssessmentWheels)
    @prop({ _id: false, type: () => CompetenceAssessmentWheels })
    recruiter_assessments: CompetenceAssessmentWheels;
    @prop({ default: 0 }) interview_status: number;
    @prop() client_contact_time_list: any[];
}

@plugin(mongoosePaginate)
@index({ text_search: 'text' })
@index({ candidate_email: 'text' })
@index({ candidate_name: 'text' })
@modelOptions({
    options: { allowMixed: Severity.ALLOW },
    schemaOptions: {
        toJSON: {
            virtuals: true,
            getters: true,
        },
    },
})
@Expose()
export class Candidate extends BaseModel {
    @prop() candidate_id: string;
    @prop({ ref: () => Agency }) agency_id: Ref<Agency>;
    @prop({ ref: () => User }) created_by: Ref<User>;
    @prop() candidate_name: string;
    @prop() candidate_email: string;
    @prop() revision_number: number;
    @prop() current_position: string;
    @prop() phone: string;
    @prop() current_employer: string;
    // parsing_log_id
    @prop() exp_rem: string;
    @prop() notice_period: string;
    @prop() resume_text: string;
    @prop() resume_html: string;
    @prop() resume_styles: string[];
    @prop({ _id: false, type: () => CandidateSummary })
    summaries: CandidateSummary[];
    @prop({ _id: false, type: () => [AdditionalInfo] })
    additional_infos: AdditionalInfo[];
    @prop() postalAddress: any;
    @prop() background_check: boolean;
    @prop() background_comment: string;
    @prop() right_to_work: boolean;
    @prop() right_to_work_comment: string;
    @prop() linked_in_recommend: string;
    @prop() linked_in: string;
    @Exclude()
    // @prop() assessment_invite_link: string
    @prop()
    batch_parsing_key: string;
    @prop({
        ref: () => CandidateDocument,
        foreignField: 'candidate_id',
        localField: '_id',
        justOne: false,
        type: () => [CandidateDocument],
    })
    documents: [Ref<CandidateDocument>];
    @prop() include_assessment_report: boolean;
    @prop() text_search: string;
    @prop({
        ref: () => AssessmentReport,
        foreignField: 'candidate',
        localField: '_id',
        justOne: false,
        type: () => [AssessmentReport],
    })
    assessment_reports: Ref<AssessmentReport>[];
    static aggregatePaginate: AggregatePaginateMethod<any>;

    static paginate: PaginateMethod<Candidate>;
}
export const PersonalityProfile = [
    'Openness to Experience',
    'Conscientiousness',
    'Extraversion',
    'Agreeableness',
    'Emotional Stability',
    'Resilience',
    'Integrity',
    'Emotional Intelligence',
    'Industriousness',
];
export const CompetencyProfile = [
    'Achievement and Effort',
    'Adaptability and Flexibility',
    'Analytical Thinking',
    'Attention to Detail ',
    'Concern for Others',
    'Cooperation',
    'Dependability',
    'Initiative',
    'Innovation',
    'Integrity',
    'Leadership',
    'Persistence',
    'Self-Control',
    'Social Orientation',
    'Stress Tolerance',
];
export class AssessmentReport extends BaseModel {
    @prop({ ref: () => Candidate }) candidate: Ref<Candidate>;
    @prop({ ref: () => Agency }) agency: Ref<Agency>;
    @prop({ ref: () => Job }) job: Ref<Job>;
    @prop() project_access_key: string;
    @Exclude()
    @prop()
    tp_username: string;
    @Exclude()
    @prop()
    tp_password: string;
    //  @prop({ ref: () => ProjectAssessment }) project_assessment: Ref<ProjectAssessment>;
    @prop({ ref: () => AssessmentIndustry }) industry: Ref<AssessmentIndustry>;
    @prop({ ref: () => AssessmentType }) type: Ref<AssessmentType>;
    @prop({ default: 'Not Started' }) status: string;
    @prop() submission_date: string;
    @prop() score: string;
    @Exclude()
    @prop()
    tests: any;
    @prop() report_file_path: string;
    @prop() remind_date?: Date;
    @prop() assessment_id: string;
    // @prop() assessment_invite_link: string
    @prop({ ref: () => User }) created_by: Ref<User>;
    static PopulateAssessmentReports(tests) {
        const PersonalityProfileReport = [];
        const CompetencyProfileReport = [];
        if (tests) {
            const reportTestResult = tests as TestDetail[];

            if (reportTestResult && reportTestResult.length) {
                const reportDetail = reportTestResult.find(
                    (y) =>
                        y.Groups &&
                        y.Groups.length > 0 &&
                        y.Scales &&
                        y.Scales.length > 0,
                );
                const reportFull = reportDetail?.Groups.filter(
                    (x) => x.ReportType === 'Full Report',
                );
                if (reportFull && reportFull.length) {
                    PersonalityProfile.forEach((x) => {
                        const reportGroup = reportFull.find(
                            (f) => f.Group.trim() === x.trim(),
                        );
                        if (reportGroup) {
                            PersonalityProfileReport.push(reportGroup);
                        }
                    });
                    CompetencyProfile.forEach((x) => {
                        const reportGroup = reportFull.find(
                            (f) => f.Group.trim() === x.trim(),
                        );
                        if (reportGroup) {
                            CompetencyProfileReport.push(reportGroup);
                        }
                    });
                }
            }
        }
        return { PersonalityProfileReport, CompetencyProfileReport };
    }
    PersonalityProfileReport?: any[];
    CompetencyProfileReport?: any[];
}
