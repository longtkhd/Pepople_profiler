

import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer/decorators'
import { IsArray, IsEmail, IsMongoId, IsNotEmpty, IsOptional, MaxLength, ValidateNested } from 'class-validator'
import { Agency } from '../../schemas/agency.schema'
import { ObjectID as DBObjectID, ObjectId } from 'mongodb'
import { PaginationDto } from 'src/shared/base.dto'
import { FilterQuery } from 'mongoose'
import { PackageInfoDto } from 'src/package/dto/package.dto'
import { PaymentHistory } from 'src/schemas/payment-history.schema'

export enum BillingType {
    MONTHLY = 0,
    YEARLY = 1,
}

export interface IChargesUpgradePlan {
    currentPackageName: string,
    newPackageName: string,
    discount?: number,
    status: string,
    amount: number,
    amount_before_tax: number;
}

export interface IPaymentNotification {
    key: number,
    title: string,
    content: string
}

export class CompanyInfoDto {

    @ApiProperty()
    @IsOptional()
    logo: string = undefined;

    @ApiProperty()
    industry: string = undefined;

    @ApiProperty()
    agency_size?: string = undefined;

    @ApiProperty()
    @IsOptional()
    background_image: string = undefined;

    @ApiProperty()
    font_color: string = undefined;

    @ApiProperty()
    link_color: string = undefined;

    @ApiProperty()
    button_color: string = undefined;

}

export class SubscriptionInfoDto {

    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Type(() => PackageInfoDto)
    @Expose()
    package_id: PackageInfoDto;

    @ApiProperty()
    @Expose()
    agency_id: string;

    @ApiProperty()
    @Expose()
    price: number;

    @ApiProperty()
    @Expose()
    price_before_tax: number;

    @ApiProperty()
    @Expose()
    subscription_date: string;

    @ApiProperty()
    @Expose()
    expire_date: string;

    @ApiProperty()
    @Expose()
    expire_trial_date: string;

    @ApiProperty()
    @Expose()
    payment_success: boolean;

    @ApiProperty()
    @Expose()
    billing_type: number;

    @ApiProperty()
    @Expose()
    next_payment_date: string;
}

export class PaymentInfoDto {
    @ApiProperty()
    @Expose()
    token: string;

    @ApiProperty()
    @Expose()
    scheme: string;

    @ApiProperty()
    @Expose()
    display_number: string;

    @ApiProperty()
    @Expose()
    issuing_country: string;

    @ApiProperty()
    @Expose()
    expiry_month: number;

    @ApiProperty()
    @Expose()
    expiry_year: number;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    address_line1: string;

    @ApiProperty()
    address_line2: string;

    @ApiProperty()
    @Expose()
    address_city: string;

    @ApiProperty()
    address_postcode: string;

    @ApiProperty()
    address_state: string;

    @ApiProperty()
    @Expose()
    ip_address: string;

    @ApiProperty()
    @Expose()
    address_country: string;

    @ApiProperty()
    @Expose()
    customer_token: string;

    @ApiProperty()
    @Expose()
    primary: string;

    @ApiProperty()
    @Expose()
    customer_email: string;

    @ApiProperty()
    verify_date: Date;
}
export class CreatedBy {
    @ApiProperty()
    @Expose()
    id: string

    @ApiProperty()
    @Expose()
    first_name: string

    @ApiProperty()
    @Expose()
    last_name: string

    @ApiProperty()
    @Expose()
    job_title: string

    @ApiProperty()
    @Expose()
    phone_number: string

    @ApiProperty()
    @Expose()
    country_code?: string

    @ApiProperty()
    @Expose()
    email: string

    @ApiProperty()
    @Expose()
    is_verify?: boolean

    @ApiProperty()
    @Expose()
    is_deleted?: boolean

    @ApiProperty()
    @Expose()
    is_active?: boolean

    @ApiProperty()
    @Expose()
    open_job?: number;

    @ApiProperty()
    @Expose()
    close_job?: number;
}
export class AgencyInfoDto {

    @ApiProperty()
    @Expose()
    id: string = undefined;

    @ApiProperty()
    @Expose()
    signed_logo_url: string;

    @ApiProperty()
    @Expose()
    signed_background_url: string;

    @ApiProperty()
    @Expose()
    agency_name: string = undefined;

    @ApiProperty()
    @Expose()
    country_code: string = undefined;

    @ApiProperty()
    @Expose()
    recruiter_count: number = undefined;

    @ApiProperty()
    @Expose()
    status: number = undefined;

    @ApiProperty()
    @Expose()
    owner_id: string = undefined

    @ApiProperty()
    @Expose()
    is_send_welcome = false

    @ApiProperty()
    @Type(() => SubscriptionInfoDto)
    @Expose()
    subscription_plan: SubscriptionInfoDto

    @ApiProperty()
    subscription_plan_name: string

    @ApiProperty()
    subscription_price: number

    @ApiProperty()
    end_trial_date: Date

    @ApiProperty()
    max_recruiter: number;
    @ApiProperty()
    max_cv_parsing: number;
    @ApiProperty()
    max_assessment_limit: number;

    @ApiProperty()
    @Type(() => PaymentInfoDto)
    @Expose()
    payment_info: PaymentInfoDto;

    @ApiProperty()
    @Type(() => CompanyInfoDto)
    @Expose()
    company_info: CompanyInfoDto;

    @ApiProperty()
    @Type(() => CreatedBy)
    @Expose()
    created_by: CreatedBy;

    @ApiProperty()
    @Expose()
    created_at: Date;
}


export class CompanyFile {
    fileId: string;
    type: string;
}

export class UpdateAgencyInfoDto {
    @ApiProperty()
    @IsMongoId()
    @Type(() => String)
    id: string = undefined;

    @ApiProperty()
    @IsMongoId()
    @IsOptional()
    @Type(() => DBObjectID)
    owner_id: DBObjectID = undefined;

    @ApiProperty()
    @IsOptional()
    agency_name: string = undefined;

    @Type(() => CompanyInfoDto)
    @ApiProperty({ type: CompanyInfoDto })
    company_info: CompanyInfoDto = new CompanyInfoDto();

    @ApiProperty()
    @IsOptional()
    country_code: string = undefined;

}

export class UpdateAgencySubscriptionDto {
    @IsNotEmpty()
    @ApiProperty()
    package_id: string;

    @IsNotEmpty()
    @ApiProperty()
    agency_id: string;

    @ApiProperty()
    @IsNotEmpty()
    billing_type: number;
}

export class SetSubscriptionDto {
    @IsNotEmpty()
    @ApiProperty()
    package_id: string;

    @ApiProperty()
    @IsNotEmpty()
    billing_type: number;

    @ApiProperty()
    @IsNotEmpty()
    price: number;

    @ApiProperty()
    @IsNotEmpty()
    price_before_tax: number;

    @ApiProperty()
    @IsOptional()
    agency_size: string;

    @ApiProperty()
    @IsOptional()
    upgrade_price: number;

    @ApiProperty()
    @IsOptional()
    chargesInfo: IChargesUpgradePlan
}

export class CreateCardDto {

    @IsNotEmpty()
    @ApiProperty()
    @Expose()
    number: string;

    @IsNotEmpty()
    @ApiProperty()
    @Expose()
    expiry_month: number;

    @IsNotEmpty()
    @ApiProperty()
    @Expose()
    expiry_year: number;

    @IsNotEmpty()
    @ApiProperty()
    @Expose()
    name: string;


    @IsNotEmpty()
    @ApiProperty()
    @Expose()
    cvc: string;


    @IsNotEmpty()
    @ApiProperty()
    @Expose()
    address_line1: string;

    @ApiProperty()
    address_line2: string;

    @IsNotEmpty()
    @ApiProperty()
    @Expose()
    address_city: string;

    @ApiProperty()
    address_postcode: string;

    @ApiProperty()
    address_state: string;

    @IsNotEmpty()
    @ApiProperty()
    @Expose()
    address_country: string;
}

export class AgencySubscriptionDto {
    @IsNotEmpty()
    @Type(() => PackageInfoDto)
    @ApiProperty({ type: PackageInfoDto })
    package: PackageInfoDto;

    @IsNotEmpty()
    @ApiProperty()
    agency_id: string = undefined;

    @ApiProperty()
    @IsNotEmpty()
    billing_type: number = undefined;

    @ApiProperty()
    @IsNotEmpty()
    next_payment_date: Date = undefined;

    @ApiProperty()
    @IsNotEmpty()
    agency_created_date: Date = undefined;

    @ApiProperty()
    @IsNotEmpty()
    payment_amount: number = undefined;
}

export class PaymentHistoryDto {
    @IsNotEmpty()
    @Type(() => PackageInfoDto)
    @ApiProperty({ type: PackageInfoDto })
    package: PackageInfoDto = new PackageInfoDto();

    @IsNotEmpty()
    @ApiProperty()
    agency_id: string = undefined;

    @ApiProperty()
    @IsNotEmpty()
    payment_date: Date = undefined;

    @ApiProperty()
    @IsNotEmpty()
    amount: number;

    @ApiProperty()
    status: number;
}

export class CreatePaymentHistoryDto {
    @ApiProperty()
    @Expose()
    package_id: string;

    @ApiProperty()
    @Expose()
    agency_id: string;

    @ApiProperty()
    @Expose()
    email: string;

    @ApiProperty()
    @Expose()
    token: string;

    @ApiProperty()
    payment_date: Date;

    @ApiProperty()
    @Expose()
    amount: number;

    @ApiProperty()
    @Expose()
    currency: string;

    @ApiProperty()
    @Expose()
    description: string;

    @ApiProperty()
    @Expose()
    transfer: []

    @ApiProperty()
    @Expose()
    amount_refunded: number;

    @ApiProperty()
    @Expose()
    total_fees: number;

    @ApiProperty()
    @Expose()
    merchant_entitlement: number;

    @ApiProperty()
    @Expose()
    refund_pending: boolean;

    @ApiProperty()
    @Expose()
    authorisation_expired: boolean;

    @ApiProperty()
    @Expose()
    captured: boolean;

    @ApiProperty()
    @Expose()
    captured_at: Date;

    @ApiProperty()
    @Expose()
    settlement_currency: string;

    @ApiProperty()
    @Expose()
    active_chargebacks: boolean;

    @ApiProperty()
    @Expose()
    metadata: any;

    @ApiProperty()
    @Expose()
    status: number;
}
export class AgencyFilterParamDto extends PaginationDto {
    public buildFilterQuery(): FilterQuery<Agency> {
        const query: FilterQuery<Agency> = {}
        query.is_deleted = { $ne: true }
        if (this.agency_id) query._id = new DBObjectID(this.agency_id)
        if (this.keyword && this.keyword.trim().length > 0) {
            query.$text = {
                $search: `"${this.keyword}"`
            }
        }
        return query
    }
    @ApiProperty()
    @IsOptional()
    agency_id: string;
}

export class OutAgencyListingDto extends PaginationDto {
    @Type(() => AgencyInfoDto)
    @IsArray()
    @ApiProperty({ type: [AgencyInfoDto] })
    list: AgencyInfoDto[];
}

export class PaymentHistoriesDto extends PaginationDto {
    @Type(() => PaymentHistoryDto)
    @ApiProperty({ type: [PaymentHistoryDto] })
    list: PaymentHistoryDto[]
}


export class RecruiterBasicInfoDto {
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(254)
    @ApiProperty()
    email: string = undefined;

    @MaxLength(300)
    @ApiProperty()
    @IsNotEmpty()
    first_name: string = undefined;

    @MaxLength(300)
    @ApiProperty()
    @IsNotEmpty()
    last_name: string = undefined;

    @MaxLength(300)
    @IsNotEmpty()
    @ApiProperty()
    job_title: string = undefined;

    @MaxLength(300)
    @ApiProperty()
    @IsNotEmpty()
    phone_number: string = undefined;

    @MaxLength(300)
    @ApiProperty()
    @IsOptional()
    country_code?: string = undefined;
}

export class UserInvitedDto extends RecruiterBasicInfoDto {
    @ApiProperty({ enum: ['ok', 'existed_user', 'internal_server_error'] })
    invite_result_code = 'ok';

    @ApiProperty()
    id: string;
}
export class InviteRecruiterDto {
    @Type(() => UserInvitedDto)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [UserInvitedDto] })
    recruiter_list: [UserInvitedDto]
}

export class UpdateSupscriptionPlanResponseDto {
    @ApiProperty()
    @Expose()
    @IsOptional()
    isShowConfirmPayment: boolean;

    @ApiProperty()
    @IsOptional()
    @Expose()
    paymentInfo: any;
}

export class ReminderMailDto {
    @ApiProperty()
    @Expose()
    email: string;

    @ApiProperty()
    @Expose()
    agency_name: string;

    @ApiProperty()
    @Expose()
    package_name: string;

    @ApiProperty()
    @Expose()
    price: number;

    @ApiProperty()
    @Expose()
    created_by: string;
}

export class PaymentHistoryFilterParamDto extends PaginationDto {

    @ApiProperty()
    agency_id: string;

    public buildFilterQuery(): FilterQuery<PaymentHistory> {
        const query: FilterQuery<PaymentHistory> = {}
        if (this.agency_id) query.agency_id = new ObjectId(this.agency_id)
        return query
    }
}

export interface IPinpaymentCharges {
    amount: number,
    description: string,
    customer_token: string,
    email: string
}

export class CountSubscriptionDto {
    @ApiProperty()
    @Expose()
    packageId: string;

    @Expose()
    @ApiProperty()
    count: number;
}
