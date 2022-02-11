import {
    forwardRef,
    HttpException,
    Inject,
    Injectable,
    Logger,
} from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import {
    ClientFeedback,
    InterviewStatus,
    JobClientContact,
} from '../schemas/job.schema';

import {
    AddJobContactDto,
    ChangeStatusInterviewDto,
    JobClientContactFilterDto,
} from './dto/job.req.dto';
import { QueryPopulateOptions, Types, FilterQuery } from 'mongoose';
import { JwtPayload } from 'src/auth/dto/login';
import {
    JobClientContactMailDto,
    OutJobClientContactDto,
} from './dto/job.res.dto';

import { ObjectId } from 'mongodb';
import { MapperService } from 'src/shared/mapper/mapper.service';
import { InviteClientJobMail } from 'src/client/dto/client';
import { JobService } from './job.service';
import { ClientContact } from 'src/schemas/client.schema';
import { InterviewTimeService } from 'src/interviewTime/interviewTime.service';
import { Candidate } from 'src/schemas/candidate.schema';

@Injectable()
export class JobClientContactService {
    private readonly logger = new Logger('JobClientContactService');
    private readonly populateClient: QueryPopulateOptions = {
        path: 'client_contact_id',
        //select: 'contact_name contract_number email client_id'
    };
    private readonly populateUser: QueryPopulateOptions = {
        path: 'created_by',
        select: 'id agency_id',
    };
    private readonly populateInvited: QueryPopulateOptions = {
        path: 'invited_by',
    };
    constructor(
        @InjectModel(JobClientContact)
        private readonly repo: ReturnModelType<typeof JobClientContact>,
        @InjectModel(ClientFeedback)
        private readonly repoFeedback: ReturnModelType<typeof ClientFeedback>,
        @InjectModel(Candidate)
        private readonly candidate: ReturnModelType<typeof Candidate>,
        @Inject(forwardRef(() => JobService))
        private readonly jobService: JobService,
        private readonly mapperService: MapperService,
        private readonly timeService: InterviewTimeService,
        private readonly interviewTimeService: InterviewTimeService,
    ) {
        this.mapperService.createMap(
            JobClientContactMailDto.name,
            OutJobClientContactDto.name,
        );
    }

    async list(filter: JobClientContactFilterDto) {
        const query: FilterQuery<JobClientContact> = {};

        if (filter.job_id) {
            query.job_id = new ObjectId(filter.job_id);
        }

        const result = await this.repo
            .find(query)
            .populate(this.populateClient)
            .exec();

        return result.map((x) => {
            return OutJobClientContactDto.fromDB(x);
        });
    }
    async findAll(job_id: string){
        const result = await this.repo.find({job_id: new ObjectId(job_id)});
        return result;
    }
    async findOne(
        query: FilterQuery<JobClientContact>,
        populate?: QueryPopulateOptions[],
    ) {
        const queryBuild = this.repo.findOne(query);

        if (populate) {
            return await queryBuild.populate(populate).exec();
        }
        const dbObj = await queryBuild.populate(this.populateClient).exec();
        return OutJobClientContactDto.fromDB(dbObj);
    }
    async AddToJob(dto: AddJobContactDto, payload: JwtPayload) {
        const contactJob = new this.repo();
        contactJob.client_contact_id = Types.ObjectId(dto.contact_id);
        contactJob.job_id = Types.ObjectId(dto.job_id);
        contactJob.created_by = Types.ObjectId(payload.id);
        const t = await contactJob.save();

        return t;
    }
    async delete(job_id: string, contact_id: string) {
        return this.repo.findOneAndDelete({
            job_id: Types.ObjectId(job_id),
            client_contact_id: Types.ObjectId(contact_id),
        });
    }

    async findJobClientContactById(
        client_contact_id: string,
        job_id: string,
    ): Promise<OutJobClientContactDto> {
        const jobClientContact = await this.repo
            .findOne({
                client_contact_id: new ObjectId(client_contact_id),
                job_id: new ObjectId(job_id),
            })
            .populate(this.populateClient)
            .exec();
        return OutJobClientContactDto.fromDB(jobClientContact);
    }

    async inviteJobClientContact(
        payload: JwtPayload,
        client_contact_id: string,
        job_id: string,
        template: InviteClientJobMail,
    ) {
        const jobClientContact = await this.repo
            .findOne({
                client_contact_id: new ObjectId(client_contact_id),
                job_id: new ObjectId(job_id),
            })
            .populate(this.populateClient)
            .exec();
        const jobDetail = await this.jobService.jobDetail(
            payload.agency_id,
            job_id,
        );

        if (!jobClientContact)
            throw new HttpException('Client contact not found!', 404);
        const contact_name =
            (jobClientContact.client_contact_id as ClientContact).first_name ||
            '';
        const job_position = jobDetail.job_title;
        if (!jobDetail) throw new HttpException('Job not found!', 404);
        const application_count = jobDetail?.recruitment_activity
            ? jobDetail?.recruitment_activity[0]?.value
            : null;
        // if (jobClientContact.invite_token = null, jobClientContact.invited_date = null, jobClientContact.is_invite = false){
        if (!jobClientContact.is_invite) {
            jobClientContact.invite_token = String(new Types.ObjectId());
            jobClientContact.invited_date = new Date();
            jobClientContact.invited_by = Types.ObjectId(payload.id);
            jobClientContact.is_invite = true;
            const hasTime = await this.interviewTimeService.getInterviewsTime(
                job_id,
                payload,
            );
            if (hasTime.length > 0) {
                jobClientContact.interview_status = InterviewStatus.interview;
            }
            await jobClientContact.save();

            const mappedObject =
                OutJobClientContactDto.fromDB(jobClientContact);
            if (template && template.body && template.subject) {
                mappedObject.subject = template.subject
                    .replace(/\[CLIENT_NAME]/g, `${contact_name}`)
                    .replace(/\[JOB_POSITION]/g, `${job_position}`)
                    .replace(/\[COMPANY_NAME]/g, `${jobDetail?.business_name}`);
                mappedObject.body = template.body
                    .replace(
                        /\[CONTACT_NUMBER]/g,
                        `<strong>${payload.phone_number || ''}</strong>`,
                    )
                    .replace(/\[CLIENT_NAME]/g, `${contact_name}`)
                    .replace(
                        /\[AGENCY_NAME]/g,
                        `<strong>${payload.agency_name || ''}</strong>`,
                    )
                    .replace(
                        /\[DATE_MEETING]/g,
                        `<strong>${new Date().setDate(
                            new Date().getDate() + 1,
                        )}</strong>`,
                    )
                    .replace(
                        /\[RECRUITER'S_NAME]/g,
                        `<strong>${payload.first_name || ''}</strong>`,
                    )
                    .replace(
                        /\[APPLICANTS_COUNT]/g,
                        application_count
                            ? `These candidates have been selected from a total pool of <strong>${application_count}</strong> applicants</strong>.`
                            : '',
                    );
            }
            return mappedObject;
        }
    }

    async revokeJobClientContact(
        client_contact_id: string,
        job_id: string,
    ): Promise<JobClientContact> {
        const jobClientContact = await this.repo.findOne({
            client_contact_id: Types.ObjectId(client_contact_id),
            job_id: Types.ObjectId(job_id),
        });

        if (!jobClientContact)
            throw new HttpException('Client contact not found!', 404);

        jobClientContact.invite_token = null;
        jobClientContact.invited_date = null;
        jobClientContact.is_invite = false;
        jobClientContact.has_feedback = false;
        jobClientContact.in_review = false;
        jobClientContact.interview_time = [];
        jobClientContact.interview_status = 0;
        const jobClient = await jobClientContact.save();
        await this.repoFeedback.deleteMany({
            job_client_contact_id: jobClient._id,
        });
        return jobClient;
    }

    async findClientContactByToken(
        token: string,
    ): Promise<OutJobClientContactDto> {
        const jobClientContact = await this.repo
            .findOne({
                invite_token: token,
            })
            .populate([
                this.populateClient,
                this.populateUser,
                this.populateInvited,
            ])
            .exec();

        if (!jobClientContact) throw new HttpException('INVALID_TOKEN', 404);

        const mappedObject = OutJobClientContactDto.fromDB(jobClientContact);

        return mappedObject;
    }

    async updateStateJobClientContact(
        id: string,
        hasFeedback: boolean,
        inReview: boolean,
    ) {
        try {
            await this.repo.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { has_feedback: hasFeedback, in_review: inReview },
                { new: true },
            );
        } catch (error) {
            throw new HttpException(error, 500);
        }
    }
    async findClientContact(client_contact_id: string, job_id: string) {
        const clientContact = await this.repo.findOne({
            client_contact_id: new ObjectId(client_contact_id),
            job_id: new ObjectId(job_id),
        });
        return clientContact;
    }
    async updateInterviewTime(
        arrayTime: any,
        client_contact_id: string,
        job_id: string,
    ) {
        try {
            const newTime = [];
            for (let i = 0; i < arrayTime.length; i++) {
                const time = await this.timeService.findOne(
                    arrayTime[i].time_id,
                ); // interview time
                const candidate = await this.candidate.findById(
                    arrayTime[i].candidate_id,
                );
                if (time != null && candidate != null) {
                    time.info = arrayTime[i].info;
                    const interview_time = {
                        // interview time of 1 candidate
                        candidate_id: new ObjectId(arrayTime[i].candidate_id),
                        time_id: new ObjectId(arrayTime[i].time_id),
                    };
                    newTime.push(interview_time);
                }
            }
            await this.repo.findOneAndUpdate(
                {
                    job_id: new ObjectId(job_id),
                    client_contact_id: new ObjectId(client_contact_id),
                },
                { interview_time: newTime },
            );
            return newTime;
        } catch (error) {
            throw new HttpException(error, 500);
        }
    }

    async findTimeOfJobClientContact(
        payload: JwtPayload,
        client_contact_id: string,
        job_id: string,
    ) {
        const jobClientContact = await this.repo.findOne({
            job_id: new ObjectId(job_id),
            client_contact_id: new ObjectId(client_contact_id),
        });
        const dataa = [];
        for (let i = 0; i < jobClientContact.interview_time.length; i++) {
            const time = await this.timeService.findOne(
                `${jobClientContact.interview_time[i].time_id}`,
            );
            const result = {
                candidate_id: jobClientContact.interview_time[i].candidate_id,
                time: time,
            };
            dataa.push(result);
        }
        return dataa;
    }

    async updateStatusInterview(
        job_id: string,
        interview_status,
        client_contact_id?: any,
    ) {
        if (client_contact_id) {
            try {
                await this.repo.update(
                    {
                        job_id: new ObjectId(job_id),
                        client_contact_id: new ObjectId(client_contact_id),
                    },
                    { interview_status: interview_status },
                    { new: true },
                );
            } catch (error) {
                throw new HttpException(error, 500);
            }
        } else {
            try {
                await this.repo.updateMany(
                    {
                        job_id: new ObjectId(job_id),
                    },
                    { interview_status: interview_status },
                    { new: true },
                );
            } catch (error) {
                throw new HttpException(error, 500);
            }
        }
    }
}
