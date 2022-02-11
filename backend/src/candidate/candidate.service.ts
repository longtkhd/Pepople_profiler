import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    Logger,
} from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { renderFile } from 'ejs'
import { ObjectId } from 'mongodb'
import { QueryPopulateOptions, Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'

import {
    Axes,
    Data as RadarData,
    generateRadarChart,
    RadarChart,
} from 'radarchart-node'
import { serialize } from 'class-transformer'
import { BarChart, BarChartData, generateString } from 'barchart-node'

import * as puppeteer from 'puppeteer'
import * as AdmZip from 'adm-zip'

import { SubscriptionService } from 'src/agency/agency_subscription.service'
import { JwtPayload } from 'src/auth/dto/login'
import { DaxtraIntegrationService } from 'src/daxtra.Integration/daxtra-integration.service'
import { DaxtraCVParserResponseDto } from 'src/daxtra.Integration/dto/response.dto'

import {
    AssessmentReport,
    Candidate,
    CandidateJob,
} from 'src/schemas/candidate.schema'
import { FileInput, SortDirection } from 'src/shared/base.dto'
import { ConfigurationService } from 'src/shared/configuration/configuration.service'
import { MapperService } from 'src/shared/mapper/mapper.service'
import { CandidateDocumentService } from './candidate-document.service'
import {
    CandidateDetailDto,
    CandidateFilterParamDto,
    CandidateInfo,
    CandidateListDto,
    CandidateParseResult,
} from './dto/candidate'
import { CVParserFieldDto, GenerateReportInviteTokenQuery } from './dto/input'
import {
    AssessmentReportChartDto,
    CompetenceRadarSVG,
    ZipExportPdfDto,
} from './dto/output'
import { CandidateJobService } from './job-candidate.service'
import { Job, JobClientContact } from 'src/schemas/job.schema'
import { S3ManagerService } from 'src/aws/s3-manager.service'
import { SocketService } from '../notification/socket.service'
import { NotificationType } from '../schemas/notification.schema'
import { UsersService } from '../user/user.service'
import { Client, ClientContact } from 'src/schemas/client.schema'
import { JSDOM } from 'jsdom'

import { Agency } from 'src/schemas/agency.schema'
import { PDFDocument } from 'pdf-lib'
import { JobService } from 'src/job/job.service'
import { InterviewTimeService } from 'src/interviewTime/interviewTime.service'

@Injectable()
export class CandidateService {
    constructor(
        @InjectModel(Candidate)
        private readonly repo: ReturnModelType<typeof Candidate>,
        @InjectModel(CandidateJob)
        private readonly CandidateJobModel: ReturnModelType<
            typeof CandidateJob
        >,
        @InjectModel(JobClientContact)
        private readonly JobClientContactModel: ReturnModelType<
            typeof JobClientContact
        >,
        @InjectModel(Job)
        private readonly JobModal: ReturnModelType<typeof Job>,
        @InjectModel(Agency)
        private readonly AgencyModal: ReturnModelType<typeof Agency>,
        private readonly coreConfig: ConfigurationService,
        private readonly subscriptionService: SubscriptionService,
        private readonly mapperService: MapperService,
        private readonly s3Service: S3ManagerService,
        private readonly socketService: SocketService,
        private readonly jobService: JobService,
        private readonly candidateDocumentService: CandidateDocumentService,
        private readonly userService: UsersService,
        @Inject(forwardRef(() => DaxtraIntegrationService))
        private readonly daxtraIntegrationService: DaxtraIntegrationService,
        @Inject(forwardRef(() => CandidateJobService))
        private readonly candidateJobService: CandidateJobService,
        private readonly interviewTimeService: InterviewTimeService,
        @InjectModel(Candidate)
        private readonly candidateModel: ReturnModelType<typeof Candidate>,
    ) {
        this.mapperService.createMap(Candidate.name, CandidateInfo.name)
        this.mapperService.createMap(Candidate.name, CandidateDetailDto.name)
    }
    private readonly logger = new Logger(CandidateService.name);

    public async getCandidateDetail(
        id: string,
        payload: JwtPayload,
        populate?: QueryPopulateOptions[],
    ) {
        const candidate = await this.repo
            .findOne({
                _id: Types.ObjectId(id),
                agency_id: Types.ObjectId(payload.agency_id),
            })
            .populate(populate)
            .exec()
        if (!candidate) {
            return null
        }
        const res = this.mapperService.map<CandidateInfo>(
            candidate,
            CandidateInfo.name,
            Candidate.name,
        )
        return res
    }
    public async findById(payload: JwtPayload, id: string) {
        return await this.repo
            .findOne({
                _id: Types.ObjectId(id),
                agency_id: Types.ObjectId(payload.agency_id),
            })
            .exec()
    }

    public async findOne(id: string) {
        return await this.repo
            .findOne({
                _id: Types.ObjectId(id),
            })
            .exec()
    }

    public async findByIdFilter(_id: string, filter = {}) {
        return await this.repo
            .findOne({
                _id: Types.ObjectId(_id),
                ...filter,
            })
            .exec()
    }

    public async paginateCandidateList(
        filter: CandidateFilterParamDto,
    ): Promise<CandidateListDto> {
        try {
            const list = await this.repo.paginate(
                filter.buildFilterQuery(),
                filter.buildPagingQuery(),
            )
            const result = new CandidateListDto(filter.page, filter.size)

            result.total = list.totalDocs
            result.candidate_list = []
            if (!list.totalDocs) {
                return result
            }
            // userList[0]
            const mapJob = list.docs.map((j) =>
                this.mapperService.map<CandidateInfo>(
                    j,
                    CandidateInfo.name,
                    Candidate.name,
                ),
            )
            result.candidate_list = mapJob
            result.size = mapJob.length
            return result
        } catch (error) {
            this.logger.error(error)
        }
    }
    private extractCandidateInfo(
        parsedCV: DaxtraCVParserResponseDto,
    ): CVParserFieldDto {
        try {
            const result = new CVParserFieldDto()
            if (!parsedCV || !parsedCV.Resume) return result

            result.text_resume = parsedCV.Resume.TextResume
            if (parsedCV.Resume.StructuredResume) {
                if (parsedCV.Resume.StructuredResume.ContactMethod) {
                    const ContactMethod =
                        parsedCV.Resume.StructuredResume.ContactMethod
                    result.email = ContactMethod.InternetEmailAddress_main
                    result.phone =
                        ContactMethod.Telephone_home ||
                        ContactMethod.Telephone_mobile
                    result.InternetWebAddress =
                        ContactMethod.InternetWebAddress
                    result.PostalAddress_main =
                        ContactMethod.PostalAddress_main
                }

                if (parsedCV.Resume.StructuredResume.PersonName) {
                    result.name =
                        parsedCV.Resume.StructuredResume.PersonName.FormattedName
                }

                if (
                    parsedCV.Resume.StructuredResume.EmploymentHistory &&
                    parsedCV.Resume.StructuredResume.EmploymentHistory.length >
                    0
                ) {
                    const currentEmployment =
                        parsedCV.Resume.StructuredResume.EmploymentHistory[0]

                    result.current_employer =
                        currentEmployment.EmployerOrgName ||
                        currentEmployment.OrgName
                    result.current_possition = currentEmployment.Title
                        ? currentEmployment.Title.join(', ')
                        : undefined
                }
            }
            if (parsedCV.Resume.StructuredResume) {
                const ExecutiveSummary =
                    parsedCV.Resume.StructuredResume.ExecutiveSummary
                result.executiveSummary = ExecutiveSummary
            }

            return result
        } catch (error) { }
    }
    private tranformBodyCV2(jsdom, element) {
        // loop through all the nodes of the element
        const nodes = element.childNodes

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i]

            const nodeName = node.nodeName
            let nodeText = node.innerHTML
            if (nodeText) {
                if (nodeText && nodeText.indexOf('') > -1) {
                    nodeText = nodeText.replace(
                        //g,
                        '&nbsp; &nbsp;-&nbsp;&nbsp;',
                    )
                }
                nodeText = nodeText.replace(/&nbsp; &nbsp; &nbsp;/g, '')
                node.innerHTML = nodeText
            }
            // if it's an element, repeat this process
            if (node.nodeType == 1) {
                if (nodeName && nodeName.toUpperCase() == 'STYLE') {
                    node.outerHTML = ''
                    continue
                }
                if (nodeName && nodeName.toUpperCase() == 'UL') {
                    node.outerHTML = this.getInnerUl(jsdom, node).outerHTML
                }
                this.applyComputeStyleElement(jsdom, node)
                this.tranformBodyCV2(jsdom, node)
            }
        }
    }

    private getInnerUl(jsdom, element) {
        try {
            const nodes = element.childNodes
            this.applyComputeStyleElement(jsdom, element)
            this.tranformBodyCV2(jsdom, element)
            if (nodes.length > 1) return element
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i]

                const nodeName = node.nodeName
                if (node.nodeType == 1) {
                    if (nodeName && nodeName.toUpperCase() == 'LI') {
                        const cnodes = node.childNodes
                        for (let j = 0; i < cnodes.length; j++) {
                            const ccnode = cnodes[j]

                            if (
                                ccnode &&
                                ccnode.nodeName.toUpperCase() == 'UL'
                            ) {
                                return this.getInnerUl(jsdom, ccnode)
                            }

                            return node
                        }
                    }
                }
            }
        } catch (error) {
            return element
        }
    }
    private tranformBodyCV(jsdom) {
        const document = jsdom.window.document
        //const window = jsdom.window
        const items = document.body.getElementsByTagName('*')
        for (let i = 0, len = items.length; i < len; i++) {
            let nodeText = items[i].innerHTML
            const nodeName = items[i].nodeName

            if (nodeName && nodeName.toUpperCase() == 'STYLE') {
                items[i].innerHTML = ''
                continue
            }
            this.applyComputeStyleElement(jsdom, items[i])

            if (
                nodeText &&
                !(nodeText.startsWith('<') && nodeText.endsWith('>'))
            ) {
                if (nodeText.indexOf('') > -1) {
                    nodeText = nodeText.replace(
                        //g,
                        '&nbsp; &nbsp;-&nbsp;&nbsp;',
                    )
                }
                nodeText = nodeText.replace(/&nbsp; &nbsp; &nbsp;/g, '')
                items[i].innerHTML = nodeText
            }
        }
    }
    private applyComputeStyleElement(jsdom, elem) {
        const document = jsdom.window.document
        const window = jsdom.window

        if (!elem) return [] // Element does not exist
        const win = document.defaultView || window
        let style: any = {}
        let cssText = ''
        const nodeName = elem.nodeName
        // const allowcss = ['text-decoration', 'line-height', 'color', 'text-color', 'font-weight', 'font-style',
        //     'background-color', 'list-style-type', 'list-style', 'font-variant', 'line-height', 'height', 'width',
        //     'margin-right', 'margin-left', 'margin-top', 'margin-bottom', 'margin',
        //     'padding-right', 'padding-left', 'padding-top', 'padding-bottom', 'padding']
        const skipCss = ['text-align']
        //const skipCss = []
        const styleNode = []
        if (win.getComputedStyle) {
            /* Modern browsers */
            style = win.getComputedStyle(elem, '')

            for (let i = 0; i < style.length; i++) {
                let style_value = style.getPropertyValue(style[i])

                if ('font-family' === style[i]) {
                    style_value = 'Muli'
                }
                if (nodeName && nodeName.toLowerCase() == 'ul') {
                    console.log(nodeName)
                    cssText += 'list-style:none;'
                    styleNode.push('list-style:none;')
                }
                style_value = style_value
                    .replace('! important', '')
                    .replace('!important', '')
                if (!(skipCss.indexOf(style[i]) > -1)) {
                    if (style_value != '0px') {
                        cssText += style[i] + ':' + style_value + ';'
                        styleNode.push(style[i] + ':' + style_value)
                    }
                }
            }

            elem.style.cssText = cssText
            //console.log('->>', elem.innerHTML)
        }
        return styleNode
    }
    public async uploadNewCandidate(
        cvs: FileInput[],
        job_id: string,
        payload: JwtPayload,
    ): Promise<CandidateParseResult[]> {
        try {
            let parsedFiles = {}
            if (!cvs) return []
            const agency_package =
                await this.subscriptionService.getSubscription(
                    payload.agency_id,
                )
            let countParsing = await this.daxtraIntegrationService.countParsing(
                payload.agency_id,
                payload.id,
            )
            let batchKey = undefined
            let parse_status = 'OK'
            //const enable_plan_validate = this.coreConfig.enable_plan_validate
            const skip_valid_parse = false
            if (
                skip_valid_parse ||
                (agency_package && agency_package.package_id)
            ) {
                batchKey = await this.daxtraIntegrationService.parseBatch(cvs)
                if (batchKey) {
                    parsedFiles =
                        await this.daxtraIntegrationService.processBatch(
                            batchKey,
                            cvs,
                            payload,
                        )
                }
                if (
                    skip_valid_parse ||
                    countParsing + cvs.length <=
                    agency_package.package_id.max_cv_parsing
                ) {
                    countParsing = countParsing + cvs.length
                } else {
                    parse_status = 'excess_max_parsing_count'
                }
            }
            let uploadedInfo: CandidateParseResult[] = []
            const promises = cvs.map(async (file) => {
                if (!file || !file.originalname) return undefined
                const parsedCV =
                    parsedFiles && parsedFiles[file.originalname]
                        ? parsedFiles[file.originalname]
                        : undefined
                const candidateInfo = this.extractCandidateInfo(parsedCV)

                const htmlCV = await this.daxtraIntegrationService.convert2Html(
                    file,
                )
                //let style_resume = []
                let resume_body_html = undefined
                if (htmlCV) {
                    const domCV = new JSDOM(htmlCV)

                    this.tranformBodyCV2(domCV, domCV.window.document.body)
                    //style_resume = styleList.map((x: any) => x.innerHTML)
                    const bodyCV = domCV.window.document.body
                    resume_body_html = bodyCV.innerHTML
                }

                const nCandidate = new this.repo()
                nCandidate.summaries = []
                nCandidate.summaries.push({
                    title: 'Why is this candidate interested in this role?',
                    description: '',
                })
                if (!candidateInfo) {
                    nCandidate.summaries.push({
                        title: 'Candidate background',
                        description: '',
                    })
                } else {
                    nCandidate.candidate_name = candidateInfo.name
                    nCandidate.phone = candidateInfo.phone
                    nCandidate.postalAddress = candidateInfo.PostalAddress_main
                    nCandidate.linked_in = candidateInfo.linkedIn
                    nCandidate.candidate_email = candidateInfo.email
                    nCandidate.resume_text = resume_body_html.replace(
                        /\&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/g,
                        '',
                    )
                    nCandidate.current_employer =
                        candidateInfo.current_employer
                    nCandidate.batch_parsing_key = batchKey
                    nCandidate.current_position =
                        candidateInfo.current_possition
                    nCandidate.revision_number = 1
                    // nCandidate.resume_styles = style_resume
                    // nCandidate.resume_html = resume_body_html
                    nCandidate.summaries.push({
                        title: 'Candidate background',
                        description: candidateInfo.executiveSummary,
                    })
                }

                nCandidate.additional_infos = []
                nCandidate.additional_infos.push({
                    name: 'Portfolio',
                    value: '',
                })
                nCandidate.additional_infos.push({
                    name: 'Personal Website',
                    value: '',
                })
                nCandidate.additional_infos.push({
                    name: 'LinkedIn Profile',
                    value: candidateInfo.linkedIn,
                })

                nCandidate.agency_id = Types.ObjectId(payload.agency_id)
                nCandidate.created_by = Types.ObjectId(payload.id)
                const savedObj = await nCandidate.save()

                if (savedObj && savedObj.id) {
                    const savedJobCandidate =
                        await this.candidateJobService.addCandidateToJob(
                            payload,
                            job_id,
                            savedObj.id,
                        )
                    const uploadedDoc =
                        await this.candidateDocumentService.uploadCandidateFile(
                            file,
                            savedObj.id,
                            payload,
                            1,
                        )
                    if (savedJobCandidate && uploadedDoc) {
                        const uploaded = new CandidateParseResult()
                        uploaded.id = savedObj.id
                        uploaded.file_md5 = uploadedDoc.file_md5

                        uploaded.file_name = uploadedDoc.file_name
                        uploaded.candidate_name = nCandidate.candidate_name
                        uploaded.candidate_email = nCandidate.candidate_email
                        uploaded.current_employer = nCandidate.current_employer
                        uploaded.parse_status = parse_status
                        uploaded.current_position = nCandidate.current_position
                        return uploaded
                    }
                }

                return undefined
            })
            uploadedInfo = await Promise.all(promises)
            const user = await this.userService.findOne({
                agency_id: new ObjectId(payload.agency_id),
                role: 'agency',
            })
            const reaches = this.coreConfig.cvParsingUsageReaches
            if (user && reaches) {
                if (countParsing === agency_package.package_id.max_cv_parsing) {
                    await this.socketService.makeNotification(
                        user.id,
                        'Total Monthly CV Parsing Usage Exceeded!',
                        'Please be mindful that your agency has reached your monthly CV parsing limit. Upgrade to the next tier level to increase your limit.',
                        NotificationType.CV_PARSING,
                    )
                }
                if (
                    Math.round(
                        (countParsing /
                            agency_package.package_id.max_cv_parsing) *
                        100,
                    ) >= reaches
                ) {
                    await this.socketService.sendSingleNoticeInMonthly(
                        user.id,
                        'Monthly CV Parsing Usage Alert',
                        `Please be mindful that your agency has used ${reaches}% of the total monthly CV Parsing Usage.`,
                        NotificationType.CV_PARSING_REACHES,
                    )
                }
            }
            return uploadedInfo
        } catch (error) {
            this.logger.error(error)
            throw error
        }
    }

    // async linkCandidateAssessment(candidate_id: string, assessmentRequest: TPCreateCandidateRequest, assessment_invite_link: string) {
    //     await this.repo.findOneAndUpdate({
    //         _id: candidate_id,
    //     }, {
    //         assessment_invite_link: assessment_invite_link,
    //         tp_username: assessmentRequest.Username,
    //         tp_password: assessmentRequest.Password,
    //     }, { new: true }).then(result => {
    //         this.logger.error(result)
    //         if (!result) throw new HttpException('CANDIDATE_NOT_FOUND', HttpStatus.NOT_FOUND)
    //         result
    //     })
    //     return await this.repo.findById({ _id: candidate_id })
    // }

    async updateCandidate(
        payload: JwtPayload,
        candidate_id: string,
        info: CandidateDetailDto,
        job_id?: string,
    ): Promise<CandidateDetailDto> {
        const obj = JSON.parse(serialize(info))
        await this.repo
            .findOneAndUpdate(
                {
                    _id: candidate_id,
                    agency_id: payload.agency_id,
                },
                {
                    ...obj,
                },
                { new: true },
            )
            .then((result) => {
                //this.logger.log(result)
                if (!result)
                    throw new HttpException(
                        'CANDIDATE_NOT_FOUND',
                        HttpStatus.NOT_FOUND,
                    )
                return result
            })
        const candidate = await this.repo.findById({ _id: candidate_id })
        if (candidate) {
            if (!candidate.revision_number) {
                candidate.revision_number = 1
            }
            candidate.revision_number++
            await candidate.save()
        }
        const candidateData = this.mapperService.map<CandidateDetailDto>(
            candidate,
            CandidateDetailDto.name,
            Candidate.name,
        )

        if (obj?.recruiter_assessments && job_id) {
            const candidateJob =
                await this.candidateJobService.updateRecruiterAssessment(
                    candidate_id,
                    job_id,
                    obj?.recruiter_assessments,
                    true,
                )
            candidateData.recruiter_assessments =
                candidateJob?.recruiter_assessments
        }
        return candidateData
    }

    public async getClientCandidateReport(
        id: string,
        populate?: QueryPopulateOptions[],
    ) {
        const candidate = await this.repo
            .findOne({
                _id: Types.ObjectId(id),
            })
            .populate(populate)
            .exec()
        if (!candidate) {
            return null
        }
        const res = this.mapperService.map<CandidateDetailDto>(
            candidate,
            CandidateDetailDto.name,
            Candidate.name,
        )
        return res
    }

    async radarChartCompetenceWheel(
        candidate_id: string,
        job_id: string,
    ): Promise<CompetenceRadarSVG[]> {
        const candidateJob = await this.candidateJobService.getCandidateJob(
            candidate_id,
            job_id,
        )

        const result: CompetenceRadarSVG[] = []
        const candidateWheels = candidateJob.recruiter_assessments?.wheels
        if (candidateWheels?.length) {
            candidateWheels.map((competence) => {
                // defined Axes
                const axes: Axes[] = competence.competency_list
                    .filter(({ is_active }) => is_active)
                    .map<Axes>(({ name, value }) => ({
                        axis: name,
                        value: value,
                    }))
                // data for each Radar Chart
                if (axes.length) {
                    const data: RadarData[] = [
                        { name: competence.wheel_name, axes, color: '#462851' },
                    ]
                    // d3 element
                    const radar = RadarChart(data, {
                        w: 550 * 1.1,
                        h: 450 * 1.1,
                        margin: 100,
                        maxValue: 10,
                        levels: 10,
                        color: ['#462851'],
                    })
                    // convert as svg
                    const chart: string = generateRadarChart(radar)
                    result.push({
                        competence_name: competence.wheel_name,
                        svg: chart,
                    })
                }
            })
        }
        return result
    }

    public async exportPdf(
        candidate_id: string,
        user_export: string,
        job_id: string,
    ): Promise<ZipExportPdfDto> {
        const candidate: Candidate = await this.repo
            .findOne({
                _id: new ObjectId(candidate_id),
            })
            .populate([
                {
                    path: 'agency_id',
                },
                { path: 'additional_infos' },
                { path: 'summaries' },
                {
                    path: 'assessment_reports',
                    populate: [
                        {
                            path: 'industry',
                            model: 'AssessmentIndustry',
                        },
                        {
                            path: 'type',
                            model: 'AssessmentType',
                        },
                    ],
                },
            ])

        if (!candidate)
            throw new HttpException(
                'CANDIDATE_NOT_EXISTED',
                HttpStatus.BAD_REQUEST,
            )

        // assign score
        //!TODO: filter by job_id
        candidate.assessment_reports.forEach((x) => {
            const report = x as AssessmentReport
            if (report.tests) {
                const extractReports =
                    AssessmentReport.PopulateAssessmentReports(report.tests)
                report.CompetencyProfileReport =
                    extractReports.CompetencyProfileReport
                report.PersonalityProfileReport =
                    extractReports.PersonalityProfileReport
            }
        })
        const filter_assessment_reports = []
        for (let i = 0; i < candidate.assessment_reports.length; i++) {
            const assessment_report = candidate.assessment_reports[
                i
            ] as AssessmentReport
            if (job_id) {
                if (
                    !assessment_report.job ||
                    (assessment_report.job &&
                        assessment_report.job.toString() != job_id)
                ) {
                    filter_assessment_reports.push(assessment_report.id)
                }
            }
        }

        candidate.assessment_reports = candidate.assessment_reports.filter(
            (x: AssessmentReport) =>
                filter_assessment_reports.indexOf(x.id) === -1,
        )

        const agencyInfo = candidate.agency_id as any
        // mapping radar + bar chart
        const svgInternalAssessment: CompetenceRadarSVG[] =
            await this.radarChartCompetenceWheel(candidate_id, job_id)
        const PersonalityProfileReport = (
            candidate.assessment_reports as AssessmentReport[]
        ).map((x): Axes[] =>
            x.PersonalityProfileReport.map(({ Group, RoundedStenScore }) => ({
                axis: Group,
                value: RoundedStenScore,
            })),
        )

        const CompetencyProfileReport = (
            candidate.assessment_reports as AssessmentReport[]
        ).map((x): BarChartData[] =>
            x.CompetencyProfileReport.map(({ Group, RoundedStenScore }) => ({
                name: Group,
                value: RoundedStenScore,
            })),
        )

        const svgAssessmentOutcomes: AssessmentReportChartDto[] = []
        let is_assessment_reports_complete = false

        candidate.assessment_reports.map(
            (data: AssessmentReport, index: number): void => {
                const svgAssessmentOutcome = new AssessmentReportChartDto()
                //---------------------------------------------------
                //---------------1.Process radar chart
                //---------------------------------------------------
                const completeStatus = ['Submitted', 'Downloaded']
                if (!data.status || completeStatus.indexOf(data.status) == -1) {
                } else {
                    const axes: Axes[] = PersonalityProfileReport[index]
                    if (axes.length) {
                        // data for each Radar Chart
                        const outComesRadar: RadarData[] = [
                            {
                                name: 'Personality Profile',
                                axes: axes.sort((a, b) =>
                                    a.axis > b.axis ? -1 : 1,
                                ),
                                color: '#462851',
                            },
                        ]
                        // d3 element
                        const radar = RadarChart(outComesRadar, {
                            w: 550 * 1.1,
                            h: 450 * 1.1,
                            margin: 100,
                            maxValue: 10,
                            levels: 10,
                            fontAxis: 12,
                            color: ['#6893ff'],
                            // color: [agencyInfo.company_info.font_color]
                        })
                        // convert as svg
                        const radarChartSvg: string = generateRadarChart(radar)
                        is_assessment_reports_complete = true
                        svgAssessmentOutcome.radarChartSvg = radarChartSvg
                    }
                    //---------------------------------------------------
                    //---------------2.Process bar chart
                    //---------------------------------------------------
                    const barChartData: BarChartData[] =
                        CompetencyProfileReport[index]
                    let barChartSvg: string
                    if (barChartData.length) {
                        barChartSvg = generateString(
                            BarChart(
                                barChartData.sort((a, b) =>
                                    a.name > b.name ? -1 : 1,
                                ),
                                {
                                    w: 650,
                                    h: 800,
                                    margin: {
                                        top: 20,
                                        bottom: 20,
                                        left: 200,
                                        right: 10,
                                    },
                                    lineHeight: 40,
                                    maxValue: 10,
                                    fontSize: {
                                        label: 16,
                                        value: 17,
                                    },
                                    color: '#6893ff',
                                },
                            ),
                            'svg',
                        )
                        svgAssessmentOutcome.barChartSvg = barChartSvg
                    }
                    if (axes.length || barChartData.length) {
                        is_assessment_reports_complete = true
                        svgAssessmentOutcomes.push(svgAssessmentOutcome)
                    }
                }
            },
        )
        let backgroundImgBase64 = ''
        let logoImgBase64 = ''
        try {
            if (agencyInfo?.company_info?.background_image) {
                const backgroundkey = `${agencyInfo?.id}/background/${agencyInfo?.company_info?.background_image}`
                const backgroundImgStream = this.s3Service.getPrivateFile(
                    this.coreConfig.aws.bucket,
                    backgroundkey,
                )

                const backgroundImgChunks = []
                // eslint-disable-next-line prefer-const
                for await (let chunk of backgroundImgStream) {
                    backgroundImgChunks.push(chunk)
                }
                const backgroundImgBuffer = Buffer.concat(backgroundImgChunks)
                // eslint-disable-next-line no-unused-vars
                backgroundImgBase64 = backgroundImgBuffer.toString('base64')
            }
        } catch (e) {
            this.logger.error('ERROR_BACKGROUND')
        }

        try {
            if (agencyInfo?.company_info?.logo) {
                const logokey = `${agencyInfo?.id}/logo/${agencyInfo?.company_info?.logo}`
                const logoImgStream = this.s3Service.getPrivateFile(
                    this.coreConfig.aws.bucket,
                    logokey,
                )

                const logoImgChunks = []
                // eslint-disable-next-line prefer-const
                for await (let chunk of logoImgStream) {
                    logoImgChunks.push(chunk)
                }
                const logoImgBuffer = Buffer.concat(logoImgChunks)
                logoImgBase64 = logoImgBuffer.toString('base64')
            }
        } catch (e) {
            this.logger.error('ERROR_BACKGROUND')
        }
        // const candidateDocument = await this.candidateDocumentService.findByCandidate(candidate_id)

        let resume = candidate.resume_text
            ?.replace(
                candidate.resume_text?.slice(
                    candidate.resume_text?.indexOf('{{DOCUMENT_DATESTAMP}}'),
                    candidate.resume_text?.indexOf(
                        '{{END_DOCUMENT_DATESTAMP}}',
                    ) + '{{END_DOCUMENT_DATESTAMP}}'.length,
                ),
                '',
            )
            .replace('{{HEADER}}', '')
            .replace('{{END_HEADER}}', '')
            .replace(/<br><br><br>/g, '')
        if (candidate.candidate_email) {
            resume = resume.replace(candidate.candidate_email, '')
        }
        if (candidate.phone) {
            resume = resume.replace(candidate.phone, '')
        }
        if (candidate.linked_in) {
            resume = resume.replace(candidate.linked_in, '')
        }
        if (candidate.postalAddress) {
            if (candidate.postalAddress.Municipality) {
                resume = resume.replace(
                    candidate.postalAddress.Municipality,
                    '',
                )
            }
            if (candidate.postalAddress.Region) {
                resume = resume.replace(candidate.postalAddress.Region, '')
            }
        }
        const exp_rem = candidate?.exp_rem
            ? parseInt(candidate?.exp_rem).toString() == 'NaN'
                ? candidate?.exp_rem
                : `AUD $${parseInt(candidate?.exp_rem).toLocaleString()}`
            : candidate?.exp_rem
        const jobClientContact = await this.JobClientContactModel.findOne({
            job_id: job_id,
        })
            .sort({ created_at: SortDirection.ASC })
            .populate('client_contact_id')
        const isShowAdditionalInfo =
            candidate.additional_infos &&
            candidate.additional_infos.length > 0 &&
            candidate.additional_infos.some((info) => info?.value)
        const clientContact =
            jobClientContact &&
            (jobClientContact.client_contact_id as ClientContact)
        const assessmentInviteLink = `${this.coreConfig.mailConfig.API_DNS}candidate/assessment_report_file`

        /** change PDF render page comment  
            const body = await renderFile('./assessment-template/report-pdf.ejs', {
                agency_name: user_export || clientContact?.first_name,
                candidate_name: candidate.candidate_name,
                current_position: candidate.current_position,
                notice_period: candidate.notice_period,
                current_employer: candidate.current_employer,
                exp_rem: exp_rem,
                competency_assessment: svgInternalAssessment,
                assessment_reports: candidate.assessment_reports,
                assessment_invite_link: assessmentInviteLink,
                svgAssessmentOutcomes,
                summaries: candidate.summaries,
                background_check: candidate.background_check,
                background_comment: candidate.background_comment,
                right_to_work: candidate.right_to_work,
                right_to_work_comment: candidate.right_to_work_comment,
                linked_in_recommend: candidate.linked_in_recommend,
                resume: resume,
                assessment_reports_completed: is_assessment_reports_complete,
                additional_infos: candidate.additional_infos,
                document: undefined,
                backgroundImg: undefined,
                logoImg: logoImgBase64,
                fontColor: agencyInfo.company_info.font_color,
                asset_url: this.coreConfig.asset_url,
                isShowAdditionalInfo: isShowAdditionalInfo,
                includeAssessmentReport: candidate?.include_assessment_report
            })

            const page = await browser.newPage()
            await page.setContent(body, { waitUntil: 'networkidle2' })
            const candidatePdf = await page.pdf({
                path: fileName,
                format: 'A4',
                displayHeaderFooter: true,
                printBackground: true,
                margin: {
                    top: '0',
                    bottom: '0'
                },
                footerTemplate: resumeFooter
            })

            await browser.close()

            remove file
            fs.unlinkSync(fileName)
        */

        const lstPage = []
        const candidateSummary = await renderFile(
            './assessment-template/candidate-sumary.ejs',
            {
                logoImg: logoImgBase64,
                fontColor: agencyInfo.company_info.font_color,
                agency_name: user_export || clientContact?.first_name,
                candidate_name: candidate.candidate_name,
                current_position: candidate.current_position,
                notice_period: candidate.notice_period,
                current_employer: candidate.current_employer,
                exp_rem: exp_rem,
                summaries: candidate.summaries,
            },
        )
        const resumeFooter = await renderFile(
            './assessment-template/report-footer.ejs',
            {
                fontColor: agencyInfo.company_info.font_color,
            },
        )
        const marginPage = { top: '40px', bottom: '40px' }
        lstPage.push({
            content: candidateSummary,
            options: {},
            isFirstPage: true,
        })

        if (svgInternalAssessment.length) {
            console.log(svgInternalAssessment.length)
            for (let i = 0; i < svgInternalAssessment.length; i++) {
                const competency = await renderFile(
                    './assessment-template/competency.ejs',
                    { wheel: svgInternalAssessment[i], index: i },
                )
                lstPage.push({
                    content: competency,
                    options: { margin: marginPage },
                    footer: resumeFooter,
                })
            }
        }

        if (
            candidate?.include_assessment_report &&
            is_assessment_reports_complete
        ) {
            const assessmentRadar = await renderFile(
                './assessment-template/assessment_radar.ejs',
                {
                    candidate_name: candidate.candidate_name,
                    assessment_reports: candidate.assessment_reports[0],
                    svgAssessmentOutcomes: svgAssessmentOutcomes[0],
                },
            )
            lstPage.push({
                content: assessmentRadar,
                options: { margin: marginPage },
                footer: resumeFooter,
            })
            const assmentBarChart = await renderFile(
                './assessment-template/assessment_barchart.ejs',
                {
                    candidate_name: candidate.candidate_name,
                    svgAssessmentOutcomes: svgAssessmentOutcomes[0],
                },
            )
            lstPage.push({
                content: assmentBarChart,
                options: { margin: marginPage },
                footer: resumeFooter,
            })
        }
        if (
            candidate?.background_check ||
            candidate?.right_to_work ||
            candidate?.linked_in_recommend ||
            is_assessment_reports_complete
        ) {
            const assessmentLink = await renderFile(
                './assessment-template/assement_link.ejs',
                {
                    assessment_invite_link: assessmentInviteLink,
                    assessment_reports: candidate?.assessment_reports[0],
                    background_check: candidate.background_check,
                    background_comment: candidate.background_comment,
                    right_to_work: candidate.right_to_work,
                    right_to_work_comment: candidate.right_to_work_comment,
                    linked_in_recommend: candidate.linked_in_recommend,
                    is_assessment_reports_complete:
                        is_assessment_reports_complete,
                },
            )
            lstPage.push({
                content: assessmentLink,
                options: { margin: marginPage },
                footer: resumeFooter,
            })
        }

        if (resume) {
            const resumePage = await renderFile(
                './assessment-template/assessment_resume.ejs',
                {
                    resume: resume,
                    fontColor: agencyInfo.company_info.font_color,
                    additional_infos: candidate.additional_infos,
                    isShowAdditionalInfo: isShowAdditionalInfo,
                },
            )
            lstPage.push({
                content: resumePage,
                options: { margin: marginPage },
                footer: resumeFooter,
            })
        }

        // generate pdf
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-gpu'],
        })

        const fileName = (`${candidate.candidate_name}.${Date.now()}.pdf`).replace(/[^a-z0-9]/gi, '_')
        const pdfsToMerge = []
        for (let i = 0; i < lstPage.length; i++) {
            const fileNamePage = `export-pdf/page_${i}.pdf`
            const buf = await this.generatePagePdf(
                browser,
                lstPage[i],
                fileNamePage,
            )
            pdfsToMerge.push(buf)
        }
        await browser.close()

        const mergedPdf = await PDFDocument.create()
        for (const pdfBytes of pdfsToMerge) {
            const pdf = await PDFDocument.load(pdfBytes)
            const copiedPages = await mergedPdf.copyPages(
                pdf,
                pdf.getPageIndices(),
            )
            copiedPages.forEach((page) => {
                mergedPdf.addPage(page)
            })
        }

        const buf = await mergedPdf.save()

        return { fileName, buffer: Buffer.from(new Uint8Array(buf)) }
    }

    async generatePagePdf(
        browser: any,
        pdfPage: any,
        fileName: string,
    ): Promise<Buffer> {
        const page = await browser.newPage()
        await page.setContent(pdfPage?.content, { waitUntil: 'networkidle2' })
        if (pdfPage?.isFirstPage) {
            return await page.pdf({
                path: fileName,
                format: 'A4',
                printBackground: true,
            })
        }
        return await page.pdf({
            path: fileName,
            format: 'A4',
            margin: pdfPage?.options?.margin || {},
            displayHeaderFooter: true,
            printBackground: true,
            footerTemplate: pdfPage?.footer,
            headerTemplate:
                '<header style="font-size: 30px; height: 40px; background-color: white; color: white; "></header>',
        })
    }

    public async exportPdfWithToken(
        candidate_id: string,
        invite_token: string,
    ) {
        try {
            const jobClientContact = await this.JobClientContactModel.findOne({
                invite_token,
            }).populate('client_contact_id')
            const filter: any = {}
            filter.job_id = jobClientContact.job_id
            const clientContact =
                jobClientContact.client_contact_id as ClientContact
            filter.candidate_id = { $in: [candidate_id] }
            const listCandidateId = await this.CandidateJobModel.find(filter)
            if (!listCandidateId.length)
                throw new HttpException(
                    'EMPTY_CLIENT_JOB_CANDIDATE',
                    HttpStatus.BAD_REQUEST,
                )
            return await this.exportPdf(
                String(candidate_id),
                clientContact.first_name,
                String(jobClientContact.job_id),
            )
        } catch (error) { }
    }

    public async generateExportFileName(
        candidate_id: string,
        job_id: string,
        inviteToken?: string,
    ): Promise<string> {
        const candidate = await this.repo.findById(new ObjectId(candidate_id))
        let jobId: string = job_id
        if (inviteToken) {
            const jobClientContact = await this.JobClientContactModel.findOne({
                invite_token: inviteToken,
            })
            if (jobClientContact) jobId = jobClientContact?.job_id.toString()
        }
        if (!jobId) return 'CandidateReport.pdf'
        const job = await this.JobModal.findById(new ObjectId(jobId))
            .populate('client_id')
            .exec()
        let business_name = ''
        if (job.client_id) {
            business_name = (job.client_id as Client).business_name
        }
        if (!job || !candidate) return 'CandidateReport.pdf'

        return (`${candidate?.candidate_name}_${job?.job_title}_${business_name}.pdf`).replace(/[^a-z0-9]/gi, '_')
    }

    public async generateZipFolder(
        query: GenerateReportInviteTokenQuery,
    ): Promise<Buffer> {
        const { invite_token } = query

        const jobClientContact = await this.JobClientContactModel.findOne({
            invite_token,
        }).populate([{ path: 'client_contact_id' }, { path: 'job_id' }])
        const filter: any = {}
        filter.job_id = jobClientContact.job_id
        const clientContact =
            jobClientContact.client_contact_id as ClientContact
        const job = jobClientContact.job_id as Job
        if (query.candidate_id)
            filter.candidate_id = { $in: query.candidate_id }
        const listCandidateId = await this.CandidateJobModel.find(filter)
        if (!listCandidateId.length)
            throw new HttpException(
                'EMPTY_CLIENT_JOB_CANDIDATE',
                HttpStatus.BAD_REQUEST,
            )
        const zip = new AdmZip()
        if (!job.exclude_from_report) {
            const jobFile = await this.jobService.exportJobRecruitmentActivity(
                filter.job_id,
            )
            if (jobFile) {
                zip.addFile(jobFile.fileName, jobFile.buffer)
            }
        }

        const exportPdfProcess = listCandidateId.map(
            async ({ candidate_id }) => {
                const candidateFile: ZipExportPdfDto = await this.exportPdf(
                    String(candidate_id),
                    clientContact.first_name,
                    String(jobClientContact.job_id),
                )
                zip.addFile(candidateFile.fileName, candidateFile.buffer)
            },
        )
        await Promise.all(exportPdfProcess)

        return zip.toBuffer()
    }
}
