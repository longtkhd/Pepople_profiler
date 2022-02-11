import { Injectable, Logger } from '@nestjs/common';
import { Token } from '../schemas/token.schema';

import { MailLogs, MailType } from '../schemas/mailLog.schema';
import { ObjectId } from 'mongodb';

import { SESManagerService } from '../aws/ses-manager.service';
import { ConfigurationService } from '../shared/configuration/configuration.service';
import { renderFile } from 'ejs';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import {
    AgencyInfoDto,
    ReminderMailDto,
    UserInvitedDto,
} from 'src/agency/dto/agency';

import { JwtPayload, UserDto } from 'src/auth/dto/login';
import * as moment from 'moment';
import { OutJobClientContactDto } from 'src/job/dto/job.res.dto';
import { OutCandidateJobAssessmentInvite } from 'src/candidate/dto/candidate';
import { User } from 'src/schemas/user.schema';
import { InviteClientJobMail } from 'src/client/dto/client';
import { InCandidateAssessmentDto } from 'src/candidate/dto/input';
import { S3ManagerService } from 'src/aws/s3-manager.service';

@Injectable()
export class MailService {
    constructor(
        @InjectModel(MailLogs)
        private readonly repo: ReturnModelType<typeof MailLogs>,
        private readonly configService: ConfigurationService,
        private readonly sesService: SESManagerService,
        private readonly s3Service: S3ManagerService,
    ) {}
    private readonly logger = new Logger(MailService.name);

    private resolveSubject(mailType: MailType) {
        switch (mailType) {
            case MailType.RegisterAgency:
                return 'Email Confirmation - People Profiler';
            case MailType.RegisterRecruiter:
                return 'Your People Profiler Invitation';
            case MailType.ForgotPassword:
                return 'Reset Your Password';
            case MailType.Notification:
                return 'People Profiler Notification';
            case MailType.AgencyWelcomeEmail:
                return 'Welcome to People Profiler';
            case MailType.SubscriptionReminderMail:
                return 'Email Reminder Payment';
            case MailType.InviteJobClientContact:
                return 'Email Invite Client';
            case MailType.RequestChangeEmail:
                return 'Change Email Confirmation';
            default:
                break;
        }
    }
    private resolveLink(mailType: MailType, token?: Token, uid?: string) {
        switch (mailType) {
            case MailType.RegisterAgency:
                return (
                    this.configService.mailConfig.frontURL +
                    'setup?token=' +
                    token.id
                );
            case MailType.RegisterRecruiter:
                return (
                    this.configService.mailConfig.frontURL +
                    'join?token=' +
                    token.id
                );
            case MailType.ForgotPassword:
                return (
                    this.configService.mailConfig.frontURL +
                    'reset-password?token=' +
                    token.id
                );
            case MailType.AgencyWelcomeEmail:
                return this.configService.mailConfig.frontURL + 'login';
            case MailType.InviteJobClientContact:
                return (
                    this.configService.mailConfig.frontURL +
                    'client-job-dashboard/' +
                    uid
                );
            case MailType.RequestChangeEmail:
                return (
                    this.configService.mailConfig.frontURL +
                    'recruiter-details/' +
                    uid
                );
            default:
                break;
        }
    }
    public async findMailByRefId(ref_id: string, mailType: MailType) {
        return this.repo
            .findOne({
                ref_id: ref_id,
                type: mailType,
            })
            .exec();
    }
    public async SendVerifyUser(
        mailType: MailType,
        email: string,
        body: string,
        user_id?: string,
    ) {
        //Email Confirmation
        const newMailLog = new this.repo();
        newMailLog.receiver = email;
        newMailLog.created_by = new ObjectId(user_id);
        newMailLog.type = mailType;
        newMailLog.subject = this.resolveSubject(mailType);
        newMailLog.body = body;

        await this.sesService.sendEmailWithAttachments(
            this.configService.mailConfig.from,
            newMailLog.subject,
            newMailLog.body,
            newMailLog.receiver,
            undefined,
        );
        return await newMailLog.save();
    }

    public async SendVerifyAgency(
        user: UserDto,
        token: Token,
        user_id?: string,
    ) {
        const body = await renderFile(
            './email_template/agency_email_address_verification.ejs',
            {
                first_name: user.first_name ? user.first_name.trim() : '',
                button_link: this.resolveLink(MailType.RegisterAgency, token),
                asset_url: this.configService.asset_url,
            },
            { rmWhitespace: true },
        );
        return this.SendVerifyUser(
            MailType.RegisterAgency,
            user.email,
            body,
            user_id,
        );
    }

    public async SendVerifyRecruiter(
        user: UserInvitedDto,
        token: Token,
        agency_name: string,
        recruiter_name: string,
        user_id?: string,
    ) {
        try {
            const body = await renderFile(
                './email_template/recruiter_email_address_verification.ejs',
                {
                    first_name: user.first_name ? user.first_name.trim() : '',
                    recruiter_name,
                    button_link: this.resolveLink(
                        MailType.RegisterRecruiter,
                        token,
                    ),
                    agency_name: agency_name,
                    asset_url: this.configService.asset_url,
                },
                { rmWhitespace: true },
            );
            return this.SendVerifyUser(
                MailType.RegisterRecruiter,
                user.email,
                body,
                user_id,
            );
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
    public async SendForgotPass(dto: User, token: Token, user_id?: string) {
        //reset_pass
        const buttonLink =
            dto.role != 'admin'
                ? this.configService.mailConfig.frontURL +
                  'reset-password?token=' +
                  token.id
                : this.configService.mailConfig.front_admin_URL +
                  'reset-password?token=' +
                  token.id;
        const body = await renderFile(
            './email_template/reset_pass.ejs',
            {
                first_name: dto.first_name ? dto.first_name.trim() : '',
                button_link: buttonLink,
                asset_url: this.configService.asset_url,
            },
            { rmWhitespace: true },
        );
        const newMailLog = new this.repo();
        newMailLog.receiver = dto.first_name;
        newMailLog.created_by = new ObjectId(user_id);
        newMailLog.type = MailType.ForgotPassword;
        newMailLog.subject = this.resolveSubject(MailType.ForgotPassword);
        newMailLog.body = body;
        newMailLog.ref_id = user_id;
        //newToken.user_id = user.
        await this.sesService.sendEmailWithAttachments(
            this.configService.mailConfig.from,
            newMailLog.subject,
            newMailLog.body,
            dto.email,
            undefined,
        );
        return await newMailLog.save();
    }

    public async SendWelcomeAgency(dto: AgencyInfoDto, payload: JwtPayload) {
        try {
            const trialDay = this.configService.freeTrialDay;
            const options: any = {
                first_name: payload.first_name ? payload.first_name.trim() : '',
                button_link: this.resolveLink(
                    MailType.AgencyWelcomeEmail,
                    undefined,
                ),
                subscription_plan_name: dto.subscription_plan_name,
                asset_url: this.configService.asset_url,
                price: 0,
                trial: trialDay,
                //moment(testDate).format('MM/DD/YYYY');
            };

            if (dto.subscription_plan_name) {
                //const billing_type = BillingType[dto.subscription_plan.billing_type]
                options.end_trial_date = moment(dto.end_trial_date).format(
                    'DD/MM/YYYY',
                );
                options.price = dto.subscription_price;
                //options.billing_type = billing_type
            } else {
                options.end_trial_date = moment(dto.created_at)
                    .add(trialDay, 'days')
                    .format('DD/MM/YYYY');
                options.billing_type = '';
            }
            const body = await renderFile(
                './email_template/agency_welcome.ejs',
                options,
                { rmWhitespace: true },
            );
            const newMailLog = new this.repo();
            newMailLog.receiver = payload.email;
            newMailLog.created_by = new ObjectId(payload.id);
            newMailLog.type = MailType.AgencyWelcomeEmail;
            newMailLog.subject = this.resolveSubject(
                MailType.AgencyWelcomeEmail,
            );
            newMailLog.body = body;
            //newToken.user_id = user.
            await this.sesService.sendEmailWithAttachments(
                this.configService.mailConfig.from,
                newMailLog.subject,
                newMailLog.body,
                newMailLog.receiver,
                undefined,
            );
            return await newMailLog.save();
        } catch (error) {
            console.log(error);
            this.logger.error(error);
        }
    }
    public async Send(mail: MailLogs) {
        try {
            await this.sesService.sendEmailWithAttachments(
                mail.sender_name
                    ? {
                          address: this.configService.mailConfig.from,
                          name: mail.sender_name,
                      }
                    : this.configService.mailConfig.from,
                mail.subject,
                mail.body,
                mail.receiver,
                undefined,
                mail.sender_email
                    ? {
                          address: mail.sender_email,
                          name: mail.sender_name,
                      }
                    : this.configService.mailConfig.from,
            );
        } catch (error) {}
    }
    public async sendInviteAssessment(
        dto: OutCandidateJobAssessmentInvite,
        payload: JwtPayload,
        candidateJob: InCandidateAssessmentDto,
        agencyInfo: AgencyInfoDto,
    ) {
        try {
            const background_image = await this.getSignedImageUrl(agencyInfo);
            let templateMail = true;
            if (candidateJob && candidateJob.body) {
                candidateJob.body = candidateJob.body.replace(
                    '[button_link]',
                    dto.assessment_link,
                );
                templateMail = false;
            }
            const body = await renderFile(
                './email_template/tp_invite_candidate.ejs',
                {
                    candidate_name: dto.candidate_name,
                    assessment_name: dto.assessment_name,
                    button_link: dto.assessment_link,
                    logoImg: background_image,
                    asset_url: this.configService.asset_url,
                    template_mail: templateMail,
                    body: !templateMail ? candidateJob.body : '',
                },
                { rmWhitespace: true },
            );
            const newMailLog = new this.repo();
            newMailLog.receiver = dto.candidate_email;
            //newMailLog.receiver = 'quanhoang.bhtech@gmail.com'
            newMailLog.created_by = new ObjectId(payload.id);
            newMailLog.type = MailType.InviteAssessmentCandidate;
            newMailLog.subject =
                candidateJob && candidateJob.subject
                    ? candidateJob.subject
                    : 'Assessment invite';
            newMailLog.body = body;
            newMailLog.sender_email = payload.email;
            newMailLog.sender_name = payload.first_name;
            newMailLog.ref_id = dto.assessment_id;
            //newToken.user_id = user.
            await this.sesService.sendEmailWithAttachments(
                {
                    address: this.configService.mailConfig.from,
                    name: `${payload.first_name} ${payload.last_name}`,
                },
                newMailLog.subject,
                newMailLog.body,
                newMailLog.receiver,
                undefined,
                {
                    address: payload.email,
                    name: `${payload.first_name} ${payload.last_name}`,
                },
            );
            return await newMailLog.save();
        } catch (error) {
            console.log(error);
        }
    }
    public async getSignedImageUrl(agencyInfo: AgencyInfoDto) {
        const backgroundImgBase64 = '';
        try {
            if (agencyInfo.signed_logo_url) {
                return agencyInfo.signed_logo_url;
            }

            if (agencyInfo?.company_info?.logo) {
                return this.s3Service.getSignedUrl(
                    this.configService.aws.bucket,
                    `${agencyInfo?.id}/logo/${agencyInfo?.company_info?.logo}`,
                    604800,
                );
            }
        } catch (e) {
            this.logger.error('ERROR_BACKGROUND');
        }
        return backgroundImgBase64;
    }
    public async sendMailInviteJobClientContact(
        dto: OutJobClientContactDto,
        payload: JwtPayload,
        _inviteClientJobMail: InviteClientJobMail,
        agencyInfo: AgencyInfoDto,
    ) {
        try {
            const buttonLink = this.resolveLink(
                MailType.InviteJobClientContact,
                undefined,
                dto.invite_token,
            );
            let templateMail = true;
            if (_inviteClientJobMail && _inviteClientJobMail.body) {
                _inviteClientJobMail.body = _inviteClientJobMail.body.replace(
                    '[button_link]',
                    buttonLink,
                );
                templateMail = false;
            }
            const background_image = await this.getSignedImageUrl(agencyInfo);
            const body = await renderFile(
                './email_template/recruiter_invite_client_email.ejs',
                {
                    first_name: dto.first_name?.trim() || '',
                    button_link: buttonLink,
                    asset_url: this.configService.asset_url,
                    logoImg: background_image,
                    template_mail: templateMail,
                    body: !templateMail ? _inviteClientJobMail.body : '',
                },
                { rmWhitespace: true },
            );
            const newMailLog = new this.repo();

            newMailLog.receiver = dto.email;
            newMailLog.sender_email = payload.email;
            newMailLog.sender_name = `${payload.first_name} ${payload.last_name}`;
            newMailLog.created_by = new ObjectId(payload.id);
            newMailLog.type = MailType.InviteJobClientContact;
            newMailLog.subject =
                _inviteClientJobMail && _inviteClientJobMail.subject
                    ? _inviteClientJobMail.subject
                    : this.resolveSubject(MailType.InviteJobClientContact);
            newMailLog.body = body;
            newMailLog.ref_id = dto.job_client_contact_id;
            await this.sesService.sendEmailWithAttachments(
                {
                    address: this.configService.mailConfig.from,
                    name: `${payload.first_name} ${payload.last_name}`,
                },
                newMailLog.subject,
                newMailLog.body,
                newMailLog.receiver,
                undefined,
                {
                    address: payload.email,
                    name: `${payload.first_name} ${payload.last_name}`,
                },
            );
            return await newMailLog.save();
        } catch (error) {
            console.log(error);
        }
    }

    public async sendMailReminderPayment(dto: ReminderMailDto) {
        try {
            const newMailLog = new this.repo();
            newMailLog.receiver = dto.email;
            newMailLog.created_by = new ObjectId(dto.created_by);
            newMailLog.type = MailType.SubscriptionReminderMail;
            newMailLog.subject = this.resolveSubject(
                MailType.SubscriptionReminderMail,
            );
            newMailLog.body = 'Email Reminder Payment';
            await this.sesService.sendEmailWithAttachments(
                this.configService.mailConfig.from,
                newMailLog.subject,
                newMailLog.body,
                newMailLog.receiver,
                undefined,
            );
            return await newMailLog.save();
        } catch (error) {
            console.log(error);
        }
    }

    public async SendNotification(dto: any, notification: any, sender?: any) {
        try {
            const body = await renderFile(
                './email_template/notification.ejs',
                {
                    first_name: dto.first_name ? dto.first_name.trim() : '',
                    created_at: notification.created_at || Date.now(),
                    content: notification.content,
                    title: notification?.title,
                    asset_url: this.configService.asset_url,
                },
                { rmWhitespace: true },
            );
            const newMailLog = new this.repo();
            newMailLog.receiver = dto.email;
            newMailLog.created_by = sender
                ? new ObjectId(sender.id)
                : new ObjectId(dto.id);
            newMailLog.type = MailType.Notification;
            newMailLog.subject =
                notification?.title ||
                this.resolveSubject(MailType.Notification);
            newMailLog.body = body;
            await this.sesService.sendEmailWithAttachments(
                sender
                    ? {
                          address: this.configService.mailConfig.from,
                          name: sender.first_name,
                      }
                    : this.configService.mailConfig.from,
                newMailLog.subject,
                newMailLog.body,
                dto.email,
                sender
                    ? {
                          address: sender.email,
                          name: sender.first_name,
                      }
                    : undefined,
            );
            return await newMailLog.save();
        } catch (error) {
            console.log(error);
        }
    }

    public async SendRequestChangeEmail(
        user_id,
        userEmail,
        newEmail,
        token: Token,
        agency_name,
        agency_email,
    ) {
        try {
            const body = await renderFile(
                './email_template/recruiter_request_change_mail.ejs',
                {
                    first_name: agency_name ? agency_name.trim() : '',
                    created_at: token.created_at,
                    button_link: this.resolveLink(
                        MailType.RequestChangeEmail,
                        token,
                        user_id,
                    ),
                    asset_url: this.configService.asset_url,
                    old_email: userEmail,
                    new_email: newEmail,
                },
                { rmWhitespace: true },
            );
            const newMailLog = new this.repo();
            newMailLog.receiver = agency_email;
            newMailLog.created_by = new ObjectId(token.id);
            newMailLog.type = MailType.RequestChangeEmail;
            newMailLog.subject = this.resolveSubject(
                MailType.RequestChangeEmail,
            );
            newMailLog.body = body;
            newMailLog.ref_id = user_id;
            return await this.SendVerifyUser(
                MailType.RequestChangeEmail,
                agency_email,
                body,
                token.id,
            );
        } catch (error) {
            console.log(error);
        }
    }
}
