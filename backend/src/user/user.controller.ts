import { Controller, Response, Get, Post, Body, UseGuards, HttpCode, HttpStatus, Query, Param, UseInterceptors, UploadedFile, HttpException } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JWTAuthGuard, JwtPermissionGuard } from '../auth/guards/auth.guard'
import { BaseResponse, FileInput } from '../shared/base.dto'
import { User } from '../shared/decorators/user.decorator'
import { GetOperationId } from '../shared/utils/get-operation-id'
import { JwtPayload, UserBasicInfoDto } from '../auth/dto/login'
import {
    UserNotificationSettingsDto,
    UserNotificationSettingDto,
    CSVSetting,
    InfoChargesRecruiter,
} from './dto/settings'
import { UsersService } from './user.service'
import {
    InviteRecruiterDto,
    RecruiterBasicInfoDto,
    UserInvitedDto,
} from '../agency/dto/agency'

import { TokenService } from '../token/token.service'
import { TokenType } from '../schemas/token.schema'
import { MailService } from '../mail/mail.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { AgencyService } from 'src/agency/agency.service'

import * as _ from 'lodash'

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(
        private readonly usersService: UsersService,
        private readonly agencyService: AgencyService,
        private readonly tokenService: TokenService,
        private readonly mailService: MailService) {

    }
    @HttpCode(HttpStatus.OK)
    @Post('updateProfile')
    @UseGuards(JWTAuthGuard)
    @ApiOperation(GetOperationId('user', 'update_info', 'API to change user profile'))
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to change user profile'
    })
    async update_info(@Response() res, @User() payload: JwtPayload, @Body() changeInfoDto: UserBasicInfoDto): Promise<BaseResponse<boolean>> {
        if (payload.role == 'recruiter')
            changeInfoDto.email = payload.email
        const updatedUser = await this.usersService.updateInfo(payload.id, changeInfoDto)
        if (!updatedUser) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'update_info_error',
                error: 'update_info_error'
            })
        }
        const response: BaseResponse<boolean> = {
            success: true
        }
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Post('deactivateAccount')
    @UseGuards(JWTAuthGuard)
    @ApiOperation(GetOperationId('user', 'deactivate_account', 'API to deactivate current user account'))
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to deactivate current user account'
    })
    // eslint-disable-next-line no-unused-vars
    async deactivateAccount(@User() payload): Promise<BaseResponse<boolean>> {
        //const token = await this.tokenService.create(req.user);
        // const status = '200'
        // const message = 'OK'

        const response: BaseResponse<boolean> = {
            success: true
        }
        return response
        //return plainToClass(OutBasicDto, { status, message });
    }

    @HttpCode(HttpStatus.OK)
    @Get('get_notification_setting')
    @UseGuards(JWTAuthGuard)
    @ApiOperation(GetOperationId('user', 'get_notification_setting', 'API to get current user notification setting'))
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserNotificationSettingDto,
        isArray: true,
        description: 'API to get current user notification setting'
    })
    async get_notification_setting(@User() payload): Promise<BaseResponse<Array<UserNotificationSettingDto>>> {
        //const token = await this.tokenService.create(req.user);
        const notificationSettings = payload.notification_settings || []
        // const status = '200'
        // const message = 'OK'
        const response: BaseResponse<Array<UserNotificationSettingDto>> = {
            success: true,
            data: notificationSettings
        }
        return response
        //return plainToClass(OutBasicDto, { status, message });
    }

    @HttpCode(HttpStatus.OK)
    @Post('change_notification_setting')
    @UseGuards(JWTAuthGuard)
    @ApiOperation(GetOperationId('user', 'change_notification_setting', 'API to change current user notification setting'))
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserNotificationSettingsDto,
        description: 'API to change current user notification setting'
    })
    async change_notification_setting(@User() payload, @Body() body: Array<UserNotificationSettingDto>): Promise<BaseResponse<Array<UserNotificationSettingDto>>> {
        //const token = await this.tokenService.create(req.user);
        const userId = payload.id
        const userWithNewNotificationSetting = await this.usersService.updateNotificationSetting(userId, body)
        const response: BaseResponse<UserNotificationSettingDto[]> = {
            success: true,
            data: userWithNewNotificationSetting.notification_settings,
        }
        return response
    }

    // @HttpCode(HttpStatus.OK)
    // @Get('user_notification_list')
    // @UseGuards(JWTAuthGuard)
    // @ApiOperation(GetOperationId('user', 'user_notification_list', 'API to get current user notification list'))
    // @ApiResponse({
    //     status: HttpStatus.OK,
    //     type: UserNotificationsDto,
    //     description: 'API to get current user notification list'
    // })
    // async get_user_notification_list(@User() payload, @Query() notificationFilterParams: NotificationFilterParamDto): Promise<BaseResponse<UserNotificationsDto>> {
    //     //const token = await this.tokenService.create(req.user);
    //     const status = '200'
    //     const message = 'OK'
    //     const response: BaseResponse<UserNotificationsDto> = {
    //         success: true
    //     }
    //     return response
    //     //return plainToClass(OutBasicDto, { status, message });
    // }

    // @HttpCode(HttpStatus.OK)
    // @Post('set_noti_status')
    // @UseGuards(JWTAuthGuard)
    // @ApiOperation(GetOperationId('user', 'set_noti_status', 'API to set current notification status for current user'))
    // @ApiResponse({
    //     status: HttpStatus.OK,
    //     type: UserNotification,
    //     description: 'API to set current notification status for current user'
    // })
    // async set_noti_status(@User() payload, @Body() _userNotificationsDto: [UserNotification]): Promise<BaseResponse<[UserNotification]>> {
    //     //const token = await this.tokenService.create(req.user);
    //     const status = '200'
    //     const message = 'OK'
    //     const response: BaseResponse<[UserNotification]> = {
    //         success: true
    //     }
    //     return response
    //     //return plainToClass(OutBasicDto, { status, message });
    // }

    @HttpCode(HttpStatus.OK)
    @Get('is_existing_email')
    @UseGuards(JwtPermissionGuard('agency'))
    @ApiOperation(GetOperationId('user', 'is_existing_email', 'API to check if email exist'))
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to check if email exist'
    })
    async is_existing_email(@User() payload, @Query('email') email): Promise<BaseResponse<boolean>> {
        const u = await this.usersService.findByEmail(email)
        const response: BaseResponse<boolean> = {
            success: true
        }
        if (u) {
            response.data = true
        } else {
            response.data = false
        }
        return response
    }


    @Post(':agency_id/import_recruiter')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        type: 'multipart/form-data',
        required: true,
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    })
    @ApiOperation(GetOperationId('user', 'import_recruiter', 'API to Import list of recruiter'))
    @UseGuards(JwtPermissionGuard('agency'))
    @UseInterceptors(FileInterceptor('file'))
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: [RecruiterBasicInfoDto],
        description: 'API to Import list of recruiter'
    })
    async ImportRecruiter(@Response() res, @Param('agency_id') agencyId: string, @UploadedFile() file: FileInput, @User() payload: JwtPayload, @Body() separator: CSVSetting): Promise<BaseResponse<Array<RecruiterBasicInfoDto>>> {
        const response: BaseResponse<Array<RecruiterBasicInfoDto>> = { success: true }
        try {
            const agency = await this.agencyService.getAgencyDetail(agencyId)
            if (payload.agency_id != agencyId || !agency) {
                response.success = false
                return res.status(HttpStatus.FORBIDDEN).json(response)
            }
            if (!file) throw new HttpException('BAD_REQUEST', 400)
            const recruiter_list = await this.usersService.parseImportRecruiterCSV(file, separator as CSVSetting)
            const recruiter_invited_list: Array<UserInvitedDto> = []
            const totalRecruiter = agency.recruiter_count + recruiter_list.length
            if (!agency?.subscription_plan) {
                response.success = false
                response.error = { message: 'subscription_not_found' }
                return res.status(HttpStatus.OK).json(response)
            }
            if (agency?.subscription_plan?.payment_success === false) {
                response.success = false
                response.error = { message: 'subscription_not_payment' }
                return res.status(HttpStatus.OK).json(response)
            }
            if (agency.max_recruiter < totalRecruiter) {
                response.success = false
                response.error = { message: 'max_recruiter_error' }
                return res.status(HttpStatus.OK).json(response)
            }
            /** Check the invite recruiter need charges */
            const infoRecruiterCharges = await this.agencyService.getNotificationInviteRecruiterNeedCharges(
                payload.agency_id, recruiter_list.length
            )
            if (infoRecruiterCharges) {
                response.success = false
                response.error = { payload: infoRecruiterCharges, message: 'error_recruiter_need_charges' }
                return res.status(HttpStatus.OK).json(response)
            }
            let canInvite = true
            for await (const r of recruiter_list) {
                const signUpDto = await this.usersService.registerRecruiter(r, payload, true)
                if (signUpDto?.invite_result_code === 'existed_user') {
                    canInvite = false
                }
                recruiter_invited_list.push(signUpDto)
            }
            response.data = recruiter_invited_list
            if (canInvite) {
                const promises = recruiter_list.map(async u => {
                    const signUpDto = await this.usersService.registerRecruiter(u, payload, false)
                    if (signUpDto.invite_result_code == 'ok') {
                        const token = await this.tokenService.CreateToken(signUpDto.email, undefined, TokenType.VerifyRecruiter)
                        await this.mailService.SendVerifyRecruiter(signUpDto, token, agency.agency_name, payload.first_name, signUpDto.id)
                    }
                    return signUpDto
                })
                response.data = await Promise.all(promises)
            }
             /** In trial, After invite recruiter success then update agency size and price subscription */
             const inviteSuccess = recruiter_list.map(u => u.invite_result_code === 'ok')
             const currentSize = agency.recruiter_count + inviteSuccess.length
             if(
                 agency?.subscription_plan?.expire_trial_date && currentSize > +agency?.company_info?.agency_size){
                 await this.agencyService.updateAgencySize(agencyId, currentSize.toString(), true)
             }
        } catch (error) {
            response.success = false
            response.error = error
            console.log(error)
        }
        return res.status(HttpStatus.CREATED).json(response)
    }


    @HttpCode(HttpStatus.OK)
    @Post(':agencyId/invite_recruiter')
    @UseGuards(JwtPermissionGuard('agency'))
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: [UserInvitedDto],
        description: 'API to add list of recruiter from agency'
    })
    @ApiOperation(GetOperationId('recruiter', 'list', 'API to add list of recruiter from agency'))
    async invite_recruiter(@Response() res, @Param('agencyId') agencyId: string, @User() payload: JwtPayload, @Body() _inviteRecruiterDto: InviteRecruiterDto): Promise<BaseResponse<Array<UserInvitedDto>>> {
        const response: BaseResponse<Array<UserInvitedDto>> = { success: true }
        try {
            if (payload.agency_id != agencyId) {
                response.success = false
                return res.status(HttpStatus.FORBIDDEN).json(response)
            }
            const agency = await this.agencyService.getAgencyDetail(agencyId)
            const recruiter_list: Array<UserInvitedDto> = []
            const totalRecruiter = agency.recruiter_count + _inviteRecruiterDto.recruiter_list.length
            if (!agency?.subscription_plan) {
                response.success = false
                response.error = { message: 'subscription_not_found' }
                return res.status(HttpStatus.OK).json(response)
            }
            if (agency?.subscription_plan?.payment_success === false) {
                response.success = false
                response.error = { message: 'subscription_not_payment' }
                return res.status(HttpStatus.OK).json(response)
            }
            if (agency.max_recruiter < totalRecruiter) {
                response.success = false
                response.error = { message: 'max_recruiter_error' }
                return res.status(HttpStatus.OK).json(response)
            }
            /** Check the invite recruiter need charges */
            const infoRecruiterCharges = await this.agencyService.getNotificationInviteRecruiterNeedCharges(
                payload.agency_id, _inviteRecruiterDto.recruiter_list.length
            )
            if (infoRecruiterCharges) {
                response.success = false
                response.error = { payload: infoRecruiterCharges, message: 'error_recruiter_need_charges' }
                return res.status(HttpStatus.OK).json(response)
            }
            let canInvite = true
            for await (const u of _inviteRecruiterDto.recruiter_list) {
                const signUpDto = await this.usersService.registerRecruiter(u, payload, true)
                if (signUpDto?.invite_result_code === 'existed_user') {
                    canInvite = false
                }
                recruiter_list.push(signUpDto)
            }
            response.data = recruiter_list
            if (canInvite) {
                const promises = recruiter_list.map(async u => {
                    const signUpDto = await this.usersService.registerRecruiter(u, payload, false)
                    if (signUpDto.invite_result_code == 'ok') {
                        const token = await this.tokenService.CreateToken(signUpDto.email, undefined, TokenType.VerifyRecruiter)
                        await this.mailService.SendVerifyRecruiter(signUpDto, token, agency.agency_name, payload.first_name, signUpDto.id)
                    }
                    return signUpDto
                })
                response.data = await Promise.all(promises)
            }
            /** In trial, After invite recruiter success then update agency size and price subscription */
            const inviteSuccess = recruiter_list.map(u => u.invite_result_code === 'ok')
            const currentSize = agency.recruiter_count + inviteSuccess.length
            if(
                agency?.subscription_plan?.expire_trial_date && currentSize > +agency?.company_info?.agency_size){
                await this.agencyService.updateAgencySize(agencyId, currentSize.toString(), true)
            }
        } catch (error) {
            response.success = false
            response.error = error
        }
        return res.status(HttpStatus.CREATED).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Post(':agencyId/charges_invite_recruiter')
    @UseGuards(JwtPermissionGuard('agency'))
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API payment invite recruiter charges'
    })
    @ApiOperation(
        GetOperationId(
            'paymen',
            'charges_invite_recruiter',
            'API payment invite recruiter charges'
        )
    )
    async chargesInviteRecruiter(
        @Response() res,
        @Param('agencyId') agencyId: string,
        @User() payload: JwtPayload,
        @Body() _chargesInfo: InfoChargesRecruiter
    ): Promise<BaseResponse<boolean>> {
        const response: BaseResponse<boolean> = { success: true }
        try {
            if (payload.agency_id != agencyId) {
                response.success = false
                return res.status(HttpStatus.FORBIDDEN).json(response)
            }
            const result = await this.usersService.paymentChargesInviteRecruiter(
                _chargesInfo,
                payload.agency_id
            )
            response.data = result
        } catch (error) {
            response.success = false
            response.error = error
        }
        return res.status(HttpStatus.OK).json(response)
    }
}
