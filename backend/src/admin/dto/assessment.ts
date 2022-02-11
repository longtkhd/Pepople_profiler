import { ApiProperty } from '@nestjs/swagger'

export class AssessmentIndustryDto {
    @ApiProperty()
    name: string
}

export class AssessmentTypeDto {
    @ApiProperty()
    name: string
}

