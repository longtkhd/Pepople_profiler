import { forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { ObjectId } from 'mongodb'
import { QueryPopulateOptions, Types, FilterQuery, PaginateOptions } from 'mongoose'
import { plainToClass } from 'class-transformer'
import { renderFile } from 'ejs'
import * as puppeteer from 'puppeteer'
import { Job, JobClientContact, JobStatus } from '../schemas/job.schema'
import { Client, ClientContact, ClientContactTextSearch } from '../schemas/client.schema'
import { ClientService } from '../client/client.service'
import { JobClientContactService } from './job-client-contact.service'

import { JwtPayload } from '../auth/dto/login'
import { ClientContactDto, ClientInfoDto, ClientListDto, CreateClientDetailDto } from '../client/dto/client'
import { JobFilterParamDto, CreateJobDto, UpdateJobRequestDto, UpdateJobRecruitmentActivityDto } from './dto/job.req.dto'
import { JobDetailDto, OutJobListingDto, ChangeJobStatusResultDto, JobListDto, ListJobRecruitmentActivityDto, ChangeJobAssignUserResultDto } from './dto/job.res.dto'
import { User } from 'src/schemas/user.schema'
import { MapperService } from 'src/shared/mapper/mapper.service'
import { ClientContactService } from 'src/client/client_contact.service'
import { S3ManagerService } from 'src/aws/s3-manager.service'
import { ConfigurationService } from 'src/shared/configuration/configuration.service'
@Injectable()
export class JobService {

    constructor(
        @InjectModel(Job) private readonly repo: ReturnModelType<typeof Job>,
        private readonly mapperService: MapperService,
        @Inject(forwardRef(() => JobClientContactService)) private readonly jobClientContactService: JobClientContactService,
        private readonly clientService: ClientService,
        private readonly clientContactService: ClientContactService,
        private readonly s3Service: S3ManagerService,
        private readonly coreConfig: ConfigurationService,
    ) {
        this.mapperService.createMap(ClientInfoDto.name, Client.name)
        this.mapperService.createMap(Job.name, JobDetailDto.name)
        this.mapperService.createMap(Job.name, JobListDto.name)

    }
    private readonly logger = new Logger('JobService');
    async paginateJobClientList(agency_id: string, job_id: string): Promise<ClientListDto> {
        try {
            const query: FilterQuery<Job> = {}
            query.agency_id = new ObjectId(agency_id)
            query.job_id = new ObjectId(job_id)
            query.is_deleted = false
            const clientList = await this.repo.find(query).populate([{ path: 'client_id' }]).exec()

            const result = new ClientListDto(0, 0)
            result.paginate = 'false'
            result.total = (await clientList).length
            if (!result.total) return result
            const mapClients = clientList.map((job) => {
                const mappedClient = new ClientInfoDto()
                mappedClient.id = ((job.client_id) as Client).id
                mappedClient.business_name = ((job.client_id) as Client).business_name
                mappedClient.industry = ((job.client_id) as Client).industry
                return mappedClient
            })
            result.client_list = mapClients
            return result
        } catch (err) { this.logger.error(err) }
    }
    async contactInJob(agencyId: string, job_id: string) {
        try {
            const query: FilterQuery<JobClientContact> = {}
            const job = await this.findById(job_id, agencyId)
            if (!job) {
                throw new HttpException('JOB_NOT_FOUND', HttpStatus.NOT_FOUND)
            }
            //query.client_id = job.client_id
            query.job_id = new ObjectId(job.id)

            if (job.client_id) {
                const contactInJob = await this.jobClientContactService.list({ client_id: job.client_id.toString(), job_id: job.id })
                return contactInJob
            }
            return []
        } catch (error) {
            console.log(error)
            throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR)
        }
        //return result.map(x => plainToClass(OutJobClientContactDto, x, { excludeExtraneousValues: true }))
    }
    async availableContactToAddToJob(agencyId: string, job_id: string) {
        try {
            const query: FilterQuery<JobClientContact> = {}
            const job = await this.findById(job_id, agencyId)
            if (!job) {
                throw new HttpException('JOB_NOT_FOUND', HttpStatus.NOT_FOUND)
            }
            //query.client_id = job.client_id
            query.job_id = new ObjectId(job.id)
            const contactInJob = await this.jobClientContactService.list({ client_id: job.client_id.toString(), job_id: job.id })

            const contactInClient = await this.clientContactService.list(job.client_id.toString())
            console.log(contactInClient)
            const result = contactInClient.docs.filter(x => !contactInJob.some(cij => cij.client_contact_id === x.id))
            //const result = await this.repo.find(query).exec()
            return result
        } catch (error) {
            this.logger.error(error)
            throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR)
        }
        //return result.map(x => plainToClass(OutJobClientContactDto, x, { excludeExtraneousValues: true }))
    }
    async paginateJobList(filter: JobFilterParamDto, populate?: any): Promise<OutJobListingDto> {
        try {
            const options: PaginateOptions = {
                page: filter.page,
                limit: filter.size,
                populate: populate,
                pagination: filter.paginate != 'false'
            }
            const jobList = await this.repo.paginate(filter.buildFilterQuery(), options)
            const result = new OutJobListingDto(filter.page, filter.size)

            result.total = jobList.totalDocs
            result.job_list = jobList.totalDocs ? jobList.docs.map((job) => {
                const mapped = plainToClass(JobListDto, job, { excludeExtraneousValues: true })
                //let mapped = this.mapperService.map<JobListDto>(job, JobListDto.name, Job.name)
                //mapped =  plainToClass(JobListDto, mapped, { excludeExtraneousValues: true })
                if (job.client_id) {
                    mapped.business_name = (job.client_id as Client).business_name
                    mapped.client_id = (job.client_id as Client).id
                }

                if (job.assigned_user) {
                    //mapped.assigned_user
                    mapped.person_in_charge = `${(job.assigned_user as User).first_name} ${(job.assigned_user as User).last_name}`
                    mapped.assigned_user_id = (job.assigned_user as User).id
                }
                mapped.display_status = job.job_status
                return mapped
            }) : []

            return result
        } catch (error) {
            this.logger.error(error)
            console.log(error)
            throw new HttpException('INTERNAL_SERVER_ERROR', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async findById(_id: string, agency_id: string): Promise<Job> {
        return this.repo.findOne({ _id, agency_id: agency_id, is_deleted: { $ne: true } }).exec()
    }

    async findOne(query: FilterQuery<Job>, populate?: QueryPopulateOptions[]) {
        const queryBuild = this.repo.findOne(query)
        if (populate) {
            return await queryBuild.populate(populate).exec()
        }
        return await queryBuild.exec()
    }

    async jobDetail(agency_id: string, job_id: string) {
        const job = await this.findOne({
            _id: Types.ObjectId(job_id),
            agency_id: Types.ObjectId(agency_id),
            is_deleted: { $ne: true }
        }, [
            { path: 'client_id' },
            { path: 'assigned_user' },
            { path: 'client_contact_list' }
        ])
        //const mapped = plainToClass(JobDetailDto, job, { excludeExtraneousValues: true })
        if (!job) {
            throw new HttpException('JOB_NOT_FOUND', HttpStatus.NOT_FOUND)
        }
        const mapped = this.mapperService.map<JobDetailDto>(
            job,
            JobDetailDto.name,
            Job.name,
        )
        if (job.client_id) {
            mapped.business_name = (job.client_id as Client).business_name
            mapped.client_id = (job.client_id as Client).id
        }
        if (job.assigned_user) {
            mapped.person_in_charge = `${(job.assigned_user as User).first_name} ${(job.assigned_user as User).last_name}`
            mapped.assigned_user = (job.assigned_user as User).id
        }
        mapped.display_status = job.job_status
        return mapped
    }

    public async createJob(payload: JwtPayload, _JobDto: CreateJobDto): Promise<JobDetailDto> {
        if (!_JobDto.client_id) _JobDto.client_id = undefined
        if (!_JobDto.client_contact_id) _JobDto.client_contact_id = undefined
        const mapJob = plainToClass(Job, _JobDto)

        let contactList: Array<ClientContact>
        if (_JobDto.client_id && _JobDto.client_id.length) {
            const client = await this.clientService.findOne({
                _id: _JobDto.client_id,
                agency_id: payload.agency_id
            }, [{
                path: 'contact_list'
            }])

            mapJob.client_id = client?.id ? new ObjectId(client.id) : null
            contactList = client.contact_list ? client.contact_list.map((x: ClientContact) => x) : []
        }

        mapJob.agency_id = new ObjectId(payload.agency_id)
        mapJob.created_by = new ObjectId(payload.id)
        mapJob.assigned_user = new ObjectId(payload.id)

        const savedJob = await this.repo.create(mapJob)

        if (!mapJob.client_id && _JobDto.business_name) {
            const dto = new CreateClientDetailDto()
            dto.business_name = _JobDto.business_name
            const contactDto = new ClientContactDto()
            if (_JobDto.contact_email) {
                contactDto.first_name = _JobDto.first_name
                contactDto.last_name = _JobDto.last_name
                contactDto.contact_number = _JobDto.contact_number
                contactDto.email = _JobDto.contact_email
                dto.contact_list = [contactDto]
            }
            const createClient = await this.clientService.create(payload, dto)
            const createClientContactList = createClient.contact_list && createClient.contact_list.length > 0 ? createClient.contact_list.map((x: ClientContact) => x) : []
            _JobDto.client_contact_id = createClient.contact_list && createClient.contact_list.length > 0 ? createClientContactList[0].id : undefined
            contactList = createClientContactList
            savedJob.client_id = Types.ObjectId(createClient.id)
            savedJob.save()
        }

        if (_JobDto.client_contact_id && _JobDto.client_contact_id.length && contactList && contactList.find(x => x.id == _JobDto.client_contact_id)) {
            await this.jobClientContactService.AddToJob({
                contact_id: _JobDto.client_contact_id,
                job_id: savedJob.id
            }, payload)
        }

        if (!_JobDto.client_contact_id && _JobDto.client_id) {
            const newContact = new ClientContactDto()
            newContact.contact_number = _JobDto.contact_number
            newContact.email = _JobDto.contact_email
            newContact.first_name = _JobDto.first_name
            newContact.last_name = _JobDto.last_name
            const saveContact = await this.clientContactService.create(payload, newContact, _JobDto.client_id)
            if (saveContact?.id) {
                await this.jobClientContactService.AddToJob({
                    contact_id: saveContact.id,
                    job_id: savedJob.id
                }, payload)
            }
        }

        const job = await this.repo.findById(savedJob.id).populate({ path: 'client_id' }).exec()
        return plainToClass(JobDetailDto, job, { excludeExtraneousValues: true })
    }

    public async changeJobStatus(payload: JwtPayload, job_id: string, status: JobStatus): Promise<ChangeJobStatusResultDto> {
        const result = new ChangeJobStatusResultDto()
        result.job_id = job_id
        result.success = true
        try {
            const job = await this.findById(job_id, payload.agency_id)
            if (job && !job.is_deleted) {
                job.status = status
                job.updated_by = Types.ObjectId(payload.id)
                const res = await this.repo.findByIdAndUpdate(job.id, job)
                if (res && res.id) {
                    return result
                }
            };
            result.success = false
            result.message = 'job_not_found'
            return result
        }
        catch (error) {
            this.logger.error(error)
            result.message = 'internal_server_error'
            return result
        }

    }

    async updateListRecruiterActivity(payload: JwtPayload, job_id: string, _JobRecruitmentActivityDto: UpdateJobRecruitmentActivityDto): Promise<ListJobRecruitmentActivityDto> {
        return await this.repo.findOneAndUpdate({
            _id: job_id,
            agency_id: payload.agency_id,
            is_deleted: { $ne: true }
        }, {
            recruitment_activity: _JobRecruitmentActivityDto.recruitment_activity,
            exclude_from_report: _JobRecruitmentActivityDto.exclude_from_report
        }, { new: true }).then(result => {
            if (!result) throw new HttpException('JOB_NOT_FOUND', HttpStatus.NOT_FOUND)
            return {
                job_id: job_id,
                exclude_from_report: result.exclude_from_report,
                recruitment_activity: _JobRecruitmentActivityDto.recruitment_activity,
            }
        })
    }

    public async updateJobDetail(payload: JwtPayload, job_id: string, UpdateJobData: UpdateJobRequestDto): Promise<Job> {
        return await this.repo.findOneAndUpdate({
            _id: job_id,
            agency_id: payload.agency_id
        }, UpdateJobData, { new: true }).then(job => {
            if (!job) throw new HttpException('JOB_NOT_EXISTED', HttpStatus.BAD_REQUEST)
            return job
        })
    }
    public async updateJobRecruiter(payload: JwtPayload, job_id: string, recruiter_id: ObjectId) {
        return await this.repo.findOneAndUpdate({
            _id: job_id,
            agency_id: payload.agency_id
        }, { assigned_user: recruiter_id }, { new: true }).then(job => {
            const result = new ChangeJobAssignUserResultDto()
            result.job_id = job_id
            result.message = 'OK'
            result.success = true
            if (!job) {
                result.message = 'JOB_NOT_EXISTED' //throw new HttpException('JOB_NOT_EXISTED', HttpStatus.BAD_REQUEST)
                result.success = false
            }
            return result
        })

    }
    public async deleteJob(payload: JwtPayload, job_id: string): Promise<Job> {
        return await this.repo.findOneAndUpdate({
            _id: job_id,
            agency_id: payload.agency_id
        }, {
            is_deleted: true
        }, { new: true }).then(job => {
            if (!job) throw new HttpException('JOB_NOT_EXISTED', HttpStatus.BAD_REQUEST)
            return job
        })
    }

    public async getjobDashboard(invite_token: string) {
        const jobClientContact = await this.jobClientContactService.findClientContactByToken(
            invite_token,
        )
        if (!jobClientContact) {
            throw new HttpException('INVALID_TOKEN', HttpStatus.BAD_REQUEST)
        }

        const job = await this.findOne({
            _id: jobClientContact.job_id,
            is_deleted: { $ne: true }
        }, [
            { path: 'client_id' },
            { path: 'assigned_user' },
            { path: 'client_contact_list' }
        ])
        const mapped = this.mapperService.map<JobDetailDto>(
            job,
            JobDetailDto.name,
            Job.name,
        )
        if (!job) {
            throw new HttpException('JOB_NOT_FOUND', HttpStatus.NOT_FOUND)
        }
        if (job.client_id) {
            mapped.business_name = (job.client_id as Client).business_name
            mapped.client_id = (job.client_id as Client).id
        }
        if (job.assigned_user) {
            mapped.person_in_charge = `${(job.assigned_user as User).first_name} ${(job.assigned_user as User).last_name}`
            mapped.assigned_user = (job.assigned_user as User).id
            mapped.phone_number = (job.assigned_user as User).phone_number
        }
        mapped.display_status = job.job_status
        return mapped
    }

    async exportJobRecruitmentActivity(job_id: any) {
        const job = await this.findOne({
            _id: Types.ObjectId(job_id),
            is_deleted: { $ne: true }
        }, [
            { path: 'agency_id' }
        ])
        //const mapped = plainToClass(JobDetailDto, job, { excludeExtraneousValues: true })
        if (!job) {
            throw new HttpException('JOB_NOT_FOUND', HttpStatus.NOT_FOUND)
        }
        const mapped = this.mapperService.map<JobDetailDto>(
            job,
            JobDetailDto.name,
            Job.name,
        )
        const agencyInfo = job.agency_id as any
        let logoImgBase64 = ''
        try {
            if (agencyInfo?.company_info?.logo) {
                const logokey = `${agencyInfo?.id}/logo/${agencyInfo?.company_info?.logo}`
                const logoImgStream = this.s3Service.getPrivateFile(this.coreConfig.aws.bucket, logokey)

                const logoImgChunks = []
                // eslint-disable-next-line prefer-const
                for await (let chunk of logoImgStream) {
                    logoImgChunks.push(chunk)
                }
                const logoImgBuffer = Buffer.concat(logoImgChunks)
                // eslint-disable-next-line no-unused-vars
                logoImgBase64 = logoImgBuffer.toString('base64')
            }
        } catch (e) { this.logger.error('ERROR_BACKGROUND') }
        const resumeFooter = await renderFile('./assessment-template/report-footer.ejs', {
            fontColor: agencyInfo.company_info.font_color
        })
        let reason = ''
        function capitalizeFirstLetter(string) {
            string = string.toLowerCase()
            return string.charAt(0).toUpperCase() + string.slice(1)
        }
        let activities = mapped.recruitment_activity.map(x => {
            const icon = x.icon
            let value = x.value
            let key = x.key
            // reason field
            if (icon == '7') {
                reason = x.value
            }
            // male / female field
            if (icon == '5') {
                if (value.male && value.female) {
                    value = `${value.male} | ${value.female}`
                    key = 'Male | Female'
                }
                else {
                    value = undefined
                }

            }
            else {
                key = capitalizeFirstLetter(key)
            }
            return {
                icon, key, value
            }
        })
        activities = activities.filter(x => x.icon != '7' && x.value)
        const body = await renderFile('./assessment-template/job_activity_report.ejs', {
            recruitment_activity: activities,
            job_title: job.job_title,
            logoImg: logoImgBase64,
            fontColor: agencyInfo.company_info.font_color,
            reason
        })
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-gpu',
            ]
        })
        const page = await browser.newPage()
        await page.setContent(body, { waitUntil: 'networkidle2' })
        const buf = await page.pdf({
            path: 'job_activity_report.pdf',
            format: 'A4',
            displayHeaderFooter: true,
            printBackground: true,
            footerTemplate: resumeFooter,
            headerTemplate: '<header style="font-size: 30px; height: 40px; background-color: white; color: white; "></header>',
        })

        await browser.close()
        return { fileName: 'job_activity_report.pdf', buffer: Buffer.from(new Uint8Array(buf)) }
    }

    createSearchText(job: Job, client: Client, clientContacts: ClientContactTextSearch[]) {
        try {
            let text_search = `${job.job_title} ${job.job_role || ''} ${client.text_search} `
            if (clientContacts && clientContacts.length) {
                clientContacts.forEach(clientContact => {
                    text_search += this.clientContactService.createSearchText(clientContact)
                })
            }
            return text_search
        } catch (error) {
            this.logger.error('unable to build text search for job')
            this.logger.error(error)
        }
    }

    async buildSearchText(job_id: string) {
        try {
            const populate = ['client_id']
            const job = await this.repo.findById(new ObjectId(job_id)).populate(populate).exec()
            if (job) {
                const client = job.client_id as Client
                const contactInJob = await this.jobClientContactService.list({ client_id: job.client_id.toString(), job_id: job.id })
                const text_search = this.createSearchText(job, client, contactInJob)
                console.log(text_search)
                if (job.text_search != text_search) {
                    await this.repo.updateOne({ _id: new ObjectId(job.id) }, {
                        text_search: text_search
                    })
                }
            }
        } catch (error) {
            this.logger.error('unable to build text search for job')
            this.logger.error(error)
        }
    }
    async buildAllSearchText() {
        try {
            const jobs = await this.repo.find({ is_deleted: { $ne: true } })
            const promises = jobs.map(async job => {
                await this.buildSearchText(job.id)
            })
            await Promise.all(promises)
        } catch (error) {
            this.logger.error('unable to build text search for job')
            this.logger.error(error)
        }
    }
}
