import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'

export class ListCountry {
    @IsString()
    @Expose()
    @ApiProperty()
    name: string
    
    @IsString()
    @Expose()
    @ApiProperty()
    code: string
}

export class ListIndustry{
    @IsString()
    @Expose()
    @ApiProperty()
    name: string
}