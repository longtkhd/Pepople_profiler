import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { Profile, User } from '../../schemas/user.schema';
import { v1 } from 'uuid';

export class JwtPayload {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    agency_id: string;
    agency_name: string;
    role: string;
    job_title: string;
    phone_number: string;
    is_send_welcome: boolean;
}

export class RegistrationStatus {
    success: boolean;
    message: string;
    user?: User;
}

export class LoginResponse {
    accessToken: string;
    tokenType?: string = 'bearer';
    expiresIn: number | string;
    refreshToken?: string;
    refreshTokenExpiresIn: number; // timestamps,use in redis
    type?: string;
}
export class Login {
    email: string;
    password: string;
    ipAddress: string;
    clientId: string;
}

export class SignInDto {
    @IsNotEmpty()
    @MaxLength(150)
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @MaxLength(128)
    @ApiProperty()
    password: string;
}

export class UserDto {
    @ApiProperty({ type: String })
    id: string = undefined;

    @ApiProperty({ type: String })
    @ApiHideProperty()
    last_login: Date = undefined;

    @MaxLength(150)
    @ApiProperty()
    job_title: string = undefined;

    @MaxLength(300)
    @ApiProperty()
    first_name: string = undefined;

    @MaxLength(300)
    @ApiProperty()
    last_name: string = undefined;

    @MaxLength(254)
    @ApiProperty()
    email: string = undefined;

    @ApiProperty({ type: Boolean })
    is_verify = true;

    @MaxLength(300)
    @ApiProperty()
    phone_number: string = undefined;

    @MaxLength(300)
    @ApiProperty()
    agency_name: string = undefined;

    @MaxLength(300)
    @ApiProperty()
    agency_id: string = undefined;

    @MaxLength(300)
    @ApiProperty()
    country_code: string = undefined;
    @ApiProperty()
    profile: Profile = new Profile();
    @ApiProperty()
    open_job: number;
    @ApiProperty()
    close_job: number;
}

export class UserBasicInfoDto {
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

    @ApiProperty()
    job_title: string = undefined;

    @MaxLength(300)
    @IsOptional()
    phone_number: string = undefined;

    @MaxLength(300)
    @IsOptional()
    @ApiProperty()
    agency_name: string = undefined;

    @MaxLength(300)
    @ApiProperty()
    @IsOptional()
    country_code?: string = undefined;
}

export class EditEmailDto {
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(254)
    @ApiProperty()
    newEmail: string = undefined;
}
export class UpdateUserState extends UserBasicInfoDto {
    is_active = true;
    is_deleted = false;
    public prepareDelete(uuid: string) {
        this.email = `deleted${uuid}@deleted.deleted`;
        this.first_name = `deleted${uuid}`;
        this.last_name = `deleted${uuid}`;
        this.job_title = `deleted${uuid}`;
        this.phone_number = `deleted${uuid}`;
        this.country_code = null;
    }
}
export class TokenDto {
    @ApiProperty()
    @IsNotEmpty()
    token: string;
}

export class UserTokenDto {
    @ApiProperty({ type: LoginResponse })
    token: LoginResponse;

    // @Type(() => UserDto)
    // @ApiProperty({ type: UserDto })
    user: any;
}

export class ResendUserTokenDto {
    @ApiProperty()
    @IsNotEmpty()
    email: string;
}

export class RefreshTokenDto {
    @ApiProperty()
    @IsNotEmpty()
    refreshToken: string;

    @ApiProperty()
    @IsNotEmpty()
    refreshTokenExpiresIn: number;
}

export class RequestRefreshTokenDto {
    @ApiProperty()
    @IsNotEmpty()
    refreshToken: string;
}
