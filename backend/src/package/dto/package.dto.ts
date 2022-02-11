import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsArray, IsNotEmpty } from 'class-validator'
import { FilterQuery } from 'mongodb'
import { Package } from 'src/schemas/package.schema'
import { PaginationDto } from 'src/shared/base.dto'

export class CreatePakageDto {

    @IsNotEmpty()
    @ApiProperty()
    package_name: string = undefined;

    @IsNotEmpty()
    @ApiProperty()
    max_cv_parsing: number = undefined;

    @IsNotEmpty()
    @ApiProperty()
    max_recruiter: number = undefined;

    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsNotEmpty()
    @ApiProperty()
    max_assessment_limit: number;

    @IsNotEmpty()
    @ApiProperty()
    price: number;

    @IsNotEmpty()
    @ApiProperty()
    package_size: number;

    @ApiProperty()
    color: string = undefined;
}

export class PackageInfoDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    package_name: string;

    @ApiProperty()
    @Expose()
    description: string;

    @ApiProperty()
    @Expose()
    max_cv_parsing: number;

    @ApiProperty()
    @Expose()
    max_recruiter: number = undefined;

    @ApiProperty()
    @Expose()
    max_assessment_limit: number;

    @ApiProperty()
    @Expose()
    price: number;

    @ApiProperty()
    package_size: number;

    @ApiProperty()
    @Expose()
    color: string = undefined;
}

export class OutPackageListDto extends PaginationDto{
    @Type(() => PackageInfoDto)
    @IsArray()
    @ApiProperty({ type: [PackageInfoDto] })
    list: PackageInfoDto[];
}


export class PackageFilterParamDto  extends PaginationDto {
    public buildFilterQuery(): FilterQuery<Package> {
        const query: FilterQuery<Package> = {}
        return query
    }
}