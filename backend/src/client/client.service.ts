import { forwardRef, HttpException, Inject, Injectable, Logger } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { ObjectId } from 'mongodb'
import { QueryPopulateOptions } from 'mongoose'
import { PaginateOptions, FilterQuery, PaginateResult } from 'mongoose'

import { InjectModel } from 'nestjs-typegoose'
import { JwtPayload } from 'src/auth/dto/login'
import { JobClientContactService } from 'src/job/job-client-contact.service'
import { JobService } from 'src/job/job.service'
import { Client, ClientContactTextSearch } from 'src/schemas/client.schema'
import { ClientFeedback } from 'src/schemas/job.schema'
import { MapperService } from 'src/shared/mapper/mapper.service'
import { ClientContactService } from './client_contact.service'
import { AddMultipleClientContact, ClientContactDto, ClientDetailDto, ClientInfoDto, ClientListDto, CreateClientDetailDto, InFilterClientParamDto, OutClientFeedbackDto, OutListClientFeedbackDto } from './dto/client'


@Injectable()
export class ClientService {
    constructor(
        @InjectModel(Client)
        private readonly repo: ReturnModelType<typeof Client>,
        @InjectModel(ClientFeedback) private readonly clientFeedbackRepo: ReturnModelType<typeof ClientFeedback>,
        private readonly mapperService: MapperService,
        @Inject(forwardRef(() => JobService))
        private readonly jobService: JobService,
        private readonly jobClientContactService: JobClientContactService,
        private readonly clientContactService: ClientContactService,
    ) {
        this.mapperService.createMap(ClientDetailDto.name, Client.name)
        this.mapperService.createMap(ClientInfoDto.name, Client.name)
    }
    private readonly logger = new Logger(ClientService.name)
    async paginate(options: PaginateOptions, query: FilterQuery<Client>): Promise<PaginateResult<Client>> {
        return this.repo.paginate(query, options)
    }

    async findOne(query: FilterQuery<Client>, populate?: QueryPopulateOptions[]) {
        const queryBuild = this.repo.findOne(query)
        if (populate) {
            return await queryBuild.populate(populate).exec()
        }
        return await queryBuild.exec()
    }
    async delete(user: JwtPayload, client_id: string[]) {
        return await this.repo.update({
            _id: {
                $in: client_id.map(x => new ObjectId(x))
            }
        }, {
            is_deleted: true,
            updated_by: new ObjectId(user.id)
        }).exec()
    }
    async paginateList(filter: InFilterClientParamDto): Promise<ClientListDto> {
        try {
            const clientList = await this.paginate(filter.buildPagingQuery(filter.populate), filter.buildFilterQuery())

            const result = new ClientListDto(filter.page, filter.size)
            result.paginate = filter.paginate
            result.total = clientList.totalDocs
            result.client_list = []
            if (!clientList.totalDocs) return result
            const mapClients = clientList.docs.map((client) => {
                return this.mapperService.map<ClientInfoDto>(
                    client,
                    Client.name,
                    ClientInfoDto.name,
                )
            })
            result.client_list = mapClients
            return result
        } catch (err) { this.logger.error(err) }
    }

    async update(user: JwtPayload, info: ClientInfoDto) {
        return this.repo.findByIdAndUpdate({
            _id: new ObjectId(info.id),
            agency_id: user.agency_id
        }, {
            business_name: info.business_name,
            industry: info.industry,
            updated_by: new ObjectId(user.id)
        })
    }
    async create(user: JwtPayload, createClientDto: CreateClientDetailDto): Promise<Client | null> {
        try {
            const newClient = new this.repo()
            newClient.business_name = createClientDto.business_name
            newClient.industry = createClientDto.industry
            newClient.agency_id = new ObjectId(user.agency_id)
            newClient.created_by = new ObjectId(user.id)
            newClient.text_search = this.createSearchText(newClient, createClientDto.contact_list)
            const savedDoc = await newClient.save()
            if (!savedDoc) {
                return null
            }

            newClient.id = savedDoc.id
            if (createClientDto.contact_list) {
                await Promise.all(createClientDto.contact_list.map(async (contact) => {
                    this.clientContactService.create(user, contact, newClient.id)
                }))
            }
            const client = await this.findOne(
                { _id: savedDoc.id, agency_id: user.agency_id },
                [{ path: 'contact_list' }, { path: 'job_total' }],
            )
            return client

        } catch (error) { this.logger.error(error) }

    }

    async getListFeedback(
        jobClientContactId: string
    ): Promise<OutListClientFeedbackDto> {
        try {
            const feedbacks = await this.clientFeedbackRepo
                .find({
                    job_client_contact_id: new ObjectId(jobClientContactId),
                })
                .populate({ path: 'candidate_id', select: 'id, candidate_name' })
            const listFeedback = new OutListClientFeedbackDto()
            const mapped = feedbacks.map((feedback) => {
                return OutClientFeedbackDto.fromDB(feedback)
            })
            listFeedback.feedback_list = mapped
            return listFeedback
        } catch (error) {
            throw new HttpException(error, 500)
        }
    }
    createSearchText(client: Client, clientContacts: ClientContactTextSearch[]) {
        try {
            let text_search = `${client.business_name || ''} ${client.industry || ''} `
            if (clientContacts && clientContacts.length) {
                clientContacts.forEach(clientContact => {
                    text_search += this.clientContactService.createSearchText(clientContact)
                })
            }
            return text_search
        } catch (error) {
            this.logger.error('unable to build text search for user')
            this.logger.error(error)
        }
    }
    async buildSearchText(client: Client) {
        try {
            const contact_list = await this.clientContactService.list(client.id)
            const text_search = this.createSearchText(client, contact_list.docs)
            if (client.text_search != text_search)
                await this.repo.updateOne({ _id: new ObjectId(client.id) }, {
                    text_search: text_search
                })
        } catch (error) {
            this.logger.error('unable to build text search for client')
            this.logger.error(error)
        }
    }
    async buildSearchTextFromId(id: string) {
        try {
            const client = await this.repo.findById(id)
            if (client) {
                this.buildSearchText(client)
            }
        } catch (error) {
            this.logger.error('unable to build text search for client')
            this.logger.error(error)
        }
    }

    async buildAllSearchText() {
        try {
            const clients = await this.repo.find({ is_deleted: { $ne: true } })
            const promises = clients.map(async client => {
                await this.buildSearchText(client)
            })
            await Promise.all(promises)
        } catch (error) {
            this.logger.error('unable to build text search for client')
            this.logger.error(error)
        }
    }

    async addMultilpleClientContactToJob(
        payload: JwtPayload, 
        _multipleClientContact: AddMultipleClientContact, 
        job_id: string
    ): Promise<void> {
        
        const job = await this.jobService.findOne(new ObjectId(job_id))
        const exitsContacts = _multipleClientContact.client_contact_list.reduce(function(ids, obj){
            if(obj.id){
                ids.push(obj.id)
            }
            return ids
        }, [])

        let addToJobs = exitsContacts
        
        const newContacts = _multipleClientContact.client_contact_list.filter(contact => !contact?.id) || []
        // Add new contact 
        if(newContacts.length){
            const promiseCreateContact = newContacts.map(async contact => {
                const newContact = await this.clientContactService.create(payload, contact, job?.client_id.toString())
                if(!newContact.id) 
                    throw new HttpException(
                        'add_contact_error',
                        500,
                    )
                return newContact.id
            })
            const contactIds = await Promise.all(promiseCreateContact)
            addToJobs = exitsContacts.concat(contactIds)
        }
        // Add contacts to job
        if(addToJobs.length){
            addToJobs = [...new Set(addToJobs)]
            const promisesAddToJob = addToJobs.map(
                async (client_contact_id) => {
                    const jobContact = await this.jobClientContactService.findOne(
                        {
                            client_contact_id: client_contact_id,
                            job_id: job_id,
                        },
                    )
                    if (jobContact)
                        throw new HttpException(
                            'duplicate_contact_in_job',
                            500,
                        )
                    await this.jobClientContactService.AddToJob(
                        {
                            contact_id: client_contact_id,
                            job_id: job_id,
                        },
                        payload,
                    )
                },
            )
            await Promise.all(promisesAddToJob)
        }
        await this.jobService.buildSearchText(job_id)
    }
}
