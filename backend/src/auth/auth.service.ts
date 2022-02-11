/* eslint-disable no-unused-vars */

import * as jwt from 'jsonwebtoken'
import { Injectable, Logger } from '@nestjs/common'
import { UsersService } from '../user/user.service'
import * as bcrypt from 'bcrypt'
import {
    UserBasicInfoDto,
    RegistrationStatus,
    JwtPayload,
    UserDto,
    RefreshTokenDto,
    RequestRefreshTokenDto,
} from './dto/login'
import { ConfigurationService } from '../shared/configuration/configuration.service'
import { User } from '../schemas/user.schema'

import { plainToClass } from 'class-transformer'
import { AgencyInfoDto } from 'src/agency/dto/agency'
import { isDate } from 'util'


@Injectable()
export class AuthService {
    constructor(
        private readonly coreConfig: ConfigurationService,
        private readonly usersService: UsersService,

    ) {
    }
    private readonly logger = new Logger(AuthService.name);
    async registerAgency(user: UserBasicInfoDto): Promise<RegistrationStatus> {
        try {
            const newUser = await this.usersService.registerAgency(user)
            if (newUser) {
                const status: RegistrationStatus = {
                    success: true,
                    message: 'user register',
                    user: newUser
                }
                return status
            }
        } catch (err) {
            //debug(err);
            return { success: false, message: err }
        }
    }
    createToken(user: User, agency: AgencyInfoDto) {
        //debug('get the expiration');
        const expiresIn = this.coreConfig.JWT.AccessTokenTtl
        //debug('sign the token');
        //debug(user);

        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                firstname: user.first_name,
                lastname: user.last_name,
                agency_id: user.agency_id,
                agency_name: agency ? agency.agency_name : '',
                job_title: user.job_title,
                phone: user.phone_number,
                is_send_welcome: agency?.is_send_welcome,
                agency_size: agency?.company_info?.agency_size
            },
            this.coreConfig.JWT.Key,
            { expiresIn },
        )
        const token = {
            accessToken: accessToken,
            expiresIn: expiresIn,

        }
        return token
    }

    async validateUserToken(payload: JwtPayload): Promise<User> {
        return await this.usersService.findById(payload.id)
    }
    async validateUser(email: string, inputPassword: string): Promise<boolean> {
        const user = await this.usersService.findByEmail(email)
        if (user && user.is_deleted != true) {
            try {
                const checkPass = await user.comparePassword(inputPassword)
                if (!checkPass) return null
                user.password = undefined
                user.password_salt = undefined
                return checkPass
            } catch (error) {
                console.log(error)
            }

        }
        return null
    }
    async createRefreshToken(user: User): Promise<RefreshTokenDto> {
        const refreshTokenExpiresIn = this.coreConfig.JWT.RefreshTokenTtl
        const refreshToken = await bcrypt.hash(`${user.id}-${Date.now()}`, 10)
        const refToken = {
            refreshToken,
            refreshTokenExpiresIn
        }
        return refToken
    }
}
