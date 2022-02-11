import { double } from 'aws-sdk/clients/lightsail'

export interface TPResponse {
    Errors: TPErrorResponse[]
}
export interface TPErrorResponse {
    Key: string
    Message: string
}
export interface TPTokenResponse extends TPResponse {
    AccessToken: string;
}

//Awaiting Resume, Completed, Not Started, and In Progress.
enum TestStatus {
    AwaitingResume = 'Awaiting Resume',
    Completed = 'Completed',
    NotStarted = 'Not Started',
    InProgress = 'In Progress'
}
export interface Scale {
    Scale: string
    StenScore: number
    ZScore: string
}
export class Test {
    Id: string
    TestName: string
    TestStatus: TestStatus

}
export class Group {
    ReportType: string
    Group: string
    RoundedStenScore: number
    StenScore: double
}

export class TestDetail extends Test {
    TestMinutes: number
    ZScore: string
    PercentileScore: string
    StenScore: string
    Verification: string
    TScore: string
    EndTime: string
    Scales: Scale[]
    Groups: Group[]
    PersonalityProfileReport:Group[]
    CompetencyProfileReport:Group[]
}
export interface Assessment {
    Id: string
    Tests: TestDetail[]
}

export interface AssessmentSection {
    AssessmentSectiondId: string
    AssessmentSectionName: string
}
export interface CandidateAssessment {
    Id: string
    ProjectsID: string
    CandidatesID: string
    ProjectName: string
    AssessmentSections: AssessmentSection[]
}

export interface TPCreateCandidateResponse extends TPResponse {
    Assessment: Assessment;
}

export interface TPIsCandidateResponse extends TPResponse {
    IsCandidate: string
}

export interface TPGetAssessmentsForCandidateResponse extends TPResponse {
    Assessments: CandidateAssessment[]
}

export interface TPGetAssessmentsScoreResponse extends TPResponse {
    assessment_id?: string
    Status: string
    SubmissionDate: string
    Score: string
    Tests: TestDetail[]
}
export interface TPGetAssessmentsStatusResponse extends TPResponse {
    assessment_id?: string
    Status: string
    SubmissionDate: string
    Score: string
    Tests: TestDetail[]
}