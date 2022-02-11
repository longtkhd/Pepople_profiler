import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigurationService } from '../../shared/configuration/configuration.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private readonly authService: AuthService, configurationService: ConfigurationService,) {
        super({
            ignoreExpiration: false,
            // jwtFromRequest: req => {
            //     const token = this.tokenService.extractTokenFromRequest(req);
            //     // Logger.log(token, JwtStrategy.name);
            //     return token;
            // },
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken()
            ]),
            secretOrKey: configurationService.JWT.Key,
            // secretOrKeyProvider: (req, token, done) => {
            //     const secretKey = this.tokenService.createSecretKey(plainToClass(User, this.tokenService.decode(token)));
            //     done(null, secretKey);
            // }
        });
    }
    async validate(payload: any, done: Function) {
        const user = await this.authService.validateUserToken(payload);
        if (!user) {
            return done(new UnauthorizedException(), false);
        }
        done(null, user);
    }
}