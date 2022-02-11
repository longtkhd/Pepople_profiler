import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { plainToClass } from 'class-transformer'
import { ObjectId } from 'mongodb'
import * as moment from 'moment'
import { Subscription } from 'src/schemas/agency.schema'
import { PackageService } from 'src/package/package.service'
import { ConfigurationService } from 'src/shared/configuration/configuration.service'
import { AgencyService } from './agency.service'

import {
    CreatePaymentHistoryDto,
    IChargesUpgradePlan,
    IPaymentNotification,
    IPinpaymentCharges,
    SetSubscriptionDto,
    SubscriptionInfoDto,
} from './dto/agency'

import { UsersService } from 'src/user/user.service'
import { PaymentHistoryService } from './payment-history.service'
import { PaymentHistory, PaymentStatus } from 'src/schemas/payment-history.schema'
import { MapperService } from 'src/shared/mapper/mapper.service'
import { PinPaymentException } from 'src/shared/pin-payment.exception'
import { PinpaymentService } from '../shared/pinpayment.service'
import { CreateNotificationDto } from '../notification/dto/create-notification.dto'
import { NotificationType } from '../schemas/notification.schema'
import { Logger } from '@nestjs/common/services/logger.service'
import { roundNumber } from '../shared/utils/constants'
import { SocketService } from '../notification/socket.service'
import { PackageFilterParamDto } from 'src/package/dto/package.dto'

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectModel(Subscription)
        private readonly repo: ReturnModelType<typeof Subscription>,
        private readonly coreService: ConfigurationService,
        private readonly pinPaymentService: PinpaymentService,
        private readonly packageService: PackageService,
        @Inject(forwardRef(() => AgencyService))
        private readonly agencyService: AgencyService,
        private readonly userService: UsersService,
        private readonly paymenHistoryService: PaymentHistoryService,
        private readonly mapperService: MapperService,
        private readonly socketService: SocketService
    ) {
        this.mapperService.createMap(Subscription.name, SubscriptionInfoDto.name)
    }

    async findOneByAgencyId(agencyId: string): Promise<Subscription | null> {
        const sub = await this.repo.findOne({ agency_id: new ObjectId(agencyId) })
        if (sub) return sub
        return null
    }

    private readonly logger = new Logger('SubscriptionService')

    async getSubscription(agencyId: string): Promise<SubscriptionInfoDto> {
        try {
            const subscription = await this.repo.findOne({ agency_id: new ObjectId(agencyId) })
            return plainToClass(SubscriptionInfoDto, subscription, { excludeExtraneousValues: true })
        } catch (error) {
            throw new HttpException(error, 500)
        }
    }

    async createSubscription(
        agencyId: string,
        setSubscriptionDto: SetSubscriptionDto,
    ): Promise<Subscription> {
        try {
            const packageId = await this.packageService.getDetail(
                setSubscriptionDto.package_id,
            )
            if (!packageId) throw new HttpException('PACKAGE_NOT_FOND', 404)
            const currentSub = new this.repo()
            const trialDay = this.coreService.freeTrialDay
            const monthlyDay = this.coreService.mothlyDay
            const subscriptionDate = new Date()
            const expireTrialDate = moment().add(trialDay, 'days').toDate()
            const expireDate = moment().add(monthlyDay + trialDay, 'days').toDate()
            currentSub.package_id = new ObjectId(
                setSubscriptionDto.package_id,
            )
            currentSub.agency_id = new ObjectId(agencyId)
            currentSub.billing_type = setSubscriptionDto.billing_type
            currentSub.price = setSubscriptionDto.price
            currentSub.price_before_tax = setSubscriptionDto.price_before_tax
            currentSub.expire_date = expireDate
            currentSub.subscription_date = subscriptionDate
            currentSub.expire_trial_date = expireTrialDate
            currentSub.next_payment_date = expireTrialDate
            await currentSub.save()
            await this.agencyService.updateAgencySubscriptionPlan(
                currentSub.id,
                agencyId,
            )
            if (setSubscriptionDto.agency_size) {
                await this.agencyService.updateAgencySize(
                    agencyId,
                    setSubscriptionDto.agency_size,
                )
            }
            return currentSub
        } catch (error) {
            throw new HttpException(error, 500)
        }
    }

    async updateSubscription(
        agencyId: string,
        setSubscriptionDto: SetSubscriptionDto,
    ): Promise<Subscription> {
        try {
            const currentSub = await this.repo.findOne({
                agency_id: new ObjectId(agencyId)
            })
            const subscriptionDate = new Date()
            const monthlyDay = this.coreService.mothlyDay
            const expireDate = moment().add(monthlyDay, 'days').toDate()
            currentSub.package_id = new ObjectId(
                setSubscriptionDto.package_id,
            )
            currentSub.billing_type = setSubscriptionDto.billing_type
            currentSub.price = roundNumber(setSubscriptionDto.price)
            currentSub.price_before_tax = setSubscriptionDto.price_before_tax
            if (currentSub.expire_trial_date === null || !currentSub.expire_trial_date) {
                currentSub.subscription_date = subscriptionDate
                currentSub.next_payment_date = expireDate
            }
            await currentSub.save()
            await this.agencyService.updateAgencySubscriptionPlan(
                currentSub.id,
                currentSub.agency_id.toString(),
            )
            if (setSubscriptionDto.agency_size) {
                await this.agencyService.updateAgencySize(
                    currentSub.agency_id.toString(),
                    setSubscriptionDto.agency_size,
                )
            }
            return currentSub
        } catch (error) { throw new HttpException(error, 500) }
    }

    async getChargesUpgradePlan(agencyId: string, _update: SetSubscriptionDto) {
        try {
            const sub = await this.getSubscription(agencyId)
            const agency = await this.agencyService.getAgencyDetail(agencyId)
            const newPackage = await this.packageService.getDetail(_update.package_id)
            const monthlyDay = this.coreService.mothlyDay
            const info: IChargesUpgradePlan = {
                currentPackageName: sub.package_id.package_name,
                newPackageName: newPackage.package_name,
                status: 'Update',
                amount: _update.price,
                amount_before_tax: _update.price_before_tax
            }
            if (newPackage.max_recruiter > sub.package_id.max_recruiter) {
                const nextPaymentDate = moment(sub.next_payment_date)
                    .startOf('day').add(-1, 'days')
                const upgradeDate = moment().startOf('day')
                const discountDays = moment.duration(
                    nextPaymentDate.diff(upgradeDate)
                ).asDays()
                const totalDiscount = (discountDays / monthlyDay) * sub?.package_id?.price * Number(
                    agency.company_info.agency_size
                )
                info.status = 'Upgrade'
                info.discount = roundNumber(totalDiscount)
                info.amount = roundNumber(_update.price - totalDiscount)
                info.amount_before_tax = roundNumber(_update.price_before_tax - totalDiscount)
            }
            _update.chargesInfo = info
            return _update
        } catch (e) { throw new HttpException(e, 500) }
    }

    async paymentUpdateSubscription(agencyId: string, _update: SetSubscriptionDto): Promise<Subscription> {
        try {
            const packageId = await this.packageService.getDetail(_update?.package_id)
            await this.createPaymentHistory(
                agencyId, _update?.chargesInfo?.amount,
                packageId?.package_name
            )
            return await this.updateSubscription(agencyId, _update)
        } catch (e) {
            throw new PinPaymentException(e, 500)
        }
    }

    async cancelSubscription(agencyId: string) {
        try {
            const agency = await this.agencyService.getAgencyDetail(agencyId)
            const sub = await this.getSubscription(agencyId)
            /* remove and deactive user */
            await this.repo.findOneAndRemove({ agency_id: new ObjectId(agencyId) })
            await this.agencyService.removeSubscriptionPlan(agencyId)
            await this.userService.deactiveAllRecruiterByAgencyId(agencyId)
            /* notification cancel subscription */
            await this.socketService.sendNoticeToAdmin(
                `${agency.agency_name} cancelled the subscription`,
                `${agency.agency_name} cancelled their ${sub.package_id.package_name} subscription`,
                NotificationType.CANCEL_SUBSCRIPTION
            )
        } catch (error) {
            throw new HttpException(error, 500)
        }
    }

    /**
     * Update price plan after change agency size
     * @param {string} agencyId: Id agency
     * @param {number} agencySize: agency size
     * */
    async updatePrice(agencyId: string, agencySize: number) {
        try {
            const subPlan = await this.getSubscription(agencyId)
            const gstTax = this.coreService.get('GST_TAX')
            const packagePrice = subPlan?.package_id?.price
            const priceBeforeTax = roundNumber(packagePrice * agencySize)
            const priceTax = roundNumber((packagePrice * agencySize * (Number(gstTax) / 100)))
            const totalPrice = roundNumber(priceBeforeTax + priceTax)
            subPlan.price = totalPrice
            subPlan.price_before_tax = priceBeforeTax
            await this.repo.findByIdAndUpdate(
                { _id: new ObjectId(subPlan.id) },
                { price: totalPrice, price_before_tax: priceBeforeTax })
        } catch (e) {
            throw new HttpException(e, 500)
        }
    }

    async createPaymentHistory(agencyId: string, amount?: number, packageName?: string): Promise<PaymentHistory | null> {
        try {
            const agency = await this.agencyService.getAgencyDetail(agencyId)
            const sub = await this.getSubscription(agencyId)
            const description = `Pay for the ${packageName || sub.package_id.package_name} package.`
            if (!agency?.payment_info || !agency?.payment_info.customer_email)
                return null
            const chargeData: IPinpaymentCharges = {
                amount: amount || sub.price,
                description: description,
                customer_token: agency.payment_info.customer_token,
                email: agency.payment_info?.customer_email,
            }
            const response = await this.pinPaymentService.customerCharges(chargeData)
            let chargeResponse: any
            if(response){
                chargeResponse = {
                    ...response,
                    agency_id: agencyId.toString(),
                    package_id: sub.package_id.id.toString(),
                }
            }
            else{
                chargeResponse = {
                    ...chargeData,
                    agency_id: agencyId.toString(),
                    package_id: sub.package_id.id.toString(),
                    status: PaymentStatus.ERROR,
                }
            }
            
            const paymentHistoryData = plainToClass(
                CreatePaymentHistoryDto,
                chargeResponse,
                { excludeExtraneousValues: true }
            )
            return await this.paymenHistoryService.create(paymentHistoryData)
        } catch (error) {
            this.logger.error(error)
            return null
        }
    }

    async cronPaymentSubscription() {
        try {
            const offset = moment().utcOffset() * -1
            const startDate = moment.utc().startOf('day').add(offset, 'minutes').toDate()
            const endDate = moment.utc().endOf('day').add(offset, 'minutes').toDate()
            const monthlyDay = this.coreService.mothlyDay
            const subPayments = await this.repo.find({
                $or: [
                    {
                        next_payment_date: {
                            $gt: startDate,
                            $lt: endDate,
                        },
                    },
                    { payment_success: false },
                ],
            })
            if (!subPayments) return
            for (const sub of subPayments) {
                const subscription = this.mapperService.map<SubscriptionInfoDto>(
                    sub,
                    SubscriptionInfoDto.name,
                    Subscription.name,
                )
                // is account deactive, is deleted not check payment
                const user = await this.userService.findOne({agency_id: sub.agency_id})
                if(user && (!user?.is_active || user?.is_deleted)) continue
                
                const paymentHistory = await this.createPaymentHistory(
                    subscription.agency_id,
                )
                if (paymentHistory && paymentHistory.status === PaymentStatus.SUCCESS) {
                    sub.time_send_notification = 0
                    sub.expire_date = moment().add(monthlyDay, 'days').toDate()
                    if (sub.expire_trial_date) sub.expire_trial_date = null
                    sub.next_payment_date = moment(sub.next_payment_date).add(monthlyDay + 1, 'days').toDate()
                    sub.payment_success = true
                    await sub.save()
                }else{
                    sub.time_send_notification += 1
                    if (sub.expire_trial_date) sub.expire_trial_date = null
                    sub.payment_success = false
                    await sub.save()
                    // send notice to admin
                    const agency = await this.agencyService.getAgencyDetail(subscription.agency_id)
                    await this.socketService.sendNoticeToAdmin(
                        'Client Payment Failed',
                        `Payment of ${agency.agency_name} has failed`,
                        NotificationType.PAYMENT_UNSUCCESS
                    )
                }
            }
        } catch (error) { console.log(error) }
    }

    async statisticSubscriptionType() {
        try {
            const currentDate = new Date()
            const trialDay = this.coreService.freeTrialDay
            currentDate.setDate(currentDate.getDate() - trialDay)
            const freeTrial = await this.agencyService.getListAgencyFreeTrial(trialDay)
            const freeTrialId = freeTrial.map(x => new ObjectId(x.id))
            const noSubscription = await this.agencyService.getListNoSubscription(trialDay)
            const packageList = await this.packageService.paginatePackageList(new PackageFilterParamDto(1, 20))
            const deletedAgency = await this.agencyService.getDeletedAgency()

            const promises = packageList.list.map(async ipackage => {
                let count = 0;
                const packageUsed = await this.agencyService.countSubscriptionType(freeTrialId)
                const packageExit = packageUsed.find(p => {
                    return p.packageId === ipackage.id
                })
                if(packageExit){ count = packageExit.count }
                return { _id: { package_id: ipackage.id, package_name: ipackage.package_name }, count: count }
            })

            const countSubscriptionType = await Promise.all(promises)

            return { countSubscriptionType, freeTrial: freeTrial.length, noSubscription }
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    /**
     * Return list data notification payment unsuccess
     * */
    async getAllPaymentUnsuccess(): Promise<CreateNotificationDto[] | []> {
        try {
            const notifications: CreateNotificationDto[] = []
            const timeSendNotice = this.coreService.timeSendNotification
            const timeDeactive = timeSendNotice[timeSendNotice.length -1]
            const subs = await this.repo.find({
                time_send_notification: {
                    $in: timeSendNotice
                }
            })
            if (!subs.length || !timeSendNotice.length) return notifications
            const messages: IPaymentNotification[] = [{
                key: timeSendNotice[0],
                title: 'Oops, your payment failed.',
                content: `Don\'t worry, we will try your payment again over the next few days. \n
                To keep enjoying the People Profiler platform, you may need to update your payment details.`
            }, {
                key: timeSendNotice[1],
                title: 'Oops, your payment failed again.',
                content: `We will try your payment again over the next few days.
                To keep enjoying the People Profiler platform, you may need to update your payment details.`
            }, {
                key: timeSendNotice[2],
                title: 'Oops, your payment failed again.',
                content: `We will try your payment again over the next few days. It will be the final attempt. 
                Please update your payment details urgently to prevent your service from being interrupted.`
            }]
            for (const sub of subs) {
                // deactive user
                if (sub.time_send_notification === timeDeactive) {
                    await this.agencyService.deactivateAgency(sub.agency_id.toString(), true)
                    continue
                }
                const message = messages.find(m => m.key === sub.time_send_notification)
                if (message) {
                    const data = new CreateNotificationDto()
                    const agency = await this.agencyService.getAgencyDetail(
                        sub.agency_id.toString()
                    )
                    data.title = message.title
                    data.content = message.content
                    data.receiver_id = new ObjectId(agency.owner_id)
                    data.type = NotificationType.PAYMENT_UNSUCCESS
                    notifications.push(data)
                }
            }
            return notifications
        } catch (e) { this.logger.error(e) }
    }
}
