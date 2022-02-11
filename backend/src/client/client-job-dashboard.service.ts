import { HttpException, Injectable, Logger } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { ObjectId } from 'mongodb'
import { QueryPopulateOptions } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { AgencyService } from 'src/agency/agency.service'
import { CandidateJobFilterParamDto } from 'src/candidate/dto/input'
import { CandidateJobService } from 'src/candidate/job-candidate.service'
import { JobClientContactService } from 'src/job/job-client-contact.service'
import { JobService } from 'src/job/job.service'
import { SocketService } from 'src/notification/socket.service'
import { ClientFeedback } from 'src/schemas/job.schema'
import { NotificationType } from 'src/schemas/notification.schema'
import { AddClientFeedbackDto, OutClientFeedbackDto, OutListClientFeedbackDto } from './dto/client'
import { ClientJobDashboardDetail } from './dto/client-job-dashboard.dto'

@Injectable()
export class ClientJobDashboardService {
    constructor(
        @InjectModel(ClientFeedback)
        private readonly clientFeedbackRepo: ReturnModelType<typeof ClientFeedback>,
        private readonly jobClientContactService: JobClientContactService,
        private readonly jobService: JobService,
        private readonly candidateJobService: CandidateJobService,
        private readonly agencyService: AgencyService,
        private readonly socketService: SocketService
    ) { }
    private readonly logger = new Logger(ClientJobDashboardService.name);
    private populateCandidate: QueryPopulateOptions = {
        path: 'candidate_id',
        select: 'id, candidate_name'
    }

    async getDashboardDetail(
        inviteToken: string,
    ): Promise<ClientJobDashboardDetail> {
        const result = new ClientJobDashboardDetail()
        const jobClientContact = await this.jobClientContactService.findClientContactByToken(
            inviteToken,
        )

        const job = await this.jobService.getjobDashboard(inviteToken)
        const _inFilter = new CandidateJobFilterParamDto()
        _inFilter.job_id = job.id
        const candidates = await this.candidateJobService.paginateCandidateList(
            _inFilter,
        )
        const agencyId = job?.agency_id
        if (agencyId) {
            result.agency_id = agencyId
            const agency = await this.agencyService.getAgencyDetail(agencyId)
            result.agency = agency
            if (agency?.company_info) result.company_info = agency?.company_info
        }

        result.job_client_contact = jobClientContact
        if (jobClientContact.invited_by) {
            result.invited_by = jobClientContact.invited_by
            result.phone = jobClientContact.invited_phone
        }
        if (job) result.job_detail = job
        if (candidates) {
            const mapFeedbackStatus = await Promise.all(candidates.candidate_list.map(async candidate => {
                const feedback = await this.clientFeedbackRepo.findOne({
                    job_client_contact_id: new ObjectId(
                        jobClientContact.job_client_contact_id,
                    ),
                    candidate_id: new ObjectId(candidate.id)
                })
                return { ...candidate, status: feedback?.status }
            }))
            result.candidate_list = mapFeedbackStatus
        }
        /* update in review */
        if (jobClientContact && !jobClientContact.in_review) {
            await this.jobClientContactService.updateStateJobClientContact(
                jobClientContact.job_client_contact_id,
                jobClientContact.has_feedback,
                true
            )
            // notification view report
            const content = `<div><span class="notification-content-highlight">${jobClientContact?.first_name} ${jobClientContact?.last_name}</span>
                has viewed the candidate reports of <span class="notification-content-highlight">${job?.job_title}</span>.</div>`
            await this.socketService.makeNotification(
                job?.created_by.toString(),
                'Candidate reports viewed',
                content,
                NotificationType.CLIENT_VIEWED_REPORT,
                jobClientContact?.client_id.toString(),
            )
        }
        return result
    }

    async findFeedbackByEmail(jobClientContactId: string, email: string, candidate_id: string): Promise<ClientFeedback | null> {
        const feedback = await this.clientFeedbackRepo.findOne({
            job_client_contact_id: new ObjectId(jobClientContactId),
            email: email,
            candidate_id: new ObjectId(candidate_id)
        })
        return feedback
    }

    async createClientFeedback(
        jobClientContactId: string,
        _clientFeedback: AddClientFeedbackDto,
    ): Promise<ClientFeedback> {
        try {
            const newFeedback = new this.clientFeedbackRepo()
            newFeedback.job_client_contact_id = new ObjectId(
                jobClientContactId,
            )
            newFeedback.candidate_id = new ObjectId(
                _clientFeedback.candidate_id,
            )
            newFeedback.email = _clientFeedback.email
            newFeedback.rate = _clientFeedback.rate
            newFeedback.status = _clientFeedback.status
            if (_clientFeedback.comment) newFeedback.comment = _clientFeedback.comment
            return await newFeedback.save()
        } catch (error) { throw new HttpException(error, 500) }
    }

    async updateClientFeedback(
        jobClientContactId: string,
        _clientFeedback: AddClientFeedbackDto,
    ): Promise<ClientFeedback> {
        try {
            return await this.clientFeedbackRepo.findOneAndUpdate({
                job_client_contact_id: jobClientContactId,
                email: _clientFeedback.email,
                candidate_id: _clientFeedback.candidate_id
            }, {
                status: _clientFeedback.status,
                comment: _clientFeedback?.comment,
                rate: _clientFeedback.rate
            }, { new: true })
        } catch (error) { throw new HttpException(error, 500) }
    }

    async getFeedbackByToken(
        inviteToken: string,
        candidateId: string
    ): Promise<OutListClientFeedbackDto | null> {
        try {
            const jobClientContact = await this.jobClientContactService.findClientContactByToken(
                inviteToken,
            )
            const jobClientContactId = jobClientContact?.job_client_contact_id
            if (!jobClientContactId) return null
            const feedbacks = await this.clientFeedbackRepo
                .find({
                    job_client_contact_id: new ObjectId(jobClientContactId),
                    candidate_id: new ObjectId(candidateId),
                }).sort({ updated_at: -1 })
                .populate(this.populateCandidate)
                .exec()
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
    async exportJobRecruitmentActivity(inviteToken: string) {
        const job = await this.jobService.getjobDashboard(inviteToken)
        
        return await this.jobService.exportJobRecruitmentActivity(job.id)
    }
}
