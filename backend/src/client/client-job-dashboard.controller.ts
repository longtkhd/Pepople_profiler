import { Body, Controller, Get, Put, Header, HttpException, HttpStatus, Logger, Param, Post, Res } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CandidateDocumentService } from 'src/candidate/candidate-document.service'
import { CandidateService } from 'src/candidate/candidate.service'

import {
    CandidateListDto,
} from 'src/candidate/dto/candidate'
import { AssessmentReport, Candidate } from 'src/schemas/candidate.schema'
import { ClientFeedback } from 'src/schemas/job.schema'

import { BaseResponse } from 'src/shared/base.dto'
import { GetOperationId } from 'src/shared/utils/get-operation-id'
import { JobClientContactService } from '../job/job-client-contact.service'
import { ClientJobDashboardService } from './client-job-dashboard.service'
import { AddClientFeedbackDto, OutClientFeedbackDto, OutListClientFeedbackDto } from './dto/client'
import { ClientJobDashboardDetail } from './dto/client-job-dashboard.dto'
import { plainToClass } from 'class-transformer'
import { CandidateJobService } from '../candidate/job-candidate.service'
@ApiTags('clientJobDasboard')
@Controller('clientJobDasboard')
export class ClientJobDashboardController {
    constructor(
        private readonly clientJobDashboardService: ClientJobDashboardService,
        private readonly jobClientContactService: JobClientContactService,
        private readonly candidateService: CandidateService,
        private readonly candidateJobService: CandidateJobService,
        private readonly candidateDocumentService: CandidateDocumentService,
    ) { }
    private readonly logger = new Logger(ClientJobDashboardController.name);

    @Get(':invite_token')
    @ApiResponse({
        status: HttpStatus.OK,
        type: ClientJobDashboardDetail,
        description: 'Api get Client Job Dashboard Detail from invite token',
    })
    @ApiOperation(
        GetOperationId(
            'jobclientcontact',
            'invite_token',
            'Api get JobClientContact from token',
        ),
    )
    async getClientJobDashboardDetail(
        @Res() res: any,
        @Param('invite_token') inviteToken: string,
    ): Promise<BaseResponse<ClientJobDashboardDetail>> {
        const response: BaseResponse<ClientJobDashboardDetail> = { success: true }
        try {
            const data = await this.clientJobDashboardService.getDashboardDetail(inviteToken)
            response.data = data
        } catch (error) {
            this.logger.error(error)
            response.success = false
            response.error = error
        }
        return res.status(HttpStatus.OK).json(response)
    }

    @Get(':invite_token/candidate-detail/:candidate_id')
    @ApiResponse({
        status: HttpStatus.OK,
        type: CandidateListDto,
        description: 'Api client candidate report',
    })
    @ApiOperation(
        GetOperationId('client dashboard', 'candidate-detail', 'Api client candidate report'),
    )
    async getCandidateDetail(
        @Res() res: any,
        @Param('invite_token') invite_token: string,
        @Param('candidate_id') candidateId: string,
    ): Promise<BaseResponse<Candidate>> {
        const response: BaseResponse<Candidate> = { success: true }
        try {
            const jobClientContact = await this.jobClientContactService.findClientContactByToken(invite_token)
            const candidate = await this.candidateService.getClientCandidateReport(
                candidateId,
                [
                    { path: 'additional_infos' },
                    {
                        path: 'documents', match: {
                            is_deleted: { $ne: true },
                            is_public: true,
                            type: 3
                        }
                    },
                    { path: 'summaries' },
                    {
                        path: 'assessment_reports', populate: [
                            {
                                path: 'industry',
                                model: 'AssessmentIndustry',
                            },
                            {
                                path: 'type',
                                model: 'AssessmentType',
                            }
                        ]
                    }
                ],
            )
            const data = plainToClass(Candidate, candidate)
            if (data.assessment_reports && data.assessment_reports.length > 0) {
                data.assessment_reports.forEach(x => {
                    const report = x as AssessmentReport
                    if (report.tests) {
                        const extractReports = AssessmentReport.PopulateAssessmentReports(report.tests)
                        report.CompetencyProfileReport = extractReports.CompetencyProfileReport
                        report.PersonalityProfileReport = extractReports.PersonalityProfileReport
                    }

                })
                const filter_assessment_reports = []
                for (let i = 0; i < data.assessment_reports.length; i++) {
                    const assessment_report = data.assessment_reports[i] as AssessmentReport
                    if (jobClientContact?.job_id) {
                        if (!assessment_report.job || (assessment_report.job && assessment_report.job.toString() != jobClientContact?.job_id)) {
                            filter_assessment_reports.push(assessment_report.id)
                        }
                    }
                }
                data.assessment_reports = data.assessment_reports.filter((x: AssessmentReport) => filter_assessment_reports.indexOf(x.id) === -1)
            }
            if (jobClientContact?.job_id) {
                const candidateJob = await this.candidateJobService.getCandidateJob(candidateId, jobClientContact?.job_id)
                data['recruiter_assessments'] = candidateJob?.recruiter_assessments || []
            }
            if (data.resume_text) {
                data.resume_text = data.resume_text.replace(data.resume_text.slice(data.resume_text.indexOf('{{DOCUMENT_DATESTAMP}}'),
                    data.resume_text.indexOf('{{END_DOCUMENT_DATESTAMP}}') + '{{END_DOCUMENT_DATESTAMP}}'.length), '').replace('{{HEADER}}', '').replace('{{END_HEADER}}', '').replace(/<br><br><br>/g, '')

                if (data.candidate_email) {
                    data.resume_text = data.resume_text.replace(data.candidate_email, '')
                }
                if (data.phone) {
                    data.resume_text = data.resume_text.replace(data.phone, '')
                    data.resume_text = data.resume_text.replace('+' + data.phone, '')
                }
                if (data.linked_in) {
                    data.resume_text = data.resume_text.replace(data.linked_in, '')
                }
                if (data.postalAddress) {
                    if (data.postalAddress.Municipality) {
                        data.resume_text = data.resume_text.replace(data.postalAddress.Municipality, '')
                    }
                    if (data.postalAddress.Region) {
                        data.resume_text = data.resume_text.replace(data.postalAddress.Region, '')
                    }
                }
            }
            response.data = data
        } catch (error) {
            this.logger.error(error)
            response.success = false
            response.error = error
        }
        return res.status(HttpStatus.OK).json(response)
    }

    @Get(':invite_token/candidate-document/:file_id')
    @Header('content-type', 'application/octet-stream')
    @ApiOperation(
        GetOperationId('client dash board', 'get-candidate-document', 'Api get candidate document'),
    )
    async getCandidateDocument(
        @Res() res: any,
        @Param('invite_token') invite_token: string,
        @Param('file_id') file_id: string,
    ) {

        try {
            const clientContact = await this.jobClientContactService.findClientContactByToken(invite_token)

            const document = await this.candidateDocumentService.getById(file_id)
            if (!document || !document?.agency_id) throw new HttpException('DOCUMENT_NOT_FOUND', 404)

            const candidate = await this.candidateService.getClientCandidateReport(
                document.candidate_id.toString()
            )

            if (!candidate) throw new HttpException('DOCUMENT_NOT_FOUND', 404)
            const documentFile = this.candidateDocumentService
                .downloadCandidateDoc(
                    document.agency_id.toString(),
                    document.file_md5,
                    document.candidate_id.toString(),
                )
                .on('error', (error) => {
                    this.logger.error(
                        `unable to get file from ${clientContact.agency_id.toString()}/candidate_${document.candidate_id.toString()}/${document.file_md5
                        }`,
                    )
                    this.logger.error(error)
                    return res.status(HttpStatus.NOT_FOUND).json({
                        message: 'file_not_found',
                    })
                })
            documentFile.pipe(res)
        } catch (error) {
            console.log(error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error,
            })
        }
    }


    @Post(':invite_token/client-feedback')
    @ApiResponse({
        status: HttpStatus.OK,
        type: OutClientFeedbackDto,
        description: 'Api create client contact feedback to candidate',
    })
    @ApiOperation(
        GetOperationId(
            'client contact feedback',
            'client-feedback',
            'Api create client contact feedback to candidate'
        ),
    )
    async createClientFeedback(
        @Res() res: any,
        @Param('invite_token') inviteToken: string,
        @Body() _clientFeedback: AddClientFeedbackDto
    ): Promise<BaseResponse<ClientFeedback>> {
        const response: BaseResponse<ClientFeedback> = { success: true }
        try {
            const jobClientContact = await this.jobClientContactService.findClientContactByToken(
                inviteToken,
            )
            const jobClientContactId = jobClientContact?.job_client_contact_id
            if (!jobClientContactId) {
                response.success = false
                response.error = { message: 'Invalid Token' }
                return res.status(HttpStatus.OK).json(response)
            }
            const feedback = await this.clientJobDashboardService.findFeedbackByEmail(
                jobClientContactId,
                _clientFeedback.email,
                _clientFeedback.candidate_id
            )
            if (feedback) {
                response.success = false
                response.error = { message: 'CONFRIM_UPDATE_FEEDBACK', payload: _clientFeedback }
                return res.status(HttpStatus.OK).json(response)
            }
            const result = await this.clientJobDashboardService.createClientFeedback(
                jobClientContactId,
                _clientFeedback,
            )
            /** update has_feedback */
            if (!jobClientContact.has_feedback) {
                await this.jobClientContactService.updateStateJobClientContact(
                    jobClientContact.job_client_contact_id,
                    true,
                    true,
                )
            }
            response.data = result
        } catch (error) {
            this.logger.error(error)
            response.success = false
            response.error = error
        }
        return res.status(HttpStatus.OK).json(response)
    }

    @Put(':invite_token/client-feedback')
    @ApiResponse({
        status: HttpStatus.OK,
        type: OutClientFeedbackDto,
        description: 'Api update client contact feedback to candidate',
    })
    @ApiOperation(
        GetOperationId(
            'client contact feedback',
            'client-feedback',
            'Api update client contact feedback to candidate'
        ),
    )
    async updateClientFeedback(
        @Res() res: any,
        @Param('invite_token') inviteToken: string,
        @Body() _clientFeedback: AddClientFeedbackDto
    ): Promise<BaseResponse<ClientFeedback>> {
        const response: BaseResponse<ClientFeedback> = { success: true }
        try {
            const jobClientContact = await this.jobClientContactService.findClientContactByToken(
                inviteToken,
            )
            const jobClientContactId = jobClientContact?.job_client_contact_id
            if (!jobClientContactId) {
                response.success = false
                response.error = { message: 'Invalid Token' }
                res.status(HttpStatus.OK).json(response)
            }
            const result = await this.clientJobDashboardService.updateClientFeedback(
                jobClientContactId,
                _clientFeedback,
            )
            response.data = result
        } catch (error) {
            this.logger.error(error)
            response.success = false
            response.error = error
        }
        return res.status(HttpStatus.OK).json(response)
    }

    @Get(':invite_token/client-feedback/:candidate_id')
    @ApiResponse({
        status: HttpStatus.OK,
        type: OutClientFeedbackDto,
        description: 'Api get client contact feedback to candidate',
    })
    @ApiOperation(
        GetOperationId('client contact feedback', 'client-feedback', 'Api get client contact feedback to candidate'),
    )
    async getClientFeedback(
        @Res() res: any,
        @Param('invite_token') inviteToken: string,
        @Param('candidate_id') candidateId: string,
    ): Promise<BaseResponse<OutClientFeedbackDto>> {
        const response: BaseResponse<OutListClientFeedbackDto> = { success: true }
        try {
            const feedbacks = await this.clientJobDashboardService.getFeedbackByToken(
                inviteToken, candidateId
            )
            response.data = feedbacks
        } catch (error) {
            this.logger.error(error)
            response.success = false
            response.error = error
        }
        return res.status(HttpStatus.OK).json(response)
    }

    //! Job detail
    //@Get(':invite_token/activity/:job_id')
    @Get('activity/pdf/:invite_token')
    async getJobactivity(
        @Res() res: any,
        @Param('invite_token') invite_token: string
    ): Promise<BaseResponse<any>> {
       
        const jobFIle =  await this.clientJobDashboardService.exportJobRecruitmentActivity(invite_token)
        
        res.set({
            // zip
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${jobFIle.fileName}`,
            'Content-Length': jobFIle.buffer.length,

            // prevent cache
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': 0
        })

        return res.status(200).send(jobFIle.buffer)
    }
}
