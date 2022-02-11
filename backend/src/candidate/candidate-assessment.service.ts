import { forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { FilterQuery, ObjectId } from 'mongodb'
import { BinaryLike, createHash } from 'crypto'
import { InjectModel } from 'nestjs-typegoose'
import { Types } from 'mongoose'
import { v1, v4 } from 'uuid'
import * as _ from 'lodash'

import { AssessmentReport, Candidate } from 'src/schemas/candidate.schema'

import { CandidateService } from './candidate.service'
import { MailService } from 'src/mail/mail.service'
import { TPTestsIntegrateService } from 'src/tptests/tptestsintegrate.service'
import { ConfigurationService } from 'src/shared/configuration/configuration.service'

import { JwtPayload } from 'src/auth/dto/login'
import { TPGetAssessmentsStatusResponse } from 'src/tptests/dto/response.mode'
import { TPCreateCandidateRequest } from 'src/tptests/dto/request.model'
import { FilterAssessmentReport, InCandidateAssessmentDto } from './dto/input'
import { OutCandidateJobAssessmentInvite } from './dto/candidate'
import { OutAssessmentReportDto, OutSyncCandidateAssessmentsDto, TopAssessmentReportDto } from './dto/output'
import { Agency } from 'src/schemas/agency.schema'
import { User } from 'src/schemas/user.schema'
import { SubscriptionService } from 'src/agency/agency_subscription.service'
import { SocketService } from '../notification/socket.service'
import { NotificationType } from '../schemas/notification.schema'
import { MailType } from 'src/schemas/mailLog.schema'
import { UsersService } from '../user/user.service'
import { AgencyInfoDto } from 'src/agency/dto/agency'

export const md5 = (contents: BinaryLike) => createHash('md5').update(contents).digest('hex')

@Injectable()
export class CandidateAssessmentService {
    constructor(
        @InjectModel(AssessmentReport) private readonly repo: ReturnModelType<typeof AssessmentReport>,
        //@Inject(forwardRef(() => CandidateJobService)) private readonly candidateJobService: CandidateJobService,
        private readonly coreConfig: ConfigurationService,
        private readonly mailService: MailService,

        private readonly tpTestsIntegrateService: TPTestsIntegrateService,
        private readonly socketService: SocketService,
        @Inject(forwardRef(() => CandidateService)) private readonly candidateService: CandidateService,
        private readonly subscriptionService: SubscriptionService,
        @Inject(forwardRef(() => UsersService)) private readonly userService: UsersService,
        //private readonly candidateService: CandidateService
    ) { }
    private readonly logger = new Logger(CandidateAssessmentService.name)
    public async countAPIUsage(agency_id: string, userId: string) {
        const currentMonth = new Date().getMonth() + 1
        const currentYear = new Date().getFullYear()
        //count parsing by month
        const queryBuilder: any[] = [
            { $expr: { $eq: [{ $month: '$created_at' }, currentMonth] } },
            { $expr: { $eq: [{ $year: '$created_at' }, currentYear] } },
            { agency: new ObjectId(agency_id), created_by: new ObjectId(userId) }
        ]
        return await this.repo.countDocuments({ $and: queryBuilder })
    }
    async sendInviteToAssessment(payload: JwtPayload, candidateJob: InCandidateAssessmentDto, agencyInfo: AgencyInfoDto, isCheckLimit?: boolean) {
        const model = new this.repo()
        const currentUsage = await this.countAPIUsage(payload.agency_id, payload.id)
        const agency_package = await this.subscriptionService.getSubscription(payload.agency_id)
        if(!agency_package){
            throw new HttpException('MAX_ASSESSMENT_LIMIT', HttpStatus.FORBIDDEN)
        } 
        if ((isCheckLimit && agency_package && agency_package.package_id)) {
            if (currentUsage >= agency_package.package_id.max_assessment_limit) {
                throw new HttpException('MAX_ASSESSMENT_LIMIT', HttpStatus.FORBIDDEN) 
            }
        }
        const candidate = await this.candidateService.findById(payload, candidateJob.candidate_id)
        // const existingObj = await this.repo.findOne({
        //     candidate: new ObjectId(candidate.id),
        //     job: new ObjectId(candidateJob.job_id)
        // }).exec()
        // if (existingObj && existingObj.id) {
        //     throw new HttpException('CANDIDATE_ALREADY_INVITED', HttpStatus.BAD_REQUEST)
        // }
        //const project_assessment = await this.projectAssessmentService.getProjectAssessmentByKey(candidateJob.project_assessment)
        if (!candidate || !candidate.candidate_email) {
            return null
        }
        model.tp_username = v1()
        
        //const tpCandidate = await this.tpTestsIntegrateService.IsCandidateExist(candidate.tp_username)
        const createTPCandidateDto = new TPCreateCandidateRequest()
        createTPCandidateDto.Email = candidate.candidate_email || `${model.tp_username}@example.com`
        const firstName = candidate.candidate_name?.split(' ').slice(0, -1).join(' ')
        const lastName = candidate.candidate_name?.split(' ').slice(-1).join(' ')
        createTPCandidateDto.FirstName = firstName || candidate.candidate_email

        createTPCandidateDto.LastName = lastName || new Date().getTime().toString()
        createTPCandidateDto.Username = model.tp_username
        createTPCandidateDto.ProjectAccessKey = this.coreConfig.tp_test_config.tp_project_key //candidateJob.project_assessment
        createTPCandidateDto.Password = v4()
        model.tp_password = createTPCandidateDto.Password
        
        //console.log(candidate)v
        model.candidate = Types.ObjectId(candidateJob.candidate_id)
        //model.project_assessment = project_assessment.id
        const createdAssessmentCandidate = await this.tpTestsIntegrateService.createCandidate(createTPCandidateDto, model)
        if (!(createdAssessmentCandidate && createdAssessmentCandidate.Errors.length === 0)) {
            this.logger.warn(createdAssessmentCandidate.Errors)
            throw new HttpException(createdAssessmentCandidate.Errors[0].Message, HttpStatus.BAD_REQUEST)
        }
        //candidate.assessment_invite_link = 
        const assessmentLink = `${this.coreConfig.tp_test_config.base_url}/?&user=${model.tp_username}&pass=${model.tp_password}`

        // if (tpCandidate != 'True')
        //     await this.candidateService.linkCandidateAssessment(candidateJob.candidate_id, createTPCandidateDto, assessmentLink)

        if (candidateJob.job_id)
            model.job = Types.ObjectId(candidateJob.job_id)
        model.agency = Types.ObjectId(payload.agency_id)
        model.created_by = Types.ObjectId(payload.id)
        model.assessment_id = createdAssessmentCandidate.Assessment.Id
        model.tests = createdAssessmentCandidate.Assessment.Tests
        if (candidateJob.industry && ObjectId.isValid(candidateJob.industry))
            model.industry = Types.ObjectId(candidateJob.industry)
        if (candidateJob.type && ObjectId.isValid(candidateJob.type))
            model.type = Types.ObjectId(candidateJob.type)
        await model.save()
        const mailDto = new OutCandidateJobAssessmentInvite()
        mailDto.assessment_link = assessmentLink
        mailDto.assessment_id = model.assessment_id
        mailDto.assessment_name = this.coreConfig.tp_test_config.TP_PROJECT_NAME
        mailDto.candidate_email = candidate.candidate_email
        await this.mailService.sendInviteAssessment(mailDto, payload, candidateJob, agencyInfo)
        // Notice monthly talent assessment
        const user = await this.userService.findOne({
            agency_id: new ObjectId(payload.agency_id),
            role: 'agency'
        })
        const reaches = this.coreConfig.assementUsageReaches
        if (user && reaches) {
            if (currentUsage === agency_package.package_id.max_assessment_limit) {
                await this.socketService.makeNotification(
                    user.id,
                    'Monthly Talent Assessment Usage Exceeded!',
                    `Please be mindful that your agency has reached your monthly talent assessment limit. 
                        Upgrade to the next tier level to increase your limit`,
                    NotificationType.TALENT_ASSESSMENT
                )
            }
            if (Math.round(currentUsage / agency_package.package_id.max_assessment_limit * 100) >= reaches) {
                await this.socketService.sendSingleNoticeInMonthly(
                    user.id,
                    'Monthly Talent Assessment Usage Alert!',
                    `Please be mindful that your agency has used ${reaches}% of the total monthly Talent Assessment Usage.`,
                    NotificationType.TALENT_ASSESSMENT_REACHES
                )
            }
        }
        return model
    }
    async reSendAssessmentInvite(assessment_id: string) {
        try {
            const mail = await this.mailService.findMailByRefId(assessment_id, MailType.InviteAssessmentCandidate)
            if (mail) {
                await this.mailService.Send(mail)
            }
        } catch (error) {

        }
    }
    async saveAssessmentReport(assessment_id, tpReport: TPGetAssessmentsStatusResponse) {
        this.repo.findOneAndUpdate({
            assessment_id: assessment_id
        }, {
            status: tpReport.Status,
            submission_date: tpReport.SubmissionDate,
            score: tpReport.Score,
            tests: tpReport.Tests
            //tp_username: assessmentRequest.Username,
        }, { new: true }).then(result => {
            this.logger.error(result)
            //if (!result) throw new HttpException('CANDIDATE_NOT_FOUND', HttpStatus.NOT_FOUND)
            //result
        })
    }
    private async syncCandidateAssessmentList(list: AssessmentReport[], forced?: boolean) {
        const promises = list.map(async assessmentReport => {

            if (['Pending', 'Not Started', 'In Progress'].indexOf(assessmentReport.status) > -1 && !forced) {
                return this.syncCandidateAssessmentStatus(assessmentReport)
            } else {
                console.log('syncCandidateAssessmentList')
                return this.syncCandidateAssessmentScore(assessmentReport.assessment_id)
            }

        })
        return await Promise.all(promises)
    }
    async syncCandidateAssessmentStatus(report: AssessmentReport) {

        const candidateReportStatus = await this.tpTestsIntegrateService.getAssessmentStatus(report.assessment_id)

        if (candidateReportStatus && candidateReportStatus.Errors.length > 0) return null
        await this.saveAssessmentReport(report.assessment_id, candidateReportStatus)
        candidateReportStatus.assessment_id = report.assessment_id
        /* Notification assessment started */
        if (candidateReportStatus.Status === 'In Progress') {
            const assessment = await this.repo.findOne({
                assessment_id: report.assessment_id
            })
            const tp_project_name = this.coreConfig.tp_test_config.TP_PROJECT_NAME
            const candidate = await this.candidateService.findOne(
                assessment.candidate.toString()
            )
            if (assessment) {
                await this.socketService.makeNotification(
                    assessment.created_by.toString(),
                    `${candidate?.candidate_name} has started the assessment`,
                    `${candidate?.candidate_name} started the assessment ${tp_project_name}`,
                    NotificationType.CANDIDATE_START_ASSETMENT
                )
            }
        }

        return candidateReportStatus
    }
    async syncCandidateAssessmentScore(assessment_id: string) {

        const candidateReportStatus = await this.tpTestsIntegrateService.getAssessmentScore(assessment_id)
        if (candidateReportStatus && candidateReportStatus.Errors.length > 0) {
            this.logger.warn(candidateReportStatus.Errors)
            return null
        }

        await this.saveAssessmentReport(assessment_id, candidateReportStatus)
        candidateReportStatus.assessment_id = assessment_id
        /* Notification assessment Submitted */
        if (candidateReportStatus.Status === 'Submitted') {
            const assessment = await this.repo.findOne({
                assessment_id: assessment_id
            })
            // const project = await this.projectAssessmentService.getProjectAssessmentById(
            //     assessment.project_assessment.toString()
            // )
            const tp_project_name = this.coreConfig.tp_test_config.TP_PROJECT_NAME
            const candidate = await this.candidateService.findOne(
                assessment.candidate.toString()
            )
            if (assessment) {
                await this.socketService.makeNotification(
                    assessment.created_by.toString(),
                    `Candidate ${candidate?.candidate_name} has completed the assessment`,
                    `${candidate?.candidate_name} has completed the assessment ${tp_project_name}. 
                    Please preview the reports via the candidate dashboard.`,
                    NotificationType.CANDIDATE_COMPLETE_ASSETMENT
                )
            }
        }
        return candidateReportStatus
    }
    async syncCandidateId(candidate_id: string) {
        try {
            const assessmentReportList = await this.repo.find({ tp_username: candidate_id }).exec()

            if (assessmentReportList) {
                await this.syncCandidateAssessmentList(assessmentReportList, true)
            }
        } catch (error) {

        }
    }
    async syncCandidateAssessments(status: string[]) {
        //Submitted 
        const list: AssessmentReport[] = await this.repo.find({ status: { $in: status } }).populate(['candidate', 'created_by', 'agency']).exec()
        let skipCount = 0
        const takeCount = 10
        let response: OutSyncCandidateAssessmentsDto[] = []
        let skipList = _.take(_.drop(list, skipCount), takeCount)
        while (skipList.length > 0) {
            const reportStatus = await this.syncCandidateAssessmentList(skipList)
            const mapStatus = skipList.map(x => {
                const dto = new OutSyncCandidateAssessmentsDto()
                dto.agency = (x.agency as Agency)
                dto.created_by = (x.created_by as User)
                dto.candidate = (x.candidate as Candidate)
                dto.assessment_id = x.assessment_id
                const status = reportStatus.find(r => r.assessment_id == x.assessment_id)
                if (status) {
                    dto.status = status.Status
                }
                return dto
            })
            response = response.concat(mapStatus)
            skipCount += takeCount
            skipList = _.take(_.drop(list, skipCount), takeCount)
        }
        return response
    }
    async getCandidateAssessmentDetail(candidate_id: string, job_id: string) {
        return this.repo.find({
            candidate: Types.ObjectId(candidate_id),
            job: Types.ObjectId(job_id)
        })
    }

    public async countAssessmentReportById(agency_id: string, user_id?: string) {
        const currentMonth = new Date().getMonth() + 1
        const currentYear = new Date().getFullYear()
        const queryBuilderInnerTotal: any[] = [
        ]
        const queryBuilderInnerMonth: any[] = [
            { $expr: { $eq: [{ $month: '$updated_at' }, currentMonth] } },
            { $expr: { $eq: [{ $year: '$updated_at' }, currentYear] } },
        ]
        const queryBuilderInnerYear: any[] = [
            { $expr: { $eq: [{ $year: '$updated_at' }, currentYear] } },
        ]
        if (agency_id) {
            queryBuilderInnerMonth.push({ agency: new ObjectId(agency_id) })
            queryBuilderInnerYear.push({ agency: new ObjectId(agency_id) })
            queryBuilderInnerTotal.push({ agency: new ObjectId(agency_id) })
        }
        if (user_id) {
            queryBuilderInnerMonth.push({ created_by: new ObjectId(user_id) })
            queryBuilderInnerYear.push({ created_by: new ObjectId(user_id) })
            queryBuilderInnerTotal.push({ created_by: new ObjectId(user_id) })
        }

        const queryBuilderByMonth: FilterQuery<AssessmentReport> = {
            $and: queryBuilderInnerMonth
        }
        const queryBuilderByYear: FilterQuery<AssessmentReport> = {
            $and: queryBuilderInnerYear
        }
        const queryBuilderTotal: FilterQuery<AssessmentReport> = {
            $and: queryBuilderInnerYear
        }

        const totalAssessmentReportByMonth = await this.repo.countDocuments(queryBuilderByMonth)

        const totalAssessmentReportByYear = await this.repo.countDocuments(queryBuilderByYear)
        const totalAssessmentReport = await this.repo.countDocuments(queryBuilderTotal)
        return { totalAssessmentReportByMonth, totalAssessmentReportByYear, totalAssessmentReport }
    }

    async countAssessmentReport(_filterAssessmentReport: FilterAssessmentReport): Promise<OutAssessmentReportDto> {

        let match = {}
        let filter = {}
        if (_filterAssessmentReport.agency_id && _filterAssessmentReport.from_date && _filterAssessmentReport.to_date) {
            match = { 'stringDate': { '$gte': _filterAssessmentReport.from_date, '$lte': _filterAssessmentReport.to_date }, agency: new ObjectId(_filterAssessmentReport.agency_id) }
            filter = {
                created_at: { $gte: _filterAssessmentReport.from_date, $lte: _filterAssessmentReport.to_date },
                agency: new ObjectId(_filterAssessmentReport.agency_id)
            }
        }
        else {
            match = {
                'stringDate': { '$gte': _filterAssessmentReport.from_date, '$lte': _filterAssessmentReport.to_date }
            }
            filter = {
                created_at: { $gte: _filterAssessmentReport.from_date, $lte: _filterAssessmentReport.to_date }
            }
        }
        const totalAssessmentReports = await this.repo.countDocuments(filter)
        const topAssessmentReport = await this.repo.aggregate([
            {
                $lookup: {
                    from: 'agencies',       // other table name
                    localField: 'agency',   // name of users table field
                    foreignField: '_id', // name of userinfo table field
                    as: 'user_info'         // alias for userinfo table
                }
            }, { $unwind: '$user_info' },
            { $addFields: { stringDate: { $dateToString: { format: '%Y-%m-%d', date: '$updated_at' } } } },
            { $match: { ...match } },
            { $group: { _id: { agency_id: '$agency', agency_name: '$user_info.agency_name' }, count: { $sum: 1 } } },
            { $sort: { 'count': -1 } }, { $limit: 10 }
        ])

        const topAssessment = topAssessmentReport.map(x => {
            const dto = new TopAssessmentReportDto()
            dto.agency_id = x._id.agency_id
            dto.count = x.count
            dto.agency_name = x._id.agency_name
            return dto
        })

        return { totalAssessmentReports, topAssessmentReport: topAssessment }
    }
}
