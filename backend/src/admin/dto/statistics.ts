import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsArray, IsString, ValidateNested } from 'class-validator'
import { PaginationDto } from '../../shared/base.dto'
import { AgencyInfoDto } from '../../agency/dto/agency'
import { PackageInfoDto } from '../../package/dto/package.dto'

export class SubscriptionTypeSetting extends PackageInfoDto {
    @ApiProperty()
    count:string
}
export class SubscriptionTypeSettingsDto {
    @Type(() => SubscriptionTypeSetting)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [SubscriptionTypeSetting] })
    type_list: [SubscriptionTypeSetting]
}

export class Statistic {
    // @ApiProperty()
    // agency_name:string
    
    @ApiProperty()
    agency_id:string

    // @ApiProperty()
    // count:number
}

export class OutStatistiesDto {
    @Type(() => Statistic)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [Statistic] })
    type_list: [Statistic]
    
    @ApiProperty()
    statistic_type:string

    @ApiProperty()
    total_usage:number
}
export class OutTotalUserStatistiesDto {
    @ApiProperty()
    total_agenc:number

    @ApiProperty()
    total_user:number
}
export class InStatistiesFilterDto {
    @ApiProperty()
    sort_type:string
    @ApiProperty()
    sort_direction: string;
    @ApiProperty()
    agency_id:string

    @ApiProperty()
    from_date:Date

    @ApiProperty()
    to_date:Date

    @ApiProperty()
    top_size:number
}
export class AgencyListDto extends PaginationDto   {
    @Type(() => AgencyInfoDto)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [AgencyInfoDto] })
    agency_list: [AgencyInfoDto]
}

export class SubscriptionTypeDto {
    @Type(() => SubscriptionTypeSetting)
    @IsArray()
    @ValidateNested({ each: true })

    @ApiProperty()
    freeTrial: number

    @ApiProperty()
    noSubscription : number

    @ApiProperty({ type: [SubscriptionTypeSetting] })
    countSubscriptionType : SubscriptionTypeSetting[]
}


