import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
    Logger,
    Header,
    Res,
    Response,
    Put,
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import {
    ApiTags,
    ApiResponse,
    ApiConsumes,
    ApiBody,
    ApiOperation,
    ApiBearerAuth,
} from '@nestjs/swagger'

import { AgencyService } from './agency.service'
import { SubscriptionService } from './agency_subscription.service'
import { RecruiterService } from '../recruiter/recruiter.service'
import { PackageService } from 'src/package/package.service'

import { User } from '../shared/decorators/user.decorator'
import { JWTAuthGuard, JwtPermissionGuard } from '../auth/guards/auth.guard'
import { GetOperationId } from '../shared/utils/get-operation-id'

import { BaseResponse, FileInput } from '../shared/base.dto'
import {
    AgencyInfoDto,
    AgencySubscriptionDto,
    CompanyFile,
    CreateCardDto,
    PaymentHistoriesDto,
    PaymentHistoryFilterParamDto,
    SetSubscriptionDto,
    SubscriptionInfoDto,
    UpdateAgencyInfoDto,
    UpdateAgencySubscriptionDto
} from './dto/agency'
import {
    OutListRecruiterDto,
    RecruiteFilterParam,
} from '../recruiter/dto/recruiter'
import { JwtPayload } from '../auth/dto/login'
import {
    OutPackageListDto,
    PackageFilterParamDto,
} from 'src/package/dto/package.dto'
import { Agency, Subscription } from 'src/schemas/agency.schema'
import { MailService } from 'src/mail/mail.service'
import { PaymentHistoryService } from './payment-history.service'

@ApiTags('agency')
@Controller('agency')
export class AgencyController {
    constructor(
        private readonly recruiterService: RecruiterService,
        private readonly agencyService: AgencyService,
        private readonly packageService: PackageService,
        private readonly subService: SubscriptionService,
        private readonly paymentService: PaymentHistoryService,
        private readonly mailService: MailService
    ) { }
    private readonly logger = new Logger(AgencyController.name);

    @Post('updateAgencyInfo')
    @ApiConsumes('multipart/form-data')
    @ApiOperation(
        GetOperationId('agency', 'update_info', 'API to update agency info'),
    )
    @ApiBody({
        type: 'multipart/form-data',
        required: true,
        schema: {
            type: 'object',
            properties: {
                logo: {
                    type: 'file',
                    format: 'binary',
                },
                background: {
                    type: 'file',
                    format: 'binary',
                },
                agencyInfo: {
                    type: 'UpdateAgencyInfoDto',
                    format: 'json',
                },
            },
        },
    })
    @UseGuards(JWTAuthGuard)
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'logo', maxCount: 1 },
            { name: 'background', maxCount: 1 },
        ]),
    )
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: UpdateAgencyInfoDto,
        description: 'API to update agency info',
    })
    async updateAgencyInfo(
        @Response() res,
        @User() payload: JwtPayload,
        @UploadedFiles() files,
        @Body('agencyInfo') sAgencyInfo: string,
    ): Promise<BaseResponse<string>> {
        const logo: FileInput = files.logo ? files.logo[0] : undefined
        const background: FileInput = files.background
            ? files.background[0]
            : undefined

        const response: BaseResponse<string> = {
            success: true,
        }
        const agencyInfo: UpdateAgencyInfoDto = JSON.parse(sAgencyInfo)

        if (payload.role !== 'admin' && payload.agency_id != agencyInfo.id) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: 'agency_not_found',
            })
        }
        try {
            this.agencyService.Update(agencyInfo, logo, background)
        } catch (error) {
            response.success = false
        }

        return res.status(HttpStatus.OK).json(response)
    }

    @Get(':agencyId/companyImage')
    @Header('content-type', 'image/jpeg')
    async getPhoto(
        @Param('agencyId') agencyId: string,
        @Query() fileInfo: CompanyFile,
        @Res() res,
    ) {
        const photoObject = await this.agencyService
            .getCompanyFile(agencyId, fileInfo.type, fileInfo.fileId)
            .on('error', (error) => {
                this.logger.error(
                    `unable to get file from ${agencyId}/${fileInfo.type}/${fileInfo.fileId}`,
                )
                this.logger.error(error)
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: 'file_not_found',
                })
            })
        photoObject.pipe(res)
    }

    //OK
    @HttpCode(HttpStatus.OK)
    @UseGuards(JWTAuthGuard)
    @Get(':agency_id/info')
    @ApiResponse({
        status: HttpStatus.OK,
        type: AgencyInfoDto,
        description: 'API to get agency detail',
    })
    @ApiOperation(
        GetOperationId('agency', 'detail', 'API to get agency detail'),
    )
    async getUserInfo(
        @Response() res,
        @Param('agency_id') agency_id: string,
        @User() payload: JwtPayload,
        @Query('show_statistic') show_statistic?: boolean
    ): Promise<BaseResponse<AgencyInfoDto>> {
        if (payload.role !== 'admin' && payload.agency_id != agency_id) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: 'agency_not_found',
            })
        }
        const agency = await this.agencyService.getAgencyDetail(agency_id, show_statistic)
        if (!agency) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'agency_not_found',
            })
        }
        const response: BaseResponse<AgencyInfoDto> = {
            success: true,
        }
        if (!agency.is_send_welcome && payload.role === 'agency') {
            await this.agencyService.sendWelcomeMail(agency_id, payload)
        }
        response.data = agency
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtPermissionGuard(['agency']))
    @Get(':agencyId/recruiter_list')
    @ApiResponse({
        status: HttpStatus.OK,
        type: OutListRecruiterDto,
        description: 'API to get recruiter list of agency',
    })
    @ApiOperation(
        GetOperationId(
            'agency',
            'recruiter_list',
            'API to get recruiter list of agency',
        ),
    )
    async recruiter_list(
        @Res() res,
        @Param('agencyId') agencyId: string,
        @User() payload,
        @Query() _recruiteFilterParam: RecruiteFilterParam,
    ): Promise<BaseResponse<OutListRecruiterDto>> {
        if (payload.role !== 'admin' && payload.agency_id != agencyId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: 'agency_not_found',
            })
        }
        _recruiteFilterParam.agency_id = agencyId
        const list = await this.recruiterService.paginateList(
            _recruiteFilterParam,
        )
        const response: BaseResponse<OutListRecruiterDto> = { success: true }
        response.data = list
        return res.status(HttpStatus.OK).json(response)
    }

    ///////////////////////////////////////////////////////////////////

    /** API GET LIST PACKAGE SUBSCRIPTION PLAN */
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtPermissionGuard(['agency']))
    @Get(':agencyId/plan')
    @ApiResponse({
        status: HttpStatus.OK,
        type: OutPackageListDto,
        description: 'API to get list package to select plan',
    })
    @ApiOperation(
        GetOperationId(
            'agency',
            'plan',
            'API to get package list to agency plan',
        ),
    )
    async package_list(
        @Res() res,
        @User() payload,
        @Param('agencyId') agencyId: string,
        @Query() _packageFilterParamDto: PackageFilterParamDto,
    ): Promise<BaseResponse<OutPackageListDto>> {
        const response: BaseResponse<OutPackageListDto> = { success: true }

        if (payload.role !== 'admin' && payload.agency_id != agencyId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: 'agency_not_found',
            })
        }

        try {
            const list = await this.packageService.paginatePackageList(
                _packageFilterParamDto,
            )
            response.data = list
        } catch (error) {
            response.success = false
            response.error = error
        }

        return res.status(HttpStatus.OK).json(response)
    }

    /** API PAYMENT CHARGES UPDATE PLAN API */
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtPermissionGuard(['agency']))
    @Post(':agencyId/payment-plan')
    @ApiResponse({
        status: HttpStatus.OK,
        type: Subscription,
        description: 'API to payment update/upgrade subscription plan',
    })
    @ApiOperation(
        GetOperationId(
            'agency',
            'update/upgrade',
            'API to update/upgrade subscription plan'
        ),
    )
    async paymentPlan(
        @Res() res,
        @User() payload,
        @Param('agencyId') agencyId: string,
        @Body() _setscriptionPlanDto,
    ): Promise<BaseResponse<Subscription>> {
        const response: BaseResponse<Subscription> = {
            success: true,
        }
        if (payload.role !== 'admin' && payload.agency_id != agencyId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: 'agency_not_found',
            })
        }
        try {
            const result = await this.subService.paymentUpdateSubscription(
                agencyId,
                _setscriptionPlanDto,
            )
            response.data = result
        } catch (error) {
            response.success = false
            response.error = error
        }
        return res.status(HttpStatus.OK).json(response)
    }

    /** API SET AGENCY SUBSCRIPTION PLAN API */
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtPermissionGuard(['agency']))
    @Post(':agencyId/plan')
    @ApiResponse({
        status: HttpStatus.OK,
        type: AgencyInfoDto,
        description: 'API to set subscription plan',
    })
    @ApiOperation(
        GetOperationId('agency', 'plan', 'API to set subscription plan'),
    )
    async setSubscriptionPlan(
        @Res() res,
        @User() payload: JwtPayload,
        @Param('agencyId') agencyId: string,
        @Body() _setscriptionPlanDto: SetSubscriptionDto,
    ): Promise<BaseResponse<Subscription>> {
        const response: BaseResponse<Subscription> = {
            success: true,
        }
        if (payload.role !== 'admin' && payload.agency_id != agencyId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: 'agency_not_found',
            })
        }
        try {
            const sub = await this.subService.getSubscription(agencyId)
            const agency = await this.agencyService.getAgencyDetail(agencyId)
            if (sub) {
                // if plan in trial date not check payment
                if (sub.expire_trial_date) {
                    const result = await this.subService.updateSubscription(
                        agencyId, _setscriptionPlanDto
                    )
                    response.data = result
                    return res.status(HttpStatus.OK).json(response)
                }else if(
                    _setscriptionPlanDto.agency_size > agency?.company_info?.agency_size && 
                    sub?.package_id?.id === _setscriptionPlanDto?.package_id
                ){
                    
                    const differentSize = +_setscriptionPlanDto.agency_size - +agency?.company_info?.agency_size
                    const infoSizeCharges = await this.agencyService.getNotificationInviteRecruiterNeedCharges(agencyId, 0, differentSize)
                    response.success = false
                    response.error = { message: 'CHANGE_AGENCY_SIZE', payload: infoSizeCharges }
                    return res.status(HttpStatus.OK).json(response)
                }else{
                    const upgrade = await this.subService.getChargesUpgradePlan(
                        agencyId, _setscriptionPlanDto
                    )
                    response.success = false
                    response.error = { message: 'CHANGE_PLAN', payload: upgrade }
                    return res.status(HttpStatus.OK).json(response)
                }
                
            }
            const result = await this.subService.createSubscription(
                agencyId,
                _setscriptionPlanDto,
            )
            response.data = result
        } catch (error) {
            response.success = false
            response.error = error
        }
        return res.status(HttpStatus.OK).json(response)
    }

    /** API GET AGENCY SUBSCRIPTION INFO */
    @HttpCode(HttpStatus.OK)
    @Get(':agencyId/subscriptionInfo')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: AgencySubscriptionDto,
        description: 'API to Get subscription Info of agency',
    })
    @ApiOperation(
        GetOperationId(
            'Agency',
            'subscription_info',
            'API to Get subscription Info of agency',
        ),
    )
    async getSubscriptionInfo(
        @Param('agencyId') agencyId: string,
        @User() payload,
        @Res() res,
    ): Promise<BaseResponse<SubscriptionInfoDto>> {
        const response: BaseResponse<SubscriptionInfoDto> = { success: true }

        if (payload.role !== 'admin' && payload.agency_id != agencyId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: 'agency_not_found',
            })
        }

        try {
            const subscription = await this.subService.getSubscription(agencyId)
            response.data = subscription
        } catch (error) {
            response.success = false
            response.error = error
        }

        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Get(':agencyId/paymentHistories')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: PaymentHistoriesDto,
        description: 'API to Get payment histories Info of agency',
    })
    @ApiOperation(
        GetOperationId(
            'Agency',
            'subscription_info',
            'API to Get payment histories Info of agency',
        ),
    )
    async getPaymentHistories(
        @Param('agencyId') agencyId: string,
        @User() payload: JwtPayload,
        @Res() res,
        @Query() _paymentFilterParamDto: PaymentHistoryFilterParamDto,
    ): Promise<BaseResponse<PaymentHistoriesDto>> {
        const response: BaseResponse<PaymentHistoriesDto> = { success: true }
        if (payload.role !== 'admin' && payload.agency_id != agencyId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: 'agency_not_found',
            })
        }
        try {
            _paymentFilterParamDto.agency_id = agencyId
            const paymentHistories = await this.paymentService.paginatePaymentHistoryList(
                _paymentFilterParamDto,
            )
            response.data = paymentHistories
        } catch (error) {
            response.success = false
            response.error = error
        }
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Delete(':agencyId/cancelCurrentPlan')
    @UseGuards(JwtPermissionGuard(['agency']))
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description:
            'API to cancel the current subscription of agency  (PENDING)',
    })
    @ApiOperation(
        GetOperationId(
            'Agency',
            'cancel_Current_Plan',
            'API to cancel the current subscription of agency',
        ),
    )
    async cancelCurrentPlan(
        @Res() res,
        @Param('agencyId') agencyId: string,
        @User() payload,
    ): Promise<BaseResponse<boolean>> {
        const response: BaseResponse<boolean> = { success: true }
        if (payload.role === 'admin' || payload.agency_id != agencyId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: 'agency_not_found',
            })
        }
        try {
            await this.subService.cancelSubscription(agencyId)
            response.data = true
        } catch (error) {
            response.success = false
            response.error = error
        }
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Post('updateSubscription')
    @UseGuards(JWTAuthGuard)
    @ApiResponse({
        status: HttpStatus.OK,
        type: String,
        description: 'API that update the agency subscription plan  (PENDING)',
    })
    @ApiOperation(
        GetOperationId(
            'agency',
            'update_Subscription',
            'API that update the agency subscription plan',
        ),
    )
    async updateSubscription(
        @User() payload: JwtPayload,
        @Body() updateAgencySubscriptionDto: UpdateAgencySubscriptionDto,
    ): Promise<BaseResponse<string>> {
        const response: BaseResponse<string> = {
            success: true,
        }
        this.logger.log(updateAgencySubscriptionDto)
        this.logger.log(payload)
        return response
    }

    @HttpCode(HttpStatus.OK)
    @Post(':agencyId/verifyCard')
    @UseGuards(JwtPermissionGuard(['agency']))
    @ApiResponse({
        status: HttpStatus.OK,
        type: String,
        description:
            'API to verify and save credit card to PIN, store the card token to db',
    })
    @ApiOperation(
        GetOperationId(
            'agency',
            'verify_Card',
            'API to verify and save credit card to PIN, store the card token to db',
        ),
    )
    async verifyCard(
        @Res() res,
        @User() payload,
        @Body() _paymentInfo: CreateCardDto,
        @Param('agencyId') agencyId: string
    ): Promise<BaseResponse<Agency>> {
        const response: BaseResponse<Agency> = {
            success: true,
        }
        if (payload.agency_id != agencyId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: 'agency_not_found',
            })
        }
        try {
            const agency = await this.agencyService.createAgencyPaymentInfo(
                payload,
                _paymentInfo,
            )
            response.data = agency
            if (!agency) response.success = false
        } catch (error) {
            response.success = false
            response.error = error
        }
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Put(':agencyId/updateCard')
    @UseGuards(JwtPermissionGuard(['agency']))
    @ApiResponse({
        status: HttpStatus.OK,
        type: Agency,
        description:
            'API to update and save credit card to PIN, store the card token to db',
    })
    @ApiOperation(
        GetOperationId(
            'agency',
            'update_Card',
            'API to update and save credit card to PIN, store the card token to db',
        ),
    )
    async updateCard(
        @Res() res,
        @User() payload,
        @Body() _paymentInfo: CreateCardDto,
        @Param('agencyId') agencyId: string
    ): Promise<BaseResponse<Agency>> {
        const response: BaseResponse<Agency> = {
            success: true,
        }
        if (payload.agency_id != agencyId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: 'agency_not_found',
            })
        }
        try {
            const agency = await this.agencyService.updateAgencyPaymentInfo(
                payload,
                _paymentInfo,
            )
            response.data = agency
            if (!agency) response.success = false
        } catch (error) {
            response.success = false
            response.error = error
        }
        return res.status(HttpStatus.OK).json(response)
    }
}
