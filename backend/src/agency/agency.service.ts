import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    Logger,
} from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Readable } from 'stream';
import { ObjectId } from 'mongodb';
import { plainToClass } from 'class-transformer';
import { PinpaymentService } from '../shared/pinpayment.service';
import { Agency, Subscription } from '../schemas/agency.schema';
import { S3ManagerService } from '../aws/s3-manager.service';
import { ConfigurationService } from '../shared/configuration/configuration.service';
import { MapperService } from '../shared/mapper/mapper.service';
import {
    AgencyFilterParamDto,
    AgencyInfoDto,
    CountSubscriptionDto,
    CreateCardDto,
    CreatePaymentHistoryDto,
    OutAgencyListingDto,
    UpdateAgencyInfoDto,
} from './dto/agency';
import {
    JwtPayload,
    UpdateUserState,
    UserBasicInfoDto,
} from '../auth/dto/login';
import { FileInput } from '../shared/base.dto';

import { Package } from 'src/schemas/package.schema';
import { PinPaymentException } from 'src/shared/pin-payment.exception';
import { User } from 'src/schemas/user.schema';
import { UsersService } from 'src/user/user.service';
import { DaxtraIntegrationService } from 'src/daxtra.Integration/daxtra-integration.service';
import { CandidateAssessmentService } from 'src/candidate/candidate-assessment.service';
import * as moment from 'moment';
import { SubscriptionService } from './agency_subscription.service';
import { PaymentHistoryService } from './payment-history.service';
import { SocketService } from '../notification/socket.service';
import { NotificationType } from '../schemas/notification.schema';
import { roundNumber } from '../shared/utils/constants';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AgencyService {
    constructor(
        @InjectModel(Agency)
        private readonly repo: ReturnModelType<typeof Agency>,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly coreConfig: ConfigurationService,
        private readonly pinPaymentService: PinpaymentService,
        private readonly subscriptionService: SubscriptionService,
        private readonly paymentService: PaymentHistoryService,
        private readonly mapperService: MapperService,
        private readonly s3Service: S3ManagerService,
        private readonly socketService: SocketService,
        @Inject(forwardRef(() => DaxtraIntegrationService))
        private readonly daxtraIntegrationService: DaxtraIntegrationService,
        @Inject(forwardRef(() => CandidateAssessmentService))
        private readonly candidateAssessmentService: CandidateAssessmentService,
        private readonly mailService: MailService,
    ) {
        this.mapperService.createMap(UpdateAgencyInfoDto.name, Agency.name);
        this.mapperService.createMap(Agency.name, AgencyInfoDto.name);
    }
    private readonly logger = new Logger(AgencyService.name);

    public async getListAgencyFreeTrial(trialDay: number) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - trialDay);
        return await this.repo.find({
            subscription_plan: { $exists: true, $ne: null },
            created_at: { $gte: currentDate },
            is_deleted: { $ne: true },
        });
    }
    public async getDeletedAgency() {
        return await this.repo.find({
            is_deleted: { $eq: true },
        });
    }
    public async getListNoSubscription(trialDay: number) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - trialDay);
        return await this.repo.countDocuments({
            subscription_plan: null,
            is_deleted: { $ne: true },
        });
    }
    public async paginateAgencyList(
        filter: AgencyFilterParamDto,
    ): Promise<OutAgencyListingDto> {
        try {
            const list = await this.repo.paginate(
                filter.buildFilterQuery(),
                filter.buildPagingQuery([
                    'subscription_plan',
                    'created_by',
                    'recruiter_count',
                ]),
            );
            const result = new OutAgencyListingDto(filter.page, filter.size);
            result.total = list.totalDocs;
            if (!list.totalDocs) {
                result.list = [];
                return result;
            }
            // userList[0]
            const mapJob = list.docs.map((j) => {
                const mapped = this.mapperService.map<AgencyInfoDto>(
                    j,
                    AgencyInfoDto.name,
                    Agency.name,
                );
                if (
                    j.subscription_plan &&
                    (j.subscription_plan as Subscription).package_id
                ) {
                    mapped.subscription_plan_name = (
                        (j.subscription_plan as Subscription)
                            .package_id as Package
                    ).package_name;
                }
                if (j.created_by && (j.created_by as User).id) {
                    mapped.created_by = {
                        id: (j.created_by as User).id,
                        email: (j.created_by as User).email,
                        first_name: (j.created_by as User).first_name,
                        last_name: (j.created_by as User).last_name,
                        phone_number: (j.created_by as User).phone_number,
                        job_title: (j.created_by as User).job_title,
                        country_code: (j.created_by as User).country_code,
                        is_active: (j.created_by as User).is_active,
                        is_deleted: (j.created_by as User).is_deleted,
                        is_verify: (j.created_by as User).is_verify,
                    };
                }
                return mapped;
            });
            result.list = mapJob;
            return result;
        } catch (error) {
            this.logger.error(error);
        }
    }
    public async sendWelcomeMail(agency_id: string, payload: JwtPayload) {
        try {
            const agency = await this.repo
                .findById(agency_id)
                .populate([
                    'subscription_plan',
                    'created_by',
                    'recruiter_count',
                ])
                .exec();
            const res = this.mapperService.map<AgencyInfoDto>(
                agency,
                AgencyInfoDto.name,
                Agency.name,
            );
            if (
                agency.subscription_plan &&
                (agency.subscription_plan as Subscription).package_id
            ) {
                res.subscription_plan_name = (
                    (agency.subscription_plan as Subscription)
                        .package_id as Package
                ).package_name;
                res.subscription_price = (
                    agency.subscription_plan as Subscription
                ).price;
                res.end_trial_date = (
                    agency.subscription_plan as Subscription
                ).expire_trial_date;
                res.max_assessment_limit = (
                    (agency.subscription_plan as Subscription)
                        .package_id as Package
                ).max_assessment_limit;
                res.max_recruiter = (
                    (agency.subscription_plan as Subscription)
                        .package_id as Package
                ).max_recruiter;
                res.max_cv_parsing = (
                    (agency.subscription_plan as Subscription)
                        .package_id as Package
                ).max_cv_parsing;
            }

            if (!agency || agency.is_send_welcome || !res.max_recruiter) {
                return false;
            }
            if (!agency.is_send_welcome) {
                if (!agency.is_send_welcome && payload.role === 'agency') {
                    const mailLog = await this.mailService.SendWelcomeAgency(
                        res,
                        payload,
                    );
                    if (mailLog && mailLog.id) {
                        agency.is_send_welcome = true;
                        await agency.save();
                    }
                }
            }
        } catch (error) {}
    }
    public async getAgencyDetail(
        agency_id: string,
        populate_statistic?: boolean,
    ): Promise<AgencyInfoDto> {
        try {
            const agency = await this.repo
                .findById(agency_id)
                .populate([
                    'subscription_plan',
                    'created_by',
                    'recruiter_count',
                ])
                .exec();
            if (!agency) {
                throw new HttpException(
                    'AGENCY_NOT_FOUND',
                    HttpStatus.BAD_REQUEST,
                );
            }
            const now = new Date();
            if (
                !agency.signed_logo_url ||
                !agency.logo_expire_date ||
                now > agency.logo_expire_date
            ) {
                const key = `${agency.id}/logo/${agency.company_info?.logo}`;
                agency.signed_logo_url = this.s3Service.getSignedUrl(
                    this.coreConfig.aws.bucket,
                    key,
                    604800,
                );
                now.setSeconds(now.getSeconds() + 604800);
                agency.logo_expire_date = now;
                await agency.save();
            }
            //console.log(agency)
            const res = this.mapperService.map<AgencyInfoDto>(
                agency,
                AgencyInfoDto.name,
                Agency.name,
            );
            if (
                agency.subscription_plan &&
                (agency.subscription_plan as Subscription).package_id
            ) {
                res.subscription_plan_name = (
                    (agency.subscription_plan as Subscription)
                        .package_id as Package
                ).package_name;
                res.max_assessment_limit = (
                    (agency.subscription_plan as Subscription)
                        .package_id as Package
                ).max_assessment_limit;
                res.max_recruiter = (
                    (agency.subscription_plan as Subscription)
                        .package_id as Package
                ).max_recruiter;
                res.max_cv_parsing = (
                    (agency.subscription_plan as Subscription)
                        .package_id as Package
                ).max_cv_parsing;
            }
            if (agency.created_by && (agency.created_by as User).id) {
                res.created_by = {
                    id: (agency.created_by as User).id,
                    email: (agency.created_by as User).email,
                    first_name: (agency.created_by as User).first_name,
                    last_name: (agency.created_by as User).last_name,
                    phone_number: (agency.created_by as User).phone_number,
                    job_title: (agency.created_by as User).job_title,
                    country_code: (agency.created_by as User).country_code,
                    is_active: (agency.created_by as User).is_active,
                    is_deleted: (agency.created_by as User).is_deleted,
                    is_verify: (agency.created_by as User).is_verify,
                };

                const query: any = {
                    _id: new ObjectId(res.created_by.id),
                    role: 'agency',
                };
                query.agency_id = new ObjectId(agency_id);

                const user = await this.usersService.findOne(query, [
                    {
                        path: 'assigned_job_list',
                    },
                    { path: 'created_job_list' },
                ]);

                if (user) {
                    res.created_by.open_job = user.open_job;
                    res.created_by.close_job = user.close_job;
                }
            }

            if (populate_statistic) {
                const totalCvParsing =
                    await this.daxtraIntegrationService.countParsingById(
                        agency_id,
                    );
                const totalAssessmentReport =
                    await this.candidateAssessmentService.countAssessmentReportById(
                        agency_id,
                    );
                return { ...res, ...totalCvParsing, ...totalAssessmentReport };
            }
            //console.log(res)
            return res;
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(error, 500);
        }
    }

    public async createAgency(
        agency: UserBasicInfoDto,
        user_id: string,
    ): Promise<Agency> {
        const nAgency = new this.repo();
        //const user = registration.user;
        nAgency.agency_name = agency.agency_name;
        nAgency.country_code = agency.country_code;
        nAgency.owner_id = new ObjectId(user_id);
        nAgency.created_by = new ObjectId(user_id);
        return await nAgency.save();
    }
    getCompanyFile(
        agency_id: string,
        type: string,
        fileName: string,
    ): Readable {
        const key = `${agency_id}/${type}/${fileName}`;

        return this.s3Service.getPrivateFile(this.coreConfig.aws.bucket, key);
    }

    public async Update(
        agency: UpdateAgencyInfoDto,
        logo?: FileInput,
        background?: FileInput,
    ): Promise<Agency> {
        try {
            const currentObj = await this.repo.findById(agency.id);
            if (!currentObj) return null;
            const updateAgency = this.mapperService.map<Agency>(
                agency,
                Agency.name,
                UpdateAgencyInfoDto.name,
            );
            if (logo) {
                const key = `${agency.id}/logo/${logo.originalname}`;
                await this.s3Service.uploadFile(
                    this.coreConfig.aws.bucket,
                    logo.buffer,
                    key,
                );

                updateAgency.signed_logo_url = this.s3Service.getSignedUrl(
                    this.coreConfig.aws.bucket,
                    key,
                    604800,
                );
                const now = new Date();
                now.setSeconds(now.getSeconds() + 604800);
                updateAgency.logo_expire_date = now;
                updateAgency.company_info.logo = logo.originalname;
            }

            if (background) {
                const key = `${agency.id}/background/${background.originalname}`;
                await this.s3Service.uploadFile(
                    this.coreConfig.aws.bucket,
                    background.buffer,
                    key,
                );

                updateAgency.signed_background_url =
                    this.s3Service.getSignedUrl(
                        this.coreConfig.aws.bucket,
                        key,
                        604800,
                    );
                updateAgency.company_info.background_image =
                    background.originalname;
            }
            await this.repo.findByIdAndUpdate(agency.id, updateAgency);
            return await this.repo.findById(agency.id).exec();
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(error, 500);
        }
    }
    async deleteAgency(id: string) {
        const deletedAgency = await this.repo
            .findOneAndUpdate(
                {
                    _id: new ObjectId(id),
                },
                {
                    is_deleted: true,
                },
                { new: true },
            )
            .then((doc) => {
                if (!doc)
                    throw new HttpException(
                        'AGENCY_NOT_FOUND',
                        HttpStatus.BAD_REQUEST,
                    );
                return doc;
            });
        if (deletedAgency) await this.usersService.deleteAgency(id);
        return deletedAgency;
    }
    async cleanUp() {
        const deleteAgencies = await this.repo
            .find({
                is_deleted: true,
            })
            .exec();
        const promises = deleteAgencies.map(async (deleteAgency) => {
            await this.usersService.deleteAgency(deleteAgency.id);
        });
        await Promise.all(promises);
    }
    public async deactivateAgency(
        id: string,
        isPaymentFailed?: boolean,
    ): Promise<User | null> {
        const user = await this.usersService.findOne({
            agency_id: new ObjectId(id),
            role: 'agency',
        });
        let state = new UpdateUserState();

        if (user) {
            state = this.mapperService.map<UpdateUserState>(
                user,
                UpdateUserState.name,
                User.name,
            );
            state.is_active = false;
            await this.usersService.changeUserState(user.id, state);
            /* Notification deactive agency account */
            // send to agency admin
            const agencyTitle = isPaymentFailed
                ? 'Your People Profiler account has been deactivated due to payment failure.'
                : 'Your People Profiler account has been deactivated.';
            await this.socketService.makeNotification(
                user.id,
                agencyTitle,
                'Your account has been deactivated. Please contact the People Profiler support team for more information.',
                NotificationType.DEATIVATED_ACCONNT,
            );
            // send to admin
            const agency = await this.getAgencyDetail(id);
            const adminContent = isPaymentFailed
                ? `The account for ${agency?.agency_name} has been deactivated due to a failed payment`
                : `The account for ${agency?.agency_name} has been deactivated by the agency administrator.`;
            await this.socketService.sendNoticeToAdmin(
                'Agency account has been deactivated',
                adminContent,
                NotificationType.DEATIVATED_ACCONNT,
            );
            await this.usersService.deactiveAllRecruiterByAgencyId(id);
            return this.usersService.findOne({ _id: new ObjectId(id) });
        }

        return null;
    }

    public async updateAgencySubscriptionPlan(
        subId: string,
        agencyId: string,
    ): Promise<AgencyInfoDto> {
        try {
            const sub_id = new ObjectId(subId);
            const agency_id = new ObjectId(agencyId);
            await this.repo.findByIdAndUpdate(agency_id, {
                subscription_plan: sub_id,
            });
            const agency = await this.repo.findById(agency_id).exec();
            return plainToClass(AgencyInfoDto, agency, {
                excludeExtraneousValues: true,
            });
        } catch (error) {
            this.logger.error(error);
        }
    }

    public async removeSubscriptionPlan(agencyId: string) {
        try {
            await this.repo.findByIdAndUpdate(new ObjectId(agencyId), {
                subscription_plan: null,
            });
        } catch (error) {
            this.logger.error(error);
        }
    }

    public async createAgencyPaymentInfo(
        payload: JwtPayload,
        _paymentInfo: CreateCardDto,
    ): Promise<Agency> {
        try {
            const agency = await this.repo.findById(
                new ObjectId(payload.agency_id),
            );
            if (!agency) throw new HttpException('Agency not found!', 404);

            const customerCardData = {
                email: payload.email,
                first_name: payload.first_name,
                last_name: payload.last_name,
                phone_number: payload.phone_number,
                card: { ..._paymentInfo },
            };
            const paymentResponseData =
                await this.pinPaymentService.createPinpaymentCustomer(
                    customerCardData,
                );
            const paymentData = {
                card_token: paymentResponseData.card.token,
                customer_token: paymentResponseData.token,
                customer_email: paymentResponseData.email,
                ...paymentResponseData.card,
                // card_number: _paymentInfo.number,
                // cvc: _paymentInfo.cvc,
                verify_date: new Date(),
            };
            agency.payment_info = paymentData;
            return await agency.save();
        } catch (error) {
            throw new PinPaymentException(error, 500);
        }
    }

    public async updateAgencyPaymentInfo(
        payload: JwtPayload,
        _paymentInfo: CreateCardDto,
    ): Promise<Agency> {
        try {
            const agency = await this.repo.findById(
                new ObjectId(payload.agency_id),
            );
            if (!agency) throw new HttpException('Agency not found!', 404);
            if (
                !agency.payment_info ||
                !agency.payment_info.customer_token ||
                !agency.payment_info.card_token
            )
                throw new HttpException(
                    'Your info payment method not found',
                    404,
                );
            const customerToken = agency.payment_info.customer_token;
            const customerCardData = {
                card: { ..._paymentInfo },
            };
            const paymentResponseData =
                await this.pinPaymentService.updatePinpaymentCustomer(
                    customerToken,
                    customerCardData,
                );
            const paymentData = {
                card_token: paymentResponseData?.card?.token,
                customer_token: paymentResponseData?.token,
                customer_email: paymentResponseData?.email,
                ...paymentResponseData?.card,
                // card_number: _paymentInfo.number,
                // cvc: _paymentInfo.cvc,
                verify_date: new Date(),
            };
            agency.payment_info = paymentData;
            return await agency.save();
        } catch (error) {
            throw new PinPaymentException(error, 500);
        }
    }

    async createPaymentHistory(paymentInfo: CreatePaymentHistoryDto) {
        try {
            await this.paymentService.create(paymentInfo);
        } catch (e) {
            throw new HttpException(e, 500);
        }
    }

    /**
     * Update agency size
     * @param { string } agencyId: Id agency
     * @param { string } agencySize: new agency size
     * @return { object }
     */
    async updateAgencySize(
        agencyId: string,
        agencySize: string,
        updatePrice?: boolean,
    ) {
        try {
            await this.repo.findOneAndUpdate(
                {
                    _id: new ObjectId(agencyId),
                },
                { 'company_info.agency_size': agencySize },
            );

            if (updatePrice) {
                await this.subscriptionService.updatePrice(
                    agencyId,
                    Number(agencySize),
                );
            }
        } catch (e) {
            throw new HttpException(e, 500);
        }
    }

    /**
     * Return total amount charges and total recruiter need charges
     * @param {string} agencyId: Id agency
     * @param {number} recruiterLength: Number of recruiter invite
     * @return {Object | null} info
     * */
    async getNotificationInviteRecruiterNeedCharges(
        agencyId: string,
        recruiterLength: number,
        differentSize?: number,
    ) {
        const agency = await this.getAgencyDetail(agencyId);
        const monthlyDay = this.coreConfig.mothlyDay;
        const agencySize = Number(agency.company_info.agency_size);
        let recruiters: number = differentSize || 0;
        if (!differentSize) {
            const totalAccounts = agency.recruiter_count + recruiterLength;
            if (agencySize >= totalAccounts) return null;
            recruiters = totalAccounts - agencySize;
        }
        const currentSub = agency?.subscription_plan;
        // Is trial subscription, not charges invite recruiter
        if (currentSub.expire_trial_date !== null) return null;
        // get the number of discount days
        const nextPaymentDate = moment(currentSub.next_payment_date)
            .startOf('day')
            .add(-1, 'days');
        const inviteDate = moment().startOf('day');
        const discountDays = moment
            .duration(nextPaymentDate.diff(inviteDate))
            .asDays();
        // Compute total amount charges invite recruiter
        const price = currentSub.package_id.price;
        const gstTax = this.coreConfig.get('GST_TAX');
        const totalChargesBeforeTax =
            (discountDays / monthlyDay) * recruiters * price;
        const totalCharges =
            totalChargesBeforeTax +
            totalChargesBeforeTax * (Number(gstTax) / 100);
        return {
            amount: roundNumber(totalCharges),
            amountBeforeTax: roundNumber(totalChargesBeforeTax),
            recruiters,
        };
    }

    async countSubscriptionType(
        ids: ObjectId[],
    ): Promise<CountSubscriptionDto[]> {
        let match = {
            subscription_plan: { $exists: true },
            is_deleted: { $ne: true },
        };
        if (ids.length) {
            match['_id'] = { $nin: ids };
        }

        const packagesUsed = await this.repo.aggregate([
            {
                $match: { ...match },
            },
            {
                $lookup: {
                    from: 'subscriptions',
                    localField: 'subscription_plan',
                    foreignField: '_id',
                    as: 'subscriptions',
                },
            },
            {
                $unwind: {
                    path: '$subscriptions',
                },
            },
            {
                $project: {
                    packageId: '$subscriptions.package_id',
                },
            },
            {
                $group: {
                    _id: '$packageId',
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    packageId: { $toString: '$_id' },
                    count: 1,
                },
            },
        ]);

        const planObject = packagesUsed.map((p) => {
            return plainToClass(CountSubscriptionDto, p, {
                excludeExtraneousValues: true,
            });
        });

        return planObject;
    }
}
