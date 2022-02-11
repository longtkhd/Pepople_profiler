import { Module } from '@nestjs/common'

import { JwtStrategy } from './strategies/jwt.strategy'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
//import { TokenService } from './token.service';
import { UserModule } from '../user/user.module'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt/dist/jwt.module'
import { ConfigurationService } from '../shared/configuration/configuration.service'
import { LocalStrategy } from './strategies/local.strategy'
import { AgencyModule } from '../agency/agency.module'
import { MailModule } from '../mail/mail.module'
import { TokenModule } from '../token/token.module'
import { RedisCacheModule } from 'src/redisCache/redisCache.module'

@Module({
    imports: [
        UserModule,
        AgencyModule,
        MailModule,
        TokenModule,
        RedisCacheModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            inject: [ConfigurationService],
            useFactory: (config: ConfigurationService) => ({
                secret: config.JWT.Key,
                signOptions: {
                    expiresIn: config.JWT.AccessTokenTtl,
                    expiresInRefreshToken: config.JWT.RefreshTokenTtl,
                    algorithm: 'HS384',
                },
                verifyOptions: {
                    algorithms: ['HS384'],
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
