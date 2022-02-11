import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsOptional,
    ValidateNested,
} from 'class-validator';
import { NotificationType } from 'src/schemas/notification.schema';
import { PaginationDto } from '../../shared/base.dto';

export class UserNotificationSettingsDto {
    @ApiProperty()
    user_id: string;

    @ApiProperty()
    recruiter_invite_accepted: number;

    @ApiProperty()
    request_email_update: number;

    @ApiProperty()
    recruiter_change_name: number;

    @ApiProperty()
    payment_unsuccess: number;

    @ApiProperty()
    seven_day_notify: number;

    @ApiProperty()
    one_day_notify: number;

    @ApiProperty()
    deactivated_account: number;

    @ApiProperty()
    product_enhance: number;

    @ApiProperty()
    company_enhance: number;

    @ApiProperty()
    email_updated: number;

    @ApiProperty()
    candidate_start_assessment: number;

    @ApiProperty()
    candidate_complete_assessment: number;

    @ApiProperty()
    client_viewed_report: number;

    @ApiProperty()
    client_provide_feedback: number;

    @ApiProperty()
    cv_parsing_reaches: number;

    @ApiProperty()
    assessemnt_reaches: number;

    @ApiProperty()
    cv_parsing_usage: number;

    @ApiProperty()
    assessemnt_usage: number;
}

export class InfoChargesRecruiter {
    @ApiProperty()
    @IsNotEmpty()
    amount: number;

    @ApiProperty()
    @IsNotEmpty()
    recruiters: number;

    @ApiProperty()
    @IsOptional()
    isAgencySize: boolean;
}

export class UserNotificationSettingDto {
    @ApiProperty()
    type: number;

    @ApiProperty()
    notify: string;

    @ApiProperty()
    by_website: boolean;

    @ApiProperty()
    by_email: boolean;
}
export class UserNotification {
    @ApiProperty()
    user_id: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    status: number;

    @ApiProperty()
    created_date: Date;

    @ApiProperty()
    created_user: string;
}
export class CSVSetting {
    separator = ',';
}
export class UserNotificationsDto extends PaginationDto {
    @Type(() => UserNotification)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [UserNotification] })
    job_list: [UserNotification];
}

export class NotificationFilterParamDto extends PaginationDto {}

export const AgencyNotificationSettings: UserNotificationSettingDto[] = [
    {
        type: NotificationType.RECRUITER_INVITE_ACCEPTED,
        notify: 'Recruiter invitation accepted',
        by_website: true,
        by_email: true,
    },
    {
        type: NotificationType.REQUEST_EMAIL_UPDATE,
        notify: 'Recruiter requests to update email address',
        by_website: true,
        by_email: true,
    },
    {
        type: NotificationType.RECRUITER_CHANGE_NAME,
        notify: 'Recruiter changes name',
        by_website: true,
        by_email: true,
    },
    {
        type: NotificationType.PAYMENT_UNSUCCESS,
        notify: 'Payment unsuccessful',
        by_website: true,
        by_email: true,
    },
    {
        type: NotificationType.DEATIVATED_ACCONNT,
        notify: 'Account is deactivated',
        by_website: true,
        by_email: true,
    },
    {
        type: NotificationType.TALENT_ASSESSMENT,
        notify: 'Monthly talent assessment usage used up',
        by_website: true,
        by_email: true,
    },
    {
        type: NotificationType.TALENT_ASSESSMENT_REACHES,
        notify: 'Monthly talent assessment usage reaches 70%',
        by_website: true,
        by_email: true,
    },
    {
        type: NotificationType.CV_PARSING,
        notify: 'Monthly CV parsing usage used up',
        by_website: true,
        by_email: true,
    },
    {
        type: NotificationType.CV_PARSING_REACHES,
        notify: 'Monthly CV parsing reaches 70% usage',
        by_website: true,
        by_email: true,
    },
    {
        type: NotificationType.PRODUCT_ENHANCE,
        notify: 'People Profiler product enhancement',
        by_website: true,
        by_email: true,
    },
    {
        type: NotificationType.COMPANY_ENHANCE,
        notify: 'Company announcement',
        by_website: true,
        by_email: true,
    },
];

export const RecruiterNotificationSettings: UserNotificationSettingDto[] = [
    {
        type: NotificationType.EMAIL_UPDATED,
        notify: 'Email has been updated by admin',
        by_website: true,
        by_email: true,
    },
    {
        type: NotificationType.CANDIDATE_START_ASSETMENT,
        notify: 'Candidate has started the assessment',
        by_website: true,
        by_email: true,
    },
    {
        type: NotificationType.CANDIDATE_COMPLETE_ASSETMENT,
        notify: 'Candidate has completed the assessment',
        by_website: true,
        by_email: true,
    },
    {
        type: NotificationType.CLIENT_VIEWED_REPORT,
        notify: 'Client has viewed candidate reports',
        by_website: true,
        by_email: true,
    },
    {
        type: NotificationType.CLIENT_PROVIDE_FEEDBACK,
        notify: 'Client provided feedback on candidate reports',
        by_website: true,
        by_email: true,
    },
    {
        type: NotificationType.PRODUCT_ENHANCE,
        notify: 'People Profiler product enhancement',
        by_website: true,
        by_email: true,
    },
    {
        type: NotificationType.COMPANY_ENHANCE,
        notify: 'Company announcement',
        by_website: true,
        by_email: true,
    },
];
