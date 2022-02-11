
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Ip,
    Logger,
    Post,
    Response,
    UseGuards,
    HttpException
} from '@nestjs/common'

import { AuthService } from './auth.service'

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
//import { TokenService } from './token.service';
import {
    UserTokenDto,
    SignInDto,
    UserBasicInfoDto,
    ResendUserTokenDto,
    UserDto,
    LoginResponse,
    JwtPayload,
    RequestRefreshTokenDto
} from './dto/login'
import {
    ForgotPassDto,
    OutForgotPassDto,
    CheckTokenDto,
    ResetPassDto,
    ChangePassDto,
} from './dto/changePass'
import { BaseResponse } from '../shared/base.dto'
import { JWTAuthGuard } from './guards/auth.guard'
import { User as Payload } from '../shared/decorators/user.decorator'
import { GetOperationId } from '../shared/utils/get-operation-id'
import { UsersService } from '../user/user.service'
import { plainToClass } from 'class-transformer'
import { TokenService } from '../token/token.service'
import { TokenType } from '../schemas/token.schema'
import { MailService } from '../mail/mail.service'
import { MapperService } from '../shared/mapper/mapper.service'
import { User } from '../schemas/user.schema'
import { AgencyService } from 'src/agency/agency.service'
import { RedisCacheService } from 'src/redisCache/redisCache.service'
import { UserInvitedDto } from 'src/agency/dto/agency'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly tokenService: TokenService,
        private readonly agencyService: AgencyService,
        private readonly mailService: MailService,
        private readonly mapperService: MapperService,
        private readonly redisCacheService: RedisCacheService,
    ) {
        this.mapperService.createMap(User.name, UserDto)
        this.mapperService.createMap(User.name, UserInvitedDto.name)
    }
    private readonly logger = new Logger(AuthService.name);
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    //@UseGuards(AuthGuard('local'))
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserTokenDto,
        description:
            'API to check the user credential and return the login token',
    })
    @ApiOperation(
        GetOperationId(
            'auth',
            'signin',
            'API to check the user credential and return the login token',
        ),
    )
    async requestJsonWebTokenAfterSignIn(
        @Response() res,
        @Body() signInDto: SignInDto,
    ): Promise<BaseResponse<UserTokenDto>> {
        const user = await this.usersService.findByEmail(signInDto.email)
        if (!user) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'user_not_found',
            })
        } else {
            const response: BaseResponse<UserTokenDto> = {
                success: true,
            }
            //debug('start getting the token');
            const isValidPass = await this.authService.validateUser(
                signInDto.email,
                signInDto.password,
            )
            if (!isValidPass) {
                response.success = false
                response.error = {
                    message: 'invalid_email_or_pass',
                }
                return res.status(HttpStatus.UNAUTHORIZED).json(response)
            }
            if (user.is_active != true) {
                response.success = false
                response.error = {
                    message: 'user_deactivated',
                }
                return res.status(HttpStatus.UNAUTHORIZED).json(response)
            }
            let accessToken = {}

            if (user.role !== 'admin') {
                const agency = await this.agencyService.getAgencyDetail(user.agency_id.toString())
                accessToken = this.authService.createToken(user, agency)
            } else {
                accessToken = this.authService.createToken(user, undefined)
            }


            const refreshToken = await this.authService.createRefreshToken(user)
            const token = {
                ...accessToken,
                ...refreshToken
            }
            //this.logger.log(u);
            response.data = {
                token: plainToClass(LoginResponse, token),
                user: {
                    agency_id: user.agency_id ? user.agency_id.toString() : undefined,
                    role: user.role,
                    phone_number: user.phone_number,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    job_title: user.job_title,
                    country_code: user.country_code,
                    email: user.email,
                    id: user.id
                }
            }
            await this.redisCacheService.set(refreshToken.refreshToken, user.id, {
                ttl: refreshToken.refreshTokenExpiresIn,
            })
            return res.status(HttpStatus.OK).json(response)
        }
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(JWTAuthGuard)
    @Get('userInfo')
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserDto,
        description: 'API to get current user profile',
    })
    @ApiOperation(
        GetOperationId('auth', 'userInfo', 'API to get current user profile'),
    )
    async getUserInfo(
        @Response() res,
        @Payload() payload,
    ): Promise<BaseResponse<UserDto>> {
        const user = await this.authService.validateUserToken(payload)
        //const u = plainToClass(UserDto, classToPlain(user))
        if (!user) {
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'payload_invalid',
            })
        }
        const response: BaseResponse<UserDto> = {
            success: true,
        }
        //this.logger.log(u);
        response.data = this.mapperService.map<UserDto>(
            user,
            UserDto.name,
            User.name,
        )
        return res.status(HttpStatus.OK).json(response)
    }
    @HttpCode(HttpStatus.OK)
    @Post('refresh-token')
    async refreshToken(
        @Response() res,
        @Body() refToken: RequestRefreshTokenDto,
    ): Promise<BaseResponse<UserDto>> {
        const user_id = await this.redisCacheService.get(refToken.refreshToken)
        const user = await this.usersService.findById(user_id)
        if (user && user.is_active && !user.is_deleted) {
            const agency = await this.agencyService.getAgencyDetail(user.agency_id.toString())
            const accessToken = await this.authService.createToken(user, agency)
            const refreshToken = await this.authService.createRefreshToken(user)
            const token = {
                ...accessToken,
                ...refreshToken
            }
            const response: BaseResponse<UserTokenDto> = {
                success: true,
                data: {
                    token: plainToClass(LoginResponse, token),
                    user: {
                        agency_id: user.agency_id ? user.agency_id.toString() : undefined,
                        role: user.role,
                        phone_number: user.phone_number,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        job_title: user.job_title,
                        country_code: user.country_code,
                        email: user.email,
                        id: user.id
                    }
                }
            }
            await this.redisCacheService.set(refreshToken.refreshToken, user.id, {
                ttl: refreshToken.refreshTokenExpiresIn,
            })
            return res.status(HttpStatus.OK).json(response)
        }

        throw new HttpException('invalid_payload', HttpStatus.BAD_REQUEST)
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserTokenDto,
        description:
            'API that receives a POST with a user\'s username and password. Returns a JSON Web Token that can be used for authenticated requests.',
    })
    @ApiOperation(
        GetOperationId(
            'auth',
            'register',
            'API that receives a POST with a user\'s username and password. Returns a JSON Web Token that can be used for authenticated requests.',
        ),
    )
    async requestJsonWebTokenAfterSignUp(
        @Response() res,
        @Body() signUpDto: UserBasicInfoDto,
        @Ip() ip,
    ): Promise<BaseResponse<UserTokenDto>> {
        const result = await this.authService.registerAgency(signUpDto)
        if (!result.success) {
            return res.status(HttpStatus.BAD_REQUEST).json(result)
        }
        const token = await this.tokenService.CreateToken(signUpDto.email, ip, TokenType.VerifyAgency)
        await this.mailService.SendVerifyAgency(plainToClass(UserDto, { ...signUpDto }), token, result.user.id)
        const response: BaseResponse<UserTokenDto> = {
            success: true,
        }
        return res.status(HttpStatus.CREATED).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Post('resendVerify')
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to resend the verification code base on the token',
    })
    @ApiOperation(GetOperationId('auth', 'resendVerify', 'API to resend the verification code base on the token'))
    async resendVerify(@Response() res, @Body() userTokenDto: ResendUserTokenDto, @Ip() ip): Promise<BaseResponse<boolean>> {
        const user = await this.usersService.findByEmail(userTokenDto.email)
        if (!user) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'email_not_found',
                error: 'email_not_found'
            })
        }
        if (user.is_verify) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'user_aready_verify',
                error: 'user_aready_verify'
            })
        }
        let tokenType = TokenType.VerifyAgency
        if (user.role === 'recruiter') {
            tokenType = TokenType.VerifyRecruiter
        }
        const token = await this.tokenService.CreateToken(userTokenDto.email, ip, tokenType)
        if (user.role === 'recruiter') {
            const mappedUser = this.mapperService.map<UserInvitedDto>(
                user,
                UserInvitedDto.name,
                User.name
            )
            await this.mailService.SendVerifyRecruiter(mappedUser, token, undefined, undefined)
        }
        else {
            await this.mailService.SendVerifyAgency(this.mapperService.map<UserDto>(
                user,
                UserDto.name,
                User.name,
            ), token, undefined)
        }
        const response: BaseResponse<boolean> = {
            data: true,
        }
        response.success = true
        return res.status(HttpStatus.OK).json(response)
    }
    @HttpCode(HttpStatus.OK)
    @Post('forgotPass')
    @ApiResponse({
        status: HttpStatus.OK,
        type: OutForgotPassDto,
        description: 'API to request a change password confirm email.',
    })
    @ApiOperation(GetOperationId('auth', 'forgotPass', 'API to request a change password confirm email.'))
    async requestChangePass(@Response() res, @Body() forgotPassDTO: ForgotPassDto, @Ip() ip): Promise<BaseResponse<OutForgotPassDto>> {
        const response: BaseResponse<OutForgotPassDto> = {
            success: true,
        }
        const user = await this.usersService.findByEmail(forgotPassDTO.email)
        if (!user) {
            response.success = false
            response.error = {
                message: 'EMAIL_NOT_FOUND'
            }
            return res.status(HttpStatus.OK).json(response)
        }

        const token = await this.tokenService.CreateToken(forgotPassDTO.email, ip, TokenType.ForgotPass)
        await this.mailService.SendForgotPass(user, token)

        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Post('checkToken')
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserTokenDto,
        description:
            'API to check a token with type (forgot_pass | confirm_user) is valid.',
    })
    @ApiOperation(
        GetOperationId(
            'auth',
            'checkToken',
            'API to check a token with type (forgot_pass | confirm_user) is valid.',
        ),
    )
    async checkToken(
        @Response() res,
        @Body() checkTokenDto: CheckTokenDto,
    ): Promise<BaseResponse<UserTokenDto>> {
        const token = await this.tokenService.findTokenById(
            checkTokenDto.token,
        )
        const response: BaseResponse<UserTokenDto> = {
            success: true,
        }
        if (!token) {
            response.success = false
            response.error = {
                message: 'token_not_found'
            }
            res.status(HttpStatus.OK).json(response)
        } else {

            //debug('start getting the token');
            const user = await this.usersService.findByEmail(token.email)
            if (!user || user.is_deleted) {
                response.success = false
                response.error = {
                    message: 'user_not_found'
                }
                res.status(HttpStatus.OK).json(response)
            }
            let accessToken = {}
            if (user.role !== 'admin') {
                const agency = await this.agencyService.getAgencyDetail(user.agency_id.toString())
                accessToken = this.authService.createToken(user, agency)
            } else {
                accessToken = this.authService.createToken(user, undefined)
            }

            const resToken = {
                ...accessToken,
            }
            //this.logger.log(u);
            response.data = {
                token: plainToClass(LoginResponse, resToken),
                user: this.mapperService.map<UserDto>(
                    user,
                    UserDto.name,
                    User.name,
                ),
            }
            return res.status(HttpStatus.OK).json(response)
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('createPass')
    @UseGuards(JWTAuthGuard)
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to set new password, the token is from email.',
    })
    @ApiOperation(
        GetOperationId(
            'auth',
            'createPass',
            'API to set new password, the token is from email.',
        ),
    )
    async ResetPass(
        @Response() res,
        @Payload() payload: JwtPayload,
        @Body() resetPassDto: ResetPassDto,
    ): Promise<BaseResponse<boolean>> {
        //const token = await this.tokenService.create(req.user);
        const token = await this.tokenService.findTokenById(resetPassDto.token)

        if (!token || payload.email != token.email) {
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'token Not Found',
                error: 'token_not_found',
            })
        } else {
            const response: BaseResponse<boolean> = {
                success: true,
            }

            const { newt_pass, confirmed_pass } = resetPassDto

            if (newt_pass.trim() !== confirmed_pass.trim()) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: {
                        title: 'Oops, passwords don\'t match',
                        content: 'Please double check your password and try again'
                    },
                    error: 'passwords_do_not_match',
                })
            }

            //this.logger.debug(payload)
            const user = await this.usersService.changePassword(
                payload.id,
                resetPassDto.newt_pass,
            )
            //console.log(user);
            if (!user || !user.password || !user.is_verify) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    message: 'changePassword_error',
                    error: 'changePassword_error',
                })
            }

            await this.tokenService.InvalidToken(token)
            return res.status(HttpStatus.OK).json(response)
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('changePass')
    @UseGuards(JWTAuthGuard)
    @ApiOperation(
        GetOperationId(
            'auth',
            'change_pass',
            'API to change password for authenticated user',
        ),
    )
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to change password for authenticated user',
    })
    async changePass(@Response() res, @Payload() payload: JwtPayload, @Body() changePassDto: ChangePassDto): Promise<BaseResponse<boolean>> {
        const response: BaseResponse<boolean> = {
            success: true,
            data: true
        }
        const isValidPass = await this.authService.validateUser(payload.email, changePassDto.old_pass)
        if (!isValidPass) {
            response.success = false
            response.data = false
            response.error = {
                message: 'wrong_password'
            }
            return res.status(HttpStatus.FORBIDDEN).json(response)
        }
        const user = await this.usersService.changePassword(payload.id, changePassDto.newt_pass)
        if (!user) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'changePassword_error',
                error: 'changePassword_error',
            })
        }
        return res.status(HttpStatus.OK).json(response)
    }
}
