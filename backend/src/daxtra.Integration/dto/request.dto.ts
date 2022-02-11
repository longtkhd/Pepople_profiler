import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class FilterCvParsing {
    @ApiProperty()
    @IsOptional()
    agency_id: string
    
    @ApiProperty()
    @IsOptional()
    from_date: string

    @ApiProperty()
    @IsOptional()
    to_date: string
}