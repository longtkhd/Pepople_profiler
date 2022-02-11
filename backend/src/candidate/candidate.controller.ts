import { Body, Controller, HttpCode, HttpStatus, Param, Post, Delete, Query, UploadedFiles, UseGuards, UseInterceptors, Get, Res, Logger, Header, HttpException } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger'
import * as AdmZip from 'adm-zip'

import { BaseResponse, FileInput } from '../shared/base.dto'
import { JWTAuthGuard } from '../auth/guards/auth.guard'
import { User } from '../shared/decorators/user.decorator'
import { GetOperationId } from '../shared/utils/get-operation-id'
import {
    CandidateDetailDto,
    CandidateDocumentList,
    CandidateFilterParamDto,
    CandidateInfo,
    CandidateJobListDto,
    CandidateListDto,
    CandidateParseResult,
    CandidateParseResultDto,
} from './dto/candidate'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { JwtPayload } from 'src/auth/dto/login'
import { CandidateService } from './candidate.service'
import { CandidateDocumentService } from './candidate-document.service'
import { plainToClass } from 'class-transformer'
import { CandidateJobService } from './job-candidate.service'
import { AssessmentReport, Candidate, CandidateDocument } from '../schemas/candidate.schema'
import { CandidateJobFilterParamDto, DocumentFilterParamDto, InCandidateAssessmentDto, GenerateReportQuery, GenerateReportInviteTokenQuery, CandidateJobFilterDto } from './dto/input'

import { CandidateAssessmentService } from './candidate-assessment.service'
import { JobService } from 'src/job/job.service'
import { JobGuard } from 'src/job/guards/job.guard'
//import { MapperService } from 'src/shared/mapper/mapper.service'

import { TPTestsIntegrateService } from 'src/tptests/tptestsintegrate.service'
import { ZipExportPdfDto } from './dto/output'
import { AgencyService } from 'src/agency/agency.service'
import { InterviewTimeService } from 'src/interviewTime/interviewTime.service'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { JobClientContactService } from 'src/job/job-client-contact.service'
import { FilterQuery, ObjectId } from 'mongodb'
import { UsersService } from 'src/user/user.service'
import { ClientContactService } from 'src/client/client_contact.service'
import { InterviewNotifi } from 'src/client/interview_notifi.service'

@Controller('candidate')
@ApiTags('candidate')

export class CandidateController {
    constructor(
        private readonly tpTestsIntegrateService: TPTestsIntegrateService,
        private readonly candidateService: CandidateService,
        private readonly jobService: JobService,
        private readonly agencyService: AgencyService,
        private readonly candidateDocumentService: CandidateDocumentService,
        private readonly candidateAssessmentService: CandidateAssessmentService,
        private readonly candidateJobService: CandidateJobService,
        private readonly interviewTimeService: InterviewTimeService,
        private readonly clientContactService: ClientContactService,
        @InjectModel(Candidate)
        private readonly candidateModel: ReturnModelType<typeof Candidate>,
        private readonly jobClientContactService: JobClientContactService,
        private readonly interviewNotifi: InterviewNotifi,
        ) {
        //this.mapperService.createMap(Candidate.name, CandidateDetailDto.name)
        
    }
    private readonly logger = new Logger(CandidateController.name);
    // @HttpCode(HttpStatus.OK)
    // @Get('handleCronCheckCandidateStatus')
    // async handleCronCheckCandidateStatus() {
    //     try {
    //         await this.candidateAssessmentService.syncCandidateAssessments(['Pending', 'Not Started', 'In Progress', 'Submitted'])
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    @HttpCode(HttpStatus.OK)
    @Get('handleCandidateAssessment')
    async handleCronCheckCandidateStatus(@Query('candidate_id') candidate_id: string) {
        try {
            await this.candidateAssessmentService.syncCandidateId(candidate_id)
        } catch (error) {
            console.log(error)
        }
    }
    @HttpCode(HttpStatus.OK)
    @Get(':agency_id/list')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: CandidateListDto,
        description: 'API to get list of candidate base on filter ',
    })
    @ApiOperation(
        GetOperationId(
            'client',
            'edit',
            'API to get list of candidate base on filter',
        ),
    )
    async listCandidate(
        @Res() res,
        @Param('agency_id') agencyId: string,
        @User() payload: JwtPayload,
        @Query() _inFilter: CandidateFilterParamDto,
    ): Promise<BaseResponse<CandidateListDto>> {

        const response: BaseResponse<CandidateListDto> = { success: true }
        if (payload.role !== 'admin' && payload.agency_id != agencyId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: 'agency_not_found',
            })
        }
        _inFilter.agency_id = agencyId
        //_inFilter.populate = ['job_list'];

        if (_inFilter.not_in_job_id) {
            const inJobFilter = new CandidateJobFilterParamDto()
            inJobFilter.job_id = _inFilter.not_in_job_id
            const inJoblist = await this.candidateJobService.paginateCandidateList(
                inJobFilter
            )

            if (inJoblist.candidate_list.length > 0) {
                const excludeCandidate = inJoblist.candidate_list.map(x => x.id)
                _inFilter.exclude_id = excludeCandidate
                // list.candidate_list = list.candidate_list.filter(x => excludeCandidate.indexOf(x.id) == -1)
                // list.total = list.total - excludeCandidate.length
            }
        }
        const list = await this.candidateService.paginateCandidateList(
            _inFilter
        )
        if (_inFilter.exclude_id && _inFilter.exclude_id.length) {
            list.candidate_list = list.candidate_list.filter(x => _inFilter.exclude_id.indexOf(x.id) == -1)
        }
        response.data = list
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Get(':job_id/in-job')
    @UseGuards(JWTAuthGuard, JobGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: CandidateListDto,
        description: 'API to get list of job candidate base on filter ',
    })
    @ApiOperation(
        GetOperationId(
            'client',
            'list_of_candidate_in_job',
            'API to get list of job candidate base on filter',
        ),
    )
    async listJobCandidate(
        @Res() res,
        @Param('job_id') job_id: string,
        @User() payload: JwtPayload,
        @Query() _inFilter: CandidateJobFilterParamDto,
    ): Promise<BaseResponse<CandidateJobListDto>> {

        const response: BaseResponse<CandidateJobListDto> = { success: true }
        _inFilter.job_id = job_id
        const list = await this.candidateJobService.paginateCandidateList(
            _inFilter
        )
        response.data = list
        return res.status(HttpStatus.OK).json(response)
    }

    @Post(':job_id/upload-cv')
    @ApiOperation(GetOperationId('candidate', 'import', 'API to upload list of candidate using cv parsing third party'))
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'cv' }
        ]),
    )
    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard, JobGuard)
    @ApiResponse({
        status: HttpStatus.OK,
        type: CandidateParseResultDto,
        description: 'API to upload list of candidate using cv parsing third party'
    })
    async uploadcv(
        @Res() res,
        @Param('job_id') job_id: string,
        @User() payload: JwtPayload,
        @Body('candidate_id_list') candidate_id_list: string[],
        @UploadedFiles() files): Promise<BaseResponse<CandidateParseResultDto>> {
        const cvs: FileInput[] = files.cv

        const response: BaseResponse<any> = { success: true }
        const datauploaded = await this.candidateService.uploadNewCandidate(cvs, job_id, payload)
        const data = new CandidateParseResultDto()

        data.list = datauploaded
        if (candidate_id_list && candidate_id_list.length) {
            const candidateJobFilter = new CandidateJobFilterParamDto()
            candidateJobFilter.job_id = job_id
            const list = await this.candidateJobService.paginateCandidateList(
                candidateJobFilter
            )
            const listCandidateInJob = list.candidate_list.map(x => x.id)

            const promises = candidate_id_list.map(async candidate_id => {
                if (listCandidateInJob.indexOf(candidate_id) > -1) { return undefined }
                const candidate = await this.candidateService.getCandidateDetail(candidate_id, payload)
                if (!candidate) return undefined
                await this.candidateJobService.addCandidateToJob(payload, job_id, candidate.id)

                return candidate as CandidateParseResult
            })
            const existingResults = await Promise.all(promises)
            data.list = data.list.concat(existingResults.filter(x => x != undefined))
        }
        response.data = data
        return res.status(HttpStatus.OK).json(response)
    }

    @Post(':candidate_id/upload-doc')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'file' }
    ]))
    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard)
    @ApiOperation(GetOperationId('candidate', 'upload doc', 'API to upload documents for candidate'))
    @ApiResponse({
        description: 'API to upload documents for candidate',
        type: CandidateDocument,
    })
    async uploadedFile(
        @Res() res,
        @Param('candidate_id') candidate_id: string,
        @User() payload: JwtPayload,
        @UploadedFiles() files,
    ): Promise<BaseResponse<any>> {
        const response: BaseResponse<any> = {
            success: true,
        }
        try {
            const docs: FileInput[] = files.file
            const promises = docs.map(async (doc) => {
                return await this.candidateDocumentService.uploadCandidateFile(
                    doc,
                    candidate_id,
                    payload,
                    2,
                )
            })
            response.data = await Promise.all(promises)
        } catch (error) {
            response.success = false
            response.error = error
        }
        return res.status(HttpStatus.OK).json(response)
    }

    @Post(':candidate_id/original-document')
    @ApiOperation(
        GetOperationId(
            'candidate',
            'upload original file',
            'API to upload original documents for candidate'
        )
    )
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'original' }
        ]),
    )
    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard)
    @ApiResponse({
        status: HttpStatus.OK,
        type: CandidateDocument,
        description: 'API to upload original documents for candidate'
    })
    async uploadedOriginalFile(
        @Res() res,
        @Param('candidate_id') candidate_id: string,
        @User() payload: JwtPayload,
        @UploadedFiles() files,
    ): Promise<BaseResponse<any>> {
        const response: BaseResponse<any> = {
            success: true,
        }
        try {
            const docs: FileInput[] = files.original
            await this.candidateDocumentService.hanldeSingletonOriginalResuseDocument(
                payload.agency_id,
                candidate_id
            )
            const doc = await this.candidateDocumentService.uploadCandidateFile(
                docs[0],
                candidate_id,
                payload,
                3
            )
            response.data = doc
        } catch (error) {
            response.success = false
            response.error = error
        }
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Get(':candidate_id/original-document')
    @UseGuards(JWTAuthGuard)
    @ApiResponse({
        status: HttpStatus.OK,
        type: Candidate,
        description: 'API to get candidate original document'
    })
    @ApiOperation(
        GetOperationId(
            'candidate document',
            'original document',
            'API to get candidate original document'
        )
    )
    async getCandidateOriginalDocument(
        @Res() res,
        @Param('candidate_id') candidate_id: string,
        @User() payload: JwtPayload
    ): Promise<BaseResponse<CandidateDocument>> {
        const response: BaseResponse<CandidateDocument> = {
            success: true
        }
        try {
            const doc = await this.candidateDocumentService.getOriginalResumeDocument(
                payload.agency_id,
                candidate_id
            )
            response.data = doc
        } catch (e) {
            response.success = false
            response.error = e
        }
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Post(':candidate_id/:job_id')
    @UseGuards(JWTAuthGuard)
    @ApiResponse({
        status: HttpStatus.OK,
        type: CandidateDetailDto,
        description: 'API to edit existing candidate info'
    })
    @ApiOperation(GetOperationId('candidate', 'edit', 'API to edit existing candidate info'))
    async editJobCandidate(
        @Res() res,
        @Param('candidate_id') candidate_id: string,
        @Param('job_id') jobId: string,
        @User() payload: JwtPayload,
        @Body() _candidateInfo: CandidateDetailDto): Promise<BaseResponse<CandidateDetailDto>> {
        const response: BaseResponse<CandidateDetailDto> = {
            success: true
        }
        const result = await this.candidateService.updateCandidate(payload, candidate_id, _candidateInfo, jobId)
        response.data = result
        return res.status(HttpStatus.OK).json(response)
    }
    @HttpCode(HttpStatus.OK)
    @Get(':candidate_id')
    @UseGuards(JWTAuthGuard)
    @ApiResponse({
        status: HttpStatus.OK,
        type: Candidate,
        description: 'API to get existing candidate info'
    })
    @ApiOperation(GetOperationId('candidate', 'detail', 'API to get existing candidate info'))
    async getCandidate(
        @Res() res,
        @Param('candidate_id') candidate_id: string,
        @Query() jobFilter: CandidateJobFilterDto,
        @User() payload: JwtPayload): Promise<BaseResponse<Candidate>> {
        const response: BaseResponse<Candidate> = {
            success: true
        }
        const result = await this.candidateService.getCandidateDetail(candidate_id, payload,
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
                    path: 'assessment_reports', populate: [{
                        path: 'industry',
                        model: 'AssessmentIndustry',
                    },
                    {
                        path: 'type',
                        model: 'AssessmentType',
                    }]
                }
            ]
        )

        const data = plainToClass(Candidate, result)
        //public get PersonalityProfileReport() {
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
                if (jobFilter && jobFilter.job_id) {

                    if (!assessment_report.job || (assessment_report.job && assessment_report.job.toString() != jobFilter.job_id)) {
                        filter_assessment_reports.push(assessment_report.id)
                    }
                }
            }
            data.assessment_reports = data.assessment_reports.filter((x: AssessmentReport) => filter_assessment_reports.indexOf(x.id) === -1)
        }
        if (jobFilter && jobFilter.job_id) {

            const candidateJob = await this.candidateJobService.getCandidateJob(candidate_id, jobFilter.job_id)
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

        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Post(':candidate_id/addToJob')
    @UseGuards(JWTAuthGuard)
    @ApiResponse({
        status: HttpStatus.OK,
        type: CandidateListDto,
        description: 'API to add job to  candidate'
    })
    @ApiOperation(GetOperationId('candidate', 'addExisting', 'API to add job to  candidate'))
    async addCandidateToJob(
        @Res() res,
        @Param('candidate_id') candidate_id: string,
        @User() payload: JwtPayload,
        @Body('job_id_list') job_id_list: string[]): Promise<BaseResponse<CandidateJobListDto>> {
        const response: BaseResponse<CandidateInfo[]> = {
            success: true
        }
        const candidate = await this.candidateService.getCandidateDetail(candidate_id, payload)
        if (!candidate) return null

        const candidateJobFilter = new CandidateJobFilterParamDto()
        candidateJobFilter.candidate_id = candidate_id
        const list = await this.candidateJobService.paginateCandidateList(
            candidateJobFilter
        )

        const listCandidateInJob = list.candidate_list.map(x => x.job_id)
        const promises = job_id_list.map(async job_id => {
            if (listCandidateInJob.indexOf(job_id) > -1) { return undefined }
            await this.candidateJobService.addCandidateToJob(payload, job_id, candidate.id)
            return candidate
        })
        const results = await Promise.all(promises)
        response.data = results
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Post(':job_id/addExistingCandidates')
    @UseGuards(JWTAuthGuard, JobGuard)
    @ApiResponse({
        status: HttpStatus.OK,
        type: CandidateListDto,
        description: 'API to add existing candidate to job'
    })
    @ApiOperation(GetOperationId('candidate', 'addExisting', 'API to add existing candidate to job'))
    async addExistingCandidates(
        @Res() res,
        @Param('job_id') job_id: string,
        @User() payload: JwtPayload,
        @Body() candidate_id_list: string[]): Promise<BaseResponse<CandidateJobListDto>> {
        const response: BaseResponse<CandidateInfo[]> = {
            success: true
        }
        const candidateJobFilter = new CandidateJobFilterParamDto()
        candidateJobFilter.job_id = job_id
        const list = await this.candidateJobService.paginateCandidateList(
            candidateJobFilter
        )
        const listCandidateInJob = list.candidate_list.map(x => x.id)
        const promises = candidate_id_list.map(async candidate_id => {
            if (listCandidateInJob.indexOf(candidate_id) > -1) { return undefined }
            const candidate = await this.candidateService.getCandidateDetail(candidate_id, payload)
            if (!candidate) return undefined
            await this.candidateJobService.addCandidateToJob(payload, job_id, candidate.id)
            return candidate
        })
        const results = await Promise.all(promises)
        response.data = results
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Delete(':candidate_id/remove_doc/:doc_id')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to remove document from candidate ',
    })
    @ApiOperation(GetOperationId('candidate', 'delete_doc', 'API to remove document from candidate'))
    async deleteCandidateDoc(
        @Res() res,
        @Param('candidate_id') candidate_id: string,
        @Param('doc_id') doc_id: string,
        @User() payload): Promise<BaseResponse<boolean>> {
        const response: BaseResponse<CandidateDocument> = {
            success: true,
        }
        try {
            const doc = await this.candidateDocumentService.deleteCandidateDocument(payload, doc_id, candidate_id)
            response.data = doc
        } catch (error) {
            response.error = error
            response.success = false
        }
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Post('public_doc/:candidate_id/update')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to update public document to client from candidate',
    })
    @ApiOperation(GetOperationId('candidate', 'update_public_doc', 'API to update public document to client from candidate'))
    async updatePublicCandidateDoc(
        @Res() res,
        @Param('candidate_id') candidate_id: string,
        @Body('doc_ids') docIds: string[],
    ): Promise<BaseResponse<boolean>> {
        const response: BaseResponse<boolean> = {
            success: true,
        }
        try {
            const result = await this.candidateDocumentService.updatePublicCandidateDocument(docIds, candidate_id)
            if (!result) {
                response.data = result
                response.success = false
                response.error = {
                    message: 'Update share document to client faild!.',
                }
                return res.status(HttpStatus.OK).json(response)
            }
            response.data = result
        } catch (error) {
            response.error = error
            response.success = false
        }
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Delete(':candidate_id/remove-from-job/:job_id')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Number,
        description: 'API to remove Candidate From Job',
    })
    @ApiOperation(GetOperationId('candidate', 'delete_candidate_job', 'API to remove Candidate From Job'))
    async removeCandidateFromJob(
        @Res() res,
        @Param('candidate_id') candidate_id: string,
        @Param('job_id') job_id: string,
        @User() payload: JwtPayload): Promise<BaseResponse<number>> {
            const candidate = this.candidateService.getCandidateDetail(
                candidate_id,
                payload,
            );
            if (!candidate) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: 'candidate_not_found',
                });
            }
            const job = this.jobService.jobDetail(
                payload.agency_id.toString(),
                job_id,
            );
            if (!job) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: 'job_not_found',
                });
            }
            const candidateDeleted = await this.candidateJobService.getCandidateJob(candidate_id, job_id);
            console.log(candidateDeleted)
            if(candidateDeleted != null && candidateDeleted.client_contact_time_list.length > 0){
                for (
                    let i = 0;
                    i < candidateDeleted.client_contact_time_list.length;
                    i++
                ) {
                    const client =
                        await this.clientContactService.findClientContact(
                            candidateDeleted.client_contact_time_list[i]
                                .client_contact_id,
                        );
                    const candidate = await this.candidateModel.findById(candidate_id);
                    await this.interviewNotifi.sendPostpone(
                        client,
                        candidate,
                    );
                }
            }
            const removeResult =
                await this.candidateJobService.removeCandidateFromJob(
                    job_id,
                    candidate_id,
                );
            const allTime = await this.interviewTimeService.getAllTime(job_id);
            // tim all time in candidatejob
            // 1: get candidateinjob
            const candidateJobOfJob =
                await this.candidateJobService.getListCandidateOfJob(job_id);
            const timeOfListCandidate = []; // [{time_id, client_contact_id}]
            for (let i = 0; i < candidateJobOfJob.length; i++) {
                timeOfListCandidate.push(
                    candidateJobOfJob[i].client_contact_time_list,
                );
            }
            const listObjectTimeInCandidate = [].concat.apply(
                [],
                timeOfListCandidate,
            );
            // check time slot doesn't use
            let timeNotUse = allTime.filter((item) => {
                return (
                    listObjectTimeInCandidate.filter((time) => {
                        return `${item._id}` == time.time_id;
                    }).length == 0
                );
            });

            if (timeNotUse.length > 0) {
                for (let i = 0; i < candidateJobOfJob.length; i++) {
                    if(candidateJobOfJob[i].interview_status == 0){
                        candidateJobOfJob[i].interview_status = 1;
                    }
                    await candidateJobOfJob[i].save()
                }
            }

            // check status of client 
            const clientContactJob = await this.jobClientContactService.findAll(job_id);
            for(let i = 0; i < clientContactJob.length; i++){
                if(clientContactJob[i].interview_status == 2){
                    console.log(clientContactJob[i].interview_time)
                    let interviewTimeRemain = clientContactJob[i].interview_time.filter(item => {
                        return `${item.candidate_id}` != candidate_id;
                    })
                    console.log(interviewTimeRemain)
                    if(interviewTimeRemain.length < 1){
                        clientContactJob[i].interview_status = 1
                    }
                    clientContactJob[i].interview_time = interviewTimeRemain;
                    await clientContactJob[i].save()
                }
            }
            const response: BaseResponse<number> = {
                success: true,
                data: removeResult.deletedCount,
            };
            return res.status(HttpStatus.OK).json(response);
        }

    @HttpCode(HttpStatus.OK)
    @Get(':candidate_id/documents')
    @UseGuards(JWTAuthGuard)
    @ApiResponse({
        status: HttpStatus.OK,
        type: CandidateDocumentList,
        description: 'API to get list of document from candidate'
    })
    @ApiOperation(GetOperationId('candidate', 'get_doc_list', 'API to get list of document from candidate'))
    async getCandidateDoc(
        @Res() res,
        @User() payload: JwtPayload,
        @Param('candidate_id') candidate_id: string,
        @Query() _documentFilterParamDto: DocumentFilterParamDto,
    ): Promise<BaseResponse<CandidateDocumentList>> {
        const response: BaseResponse<CandidateDocumentList> = {
            success: true,
            data: await this.candidateDocumentService.getListDocumentCandidate(candidate_id, _documentFilterParamDto)
        }
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Post('send/:candidate_id/inviteCandidateAssessment')
    @UseGuards(JWTAuthGuard)
    @ApiResponse({
        status: HttpStatus.OK,
        type: AssessmentReport,
        description: 'API to add inviteCandidateAssessment'
    })
    @ApiOperation(GetOperationId('candidate', 'inviteCandidateAssessment', 'API to inviteCandidateAssessment'))
    async inviteCandidateAssessment(
        @Res() res,
        @User() payload: JwtPayload,
        @Param('candidate_id') candidate_id: string,
        @Body() _InCandidateJobAssessmentDto: InCandidateAssessmentDto): Promise<BaseResponse<CandidateJobListDto>> {
        const response: BaseResponse<AssessmentReport> = {
            success: true
        }
        try {
            _InCandidateJobAssessmentDto.candidate_id = candidate_id
            const agencyInfo = await this.agencyService.getAgencyDetail(payload.agency_id)
            const results = await this.candidateAssessmentService.sendInviteToAssessment(payload, _InCandidateJobAssessmentDto, agencyInfo, false)
            if (!results) {
                response.success = false
                response.error = { message: 'ERROR' }
                return res.status(HttpStatus.OK).json(response)
            }
            response.data = results
        } catch (e) {
            response.success = false
            response.error = e
        }
        return res.status(HttpStatus.OK).json(response)
    }

    @Get('sync_assessment_score/:assessment_id')
    @ApiOperation(GetOperationId('candidate', 'sync_assessment_score', 'API to sync assessment score'))
    async syncCandidateAssessmentScore(
        @Res() res,
        @Param('assessment_id') assessment_id: string,

    ): Promise<BaseResponse<any>> {

        const response: BaseResponse<any> = {
            success: true,
            data: await this.candidateAssessmentService.syncCandidateAssessmentScore(assessment_id)
        }
        return res.status(HttpStatus.OK).json(response)
    }

    @Post('re-send/:assessment_id/assessment-invite')
    @ApiOperation(GetOperationId('candidate', 'reSendAssessmentInvite', 'API to reSendAssessmentInvite'))
    async reSendAssessmentInvite(
        @Res() res,
        @Param('assessment_id') assessment_id: string
    ): Promise<BaseResponse<any>> {

        const response: BaseResponse<any> = {
            success: true,
            data: await this.candidateAssessmentService.reSendAssessmentInvite(assessment_id)
        }
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Get(':candidate_id/download_candidate_document/:file_id')
    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard)
    @Header('content-type', 'application/octet-stream')
    async download(
        @Res() res,
        @User() payload: JwtPayload,
        @Param('candidate_id') candidate_id: string,
        @Param('file_id') file_id: string,
    ) {
        try {
            const candidate = this.candidateService.findById(payload, candidate_id)
            if (!candidate) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: 'candidate_not_found',
                })
            }
            const document = await this.candidateDocumentService.getById(file_id)
            if (!document) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: 'document_not_found',
                })
            }
            const documentFile = this.candidateDocumentService.downloadCandidateDoc(payload.agency_id.toString(), document.file_md5, candidate_id).on('error', (error) => {
                this.logger.error(
                    `unable to get file from ${payload.agency_id.toString()}/candidate_${candidate_id}/${document.file_md5}`
                )
                this.logger.error(error)
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: 'file_not_found',
                })
            })

            documentFile.pipe(res)
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error,
            })
        }
    }

    @HttpCode(HttpStatus.OK)
    @Get(':invite_token/download_candidate_document')
    @ApiBearerAuth()
    @Header('content-type', 'file/doc')
    async downloadByToken(
        @Res() res,
        @User() payload: JwtPayload,
        @Param('invite_token') invite_token: string,
    ) {
        try {
            const document = await this.candidateDocumentService.downloadCandidateDocByInviteToken(invite_token, payload)

            res.pipe(document)
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error
            })
        }
    }

    @HttpCode(HttpStatus.OK)
    @Get('assessment-report/generate')
    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard)
    @ApiResponse({
        status: HttpStatus.OK,
        type: AssessmentReport,
        description: 'API to generate Assessment report as PDF'
    })
    async generateAssessmentPdf(
        @Res() res: any,
        @User() payload: JwtPayload,
        @Query() query: GenerateReportQuery
    ): Promise<Buffer> {
        if (!query.candidate_id.length)
            throw new HttpException('CANDIDATE_ID_REQUIRED', HttpStatus.BAD_REQUEST)

        const zip = new AdmZip()
        if (query.candidate_id.length === 1) {
            const candidateFile: ZipExportPdfDto = await this.candidateService.exportPdf(query.candidate_id[0], '', query.job_id)
            const filename = await this.candidateService.generateExportFileName(query.candidate_id[0], query.job_id)
            res.set({
                // zip
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=${filename}`,
                'Content-Length': candidateFile.buffer.length,

                // prevent cache
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0
            })

            return res.status(200).send(candidateFile.buffer)
        }
        const exportProcess = query.candidate_id.map(async candidateId => {
            const candidateFile: ZipExportPdfDto = await this.candidateService.exportPdf(candidateId, '', query.job_id)
            zip.addFile(candidateFile.fileName, candidateFile.buffer)
        })
        await Promise.all(exportProcess)

        const zipFile = zip.toBuffer()
        res.set({
            // zip
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename=CandidateReport.zip',
            'Content-Length': zipFile.length,

            // prevent cache
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': 0
        })

        return res.status(200).send(zipFile)
    }

    @HttpCode(HttpStatus.OK)
    @Get('assessment-report/client-contact')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: AssessmentReport,
        description: 'API to generate Assessment report as PDF based on invite token and client contact Id'
    })
    async generateAssessmentPdfOnInviteToken(
        @Res() res: any,
        @Query() query: GenerateReportInviteTokenQuery
    ): Promise<Buffer> {

        if (query?.candidate_id.length === 1) {
            const candidateFile: ZipExportPdfDto = await this.candidateService.exportPdfWithToken(query.candidate_id[0], query.invite_token)
            const filename = await this.candidateService.generateExportFileName(query.candidate_id[0], '', query.invite_token)
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=${filename}`,
                'Content-Length': candidateFile.buffer.length,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0
            })

            return res.status(200).send(candidateFile.buffer)
        }
        const zipFile = await this.candidateService.generateZipFolder(query)
        res.set({
            // zip
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename=CandidateReport.zip',
            'Content-Length': zipFile.length,

            // prevent cache
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': 0
        })

        return res.status(200).send(zipFile)
    }

    @HttpCode(HttpStatus.OK)
    @Get('assessment_report_file/:assessment_id')
    @Header('Content-Type', 'application/zip')
    @ApiOperation(GetOperationId('candidate', 'assessment_report', 'API to get assessment report'))
    async assessmentReportZip(
        @Res() res,
        @Param('assessment_id') assessment_id: string
    ) {
        const data = await this.tpTestsIntegrateService.getAssessmentReportsZip(assessment_id)
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=assessment-report${assessment_id}.zip`
        )
        data.pipe(res)
    }

}