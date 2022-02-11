import { Injectable, Logger } from '@nestjs/common'

import { Token, TokenType } from '../schemas/token.schema'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import * as moment from 'moment'

@Injectable()
export class TokenService {
    private readonly logger = new Logger('TokenService');
    constructor(
        @InjectModel(Token) private readonly repo: ReturnModelType<typeof Token>) {
    }

    public async findTokenById(id: string): Promise<Token | null> {
        const token = await this.repo.findOne({ _id: id })
        if(token && token.type === TokenType.VerifyRecruiter){
            return token
        }
        if (!token || (token.expires_at && token.expires_at <= new Date()) || token.is_expired) {
            return null
        }
        return token
    }

    async CreateToken(email: string, ip: string, type: TokenType) {
        try {
            const newToken = new this.repo() // InstanceType<User>
            //const newToken = await this.repo.create()
            newToken.email = email
            newToken.ip_address = ip
            newToken.type = type
            newToken.expires_at = moment().add(30, 'm').toDate()
            return await newToken.save()
        } catch (error) {
            this.logger.error(error)
            throw error
        }
    }

    async InvalidToken(token: Token) {
        token.expires_at = new Date()
        token.is_expired = true
        return await this.repo.update({ _id: token.id }, token)
    }
}
