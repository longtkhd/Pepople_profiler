export class TPTokenRequest {
    Username: string;
    Password: string;
}

export class TPCreateCandidateRequest {
    AccessToken: string;
    ProjectAccessKey: string;
    //A username for the Candidate to access Test Partnership.
    //If you wish to avoid passing us personally-identifiable information, we suggest using this field as the anonymous identifier which can then be used by you to identify who scored what. For example only you would know that username ABC3720107 equates to person Joe Bloggs, and Test Partnership would have no record of who ABC3720107 actually is.
    Username:string
    //The password for the Candidate to access Test Partnership (min. 9 characters).
    Password:string
    //The Candidate’s First Name. Note this is mandatory however if you want to avoid passing us personally-identifiable data feel free to send us something like 'AnonymousFirstName'.
    FirstName:string
    //The Candidate’s Surname. Note this is mandatory however if you want to avoid passing us personally-identifiable data feel free to send us something like 'AnonymousLastName'.
    LastName:string
    //The email address to which Test Partnership mail servers will send the candidate's login details (Username and Password)
    Email:string
    //The URL that Test Partnership will redirect the Candidate back to following the completion of their Assessment. If supplied this field should begin http:// or https://, if not the Candidate will be directed back to the home page of the Test Partnership Platform (https://www.tptests.com)
    RedirectURL:string // https://demo2.bachasoftware.com/thankyou?type=feedback
}

export class TPIsCandidateRequest {
    Username:string
    AccessToken: string
}

export class TPGetAssessmentsForCandidateRequest {
    Username:string
    AccessToken: string
}

export class TPGetAssessmentsScoresRequest {
    AccessToken: string
}
export class TPGetAssessmentsReportsRequest {
    AccessToken: string
}

export class TPGetAssessmentsStatusRequest {
    AccessToken: string
}
// export class TPAssessmentVerificationRequest {
//     AccessToken:string
//     AssessmentSectiondId: string
// }