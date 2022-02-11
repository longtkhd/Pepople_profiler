import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'

export class PostalAddress {
    AddressLine: string
    Municipality: string
    CountryCode: string
}
export class PersonName {
    FormattedName: string
    FamilyName: string
    GivenName: string
}
export class InternetWebAddress {
    content: string
    type: string
}
export class ContactMethod {
    InternetEmailAddress_main: string
    PostalAddress_main: PostalAddress
    Telephone_home: string
    Telephone_mobile: string
    InternetWebAddress: InternetWebAddress[]
}
export class EmploymentHistory {
    employerOrgType: string
    EndDate: string
    EmployerOrgName: string
    MonthsOfWork:string
    Title: string[]
    OrgName: string
    JobArea: string
    JobGrade: string
    StartDate: string
    Description: string
    PositionType: string
}
export class Competency {
    auth: boolean
    skillLevel: number
    skillName: string
    description: string
    skillAliasArray: string[]
    skillProficiency: string
    TaxonomyId: any
}
export class Degree {
    degreeType: string
    DegreeName: string
    DegreeDate: string
}
export class EducationHistory {
    schoolType: string
    Degree: Degree
    SchoolName: string
    EndDate: string
    Comments: string
    LocationSummary: PostalAddress
    StartDate: string
}
export class StructuredResume {
    ContactMethod: ContactMethod
    PersonName: PersonName
    RevisionDate: string
    lang: string
    ExecutiveSummary:string
    Competency: Competency[]
    EmploymentHistory: EmploymentHistory[]
    PreferredPosition: string
    EducationHistory: EducationHistory[]
}
export class ExperienceSummary {
    ExecutiveBrief: string
    TotalYearsOfManagementWorkExperience: number
    TotalMonthsOfLowLevelManagementWorkExperience: number
    TotalYearsOfLowLevelManagementWorkExperience: number
    TotalMonthsOfManagementWorkExperience: number
    ManagementRecord: string
}
export class Resume {
    StructuredResume: StructuredResume
    ExperienceSummary: ExperienceSummary
    FileStruct: any
    src: string
    TextResume: string
    ParserInfo: any
}
export class DaxtraCVParserResponseDto {
    Resume: Resume;
}
export class BatchDaxtraCVParserResponseDto {
    Files:DaxtraCVParserResponseDto[]
}

export class TopCvParsingDto {
    @ApiProperty()
    agency_id: string

    @ApiProperty()
    agency_name: string

    @ApiProperty()
    count: number
}

export class OutCvParsingDto {
    @ApiProperty()
    totalCvParsing: number;

    @Type(() => TopCvParsingDto)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [TopCvParsingDto] })
    topCvParsing: TopCvParsingDto[];

}