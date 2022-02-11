
import { Body, Controller, Response, Get, Delete, HttpCode, HttpStatus, Param, Post, UseGuards, Res, Query } from '@nestjs/common'
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'

import { User } from '../shared/decorators/user.decorator'
import { BaseResponse } from '../shared/base.dto'
import { GetOperationId } from '../shared/utils/get-operation-id'
import { OutListRecruiterDto, RecruiteFilterParam, RecruiterDto } from './dto/recruiter'
import { JwtPayload, UserBasicInfoDto, EditEmailDto } from '../auth/dto/login'
import { JWTAuthGuard, JwtPermissionGuard } from '../auth/guards/auth.guard'
import { RecruiterService } from './recruiter.service'
import { TokenType } from '../schemas/token.schema'
import { TokenService } from '../token/token.service'
import { MailService } from '../mail/mail.service'
import { UsersService } from '../user/user.service'
import { plainToClass } from 'class-transformer'
import { UserInvitedDto } from 'src/agency/dto/agency'
import { AgencyService } from 'src/agency/agency.service'

@ApiTags('recruiter')
@Controller('recruiter')
@UseGuards(JWTAuthGuard)
export class RecruiterController {
    constructor(
        private readonly recruiterService: RecruiterService,
        private readonly tokenService: TokenService,
        private readonly userService: UsersService,
        private readonly mailService: MailService,
        private readonly agencyService: AgencyService
    ) { }
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtPermissionGuard(['admin']))
    @Get('recruiter_list')
    @ApiResponse({
        status: HttpStatus.OK,
        type: OutListRecruiterDto,
        description: 'API to get recruiter list',
    })
    @ApiOperation(
        GetOperationId(
            'admin',
            'recruiter_list',
            'API to get recruiter list',
        ),
    )
    async recruiter_list(
        @Res() res,
        @User() payload,
        @Query() _recruiteFilterParam: RecruiteFilterParam,
    ): Promise<BaseResponse<OutListRecruiterDto>> {

        const list = await this.recruiterService.paginateList(
            _recruiteFilterParam,
        )
        const response: BaseResponse<OutListRecruiterDto> = { success: true }
        response.data = list
        return res.status(HttpStatus.OK).json(response)
    }
    ///////////////////////////////////////
    @HttpCode(HttpStatus.OK)
    @Get(':recruiter_id/info')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: String,
        description: 'API to get recruiter detail'
    })
    @ApiOperation(GetOperationId('recruiter', 'detail', 'API to get recruiter detail'))
    async getrecruiter(@Response() res, @User() payload: JwtPayload, @Param('recruiter_id') recruiterId: string, @Query('populate_statistic') populate_statistic?: boolean): Promise<BaseResponse<RecruiterDto>> {
        const response: BaseResponse<RecruiterDto> = { success: true }

        const user = await this.recruiterService.getRecruiterInfo(payload, recruiterId, populate_statistic)

        response.data = user
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Delete(':recruiterId')
    @UseGuards(JwtPermissionGuard('agency'))
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: String,
        description: 'API to delete recruiter'
    })
    @ApiOperation(GetOperationId('recruiter', 'delete', 'API to delete recruiter'))
    async delete(@Response() res, @Param('recruiterId') recruiterId: string, @User() payload: JwtPayload): Promise<BaseResponse<any>> {
        const response: BaseResponse<any> = { success: true }
        const deleteduser = await this.recruiterService.deleteRecruiter(payload.agency_id, recruiterId)
        response.success = deleteduser != null
        response.data = deleteduser
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Post(':recruiterId/deactive')
    @UseGuards(JwtPermissionGuard('agency'))
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: String,
        description: 'API to deactivate recruiter'
    })
    @ApiOperation(GetOperationId('recruiter', 'deactivate', 'API to deactive recruiter'))
    async deactivate(@Response() res, @Param('recruiterId') recruiterId: string, @User() payload: JwtPayload): Promise<BaseResponse<any>> {
        const response: BaseResponse<any> = { success: true }

        const deactiveUser = await this.recruiterService.deactivateRecruiter(payload.agency_id, recruiterId)
        response.success = deactiveUser != null
        response.data = deactiveUser

        return res.status(HttpStatus.OK).json(response)
    }


    @HttpCode(HttpStatus.OK)
    @Post(':recruiterId/resendVerify')
    @UseGuards(JwtPermissionGuard('agency'))
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to resend the verification code for recruiter'
    })
    @ApiOperation(GetOperationId('recruiter', 'resendVerify', 'API to resend the verification code for recruiter'))
    async resendVerify(@Response() res, @User() payload: JwtPayload, @Param('recruiterId') recruiterId: string): Promise<BaseResponse<boolean>> {
        const user = await this.recruiterService.getRecruiterInfo(payload, recruiterId)
        console.log('user', user)
        if (!user) {
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'user_not_found',
            })
        }

        const token = await this.tokenService.CreateToken(user.email, undefined, TokenType.VerifyRecruiter)
        const uDto = plainToClass(UserInvitedDto, { ...user })
        this.mailService.SendVerifyRecruiter(uDto, token, payload.agency_name, payload.first_name)
        const response: BaseResponse<boolean> = {
            data: true
        }
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtPermissionGuard('agency'))
    @Post(':recruiter_id/edit')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to edit recruiter'
    })
    @ApiOperation(GetOperationId('recruiter', 'edit', 'API to edit recruiter'))
    async edit(@Response() res, @Param('recruiter_id') recruiterId: string, @User() payload: JwtPayload, @Body() editUserDto: UserBasicInfoDto): Promise<BaseResponse<boolean>> {
        const updatedUser = await this.recruiterService.updateInfo(payload.agency_id, recruiterId, editUserDto)

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
    @Post(':recruiter_id/requestChangeEmail')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to send request change email to agency'
    })
    @ApiOperation(GetOperationId('recruiter', 'request change email', 'API to send request change email to agency'))
    async requestChangeEmail(@Response() res, @Param('recruiter_id') recruiterId: string, @User() payload: JwtPayload, @Body() editEmailDto: EditEmailDto): Promise<BaseResponse<boolean>> {
        const agency = await this.agencyService.getAgencyDetail(payload.agency_id)
        if (!agency) {
            res.status(HttpStatus.NOT_FOUND).json({
                message: 'agency_not_found',
            })
        }
        const response: BaseResponse<boolean> = {
            success: true
        }
        const user = await this.userService.findByEmail(editEmailDto.newEmail)
        if (user && user.id.toString() != payload.id.toString()) {
            response.success = false
            response.error = {
                message: 'EMAIL_ALREADY_EXIST'
            }
            return res.status(HttpStatus.NOT_ACCEPTABLE).json(response)
        }
        const token = await this.tokenService.CreateToken(payload.email, undefined, TokenType.VerifyRecruiter)
        await this.mailService.SendRequestChangeEmail(payload.id, payload.email, editEmailDto.newEmail, token, agency.agency_name, agency.created_by.email)
        
        return res.status(HttpStatus.OK).json(response)
    }
}