
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer/decorators'
import { IsArray, ValidateNested } from 'class-validator'
import { PaginationDto } from '../../shared/base.dto'
import { UserDto } from '../../auth/dto/login'


export class RecruiterJobsStatistic {
    @ApiProperty()
    close_job_count: number = undefined;

    @ApiProperty()
    open_job_count: number = undefined;

    @ApiProperty()
    cv_parse_count: number = undefined;

    @ApiProperty()
    candidate_report_gen_count: number = undefined;

    @ApiProperty()
    assessment_count: number = undefined;
}
export class RecruiterDto extends UserDto {
    @ApiProperty()
    @Type(() => RecruiterJobsStatistic)
    jobs_statistic: RecruiterJobsStatistic;
}

export class RecruiteFilterParam extends PaginationDto {
    @ApiProperty()
    agency_id: string
}

export class OutListRecruiterDto extends PaginationDto {
    @Type(() => UserDto)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [UserDto] })
    recruiter_list: UserDto[];
}