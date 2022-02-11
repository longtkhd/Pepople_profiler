import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'
import { Agency } from 'src/schemas/agency.schema'
import { Candidate } from 'src/schemas/candidate.schema'
import { User } from 'src/schemas/user.schema'

export class TopAssessmentReportDto {
    @ApiProperty()
    agency_id: string

    @ApiProperty()
    agency_name: string

    @ApiProperty()
    count: number
}

export class CompetenceRadarSVG {
    @ApiProperty()
    @Expose()
    competence_name: string;

    @ApiProperty()
    @Expose()
    svg: string;
}

export class OutSyncCandidateAssessmentsDto {
    assessment_id: string
    status: string
    agency: Agency
    candidate: Candidate
    created_by: User
}
export class OutAssessmentReportDto {
    @ApiProperty()
    totalAssessmentReports: number;

    @Type(() => TopAssessmentReportDto)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [TopAssessmentReportDto] })
    topAssessmentReport: TopAssessmentReportDto[];
}

export class AssessmentReportChartDto {
    @ApiProperty()
    radarChartSvg: string;

    @ApiProperty()
    barChartSvg: string;
}

export class ZipExportPdfDto {
    @ApiProperty()
    fileName: string;

    @ApiProperty()
    buffer: Buffer;
}