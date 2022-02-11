import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { UserDto } from './login'
import { IsNotEmpty, MaxLength, IsMongoId } from 'class-validator'

export class ForgotPassDto {
    @IsNotEmpty()
    @MaxLength(128)
    @ApiProperty()
    email: string;
}
export class OutForgotPassDto extends ForgotPassDto {
    @ApiProperty()
    status: string;
    @ApiProperty()
    message: string;
}
export class CheckTokenDto {
    @IsNotEmpty()
    @IsMongoId()
    @ApiProperty()
    token: string;
}

export class OutCheckTokenDto extends CheckTokenDto {
    @IsNotEmpty()
    @MaxLength(128)
    @ApiProperty()
    token: string;

    @Type(() => UserDto)
    @ApiProperty({ type: UserDto })
    user: UserDto;

    @ApiProperty()
    message: string;
    @ApiProperty()
    status: string;
}

export class ResetPassDto {
    @IsNotEmpty()
    @MaxLength(128)
    @ApiProperty()
    token: string;

    @IsNotEmpty()
    @MaxLength(128)
    @ApiProperty()
    newt_pass: string;

    @IsNotEmpty()
    @MaxLength(128)
    @ApiProperty()
    confirmed_pass: string;
}

export class ChangePassDto {
    @IsNotEmpty()
    @MaxLength(128)
    @ApiProperty()
    old_pass: string;

    @IsNotEmpty()
    @MaxLength(128)
    @ApiProperty()
    newt_pass: string;
}