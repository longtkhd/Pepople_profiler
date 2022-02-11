import { Inject, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
// import { ObjectId } from 'aws-sdk/clients/codecommit';
import { plainToClass } from 'class-transformer';
import { InjectModel } from 'nestjs-typegoose';
import { JwtPayload } from 'src/auth/dto/login';
import {
    InterviewStatus,
    InterviewTime,
    JobClientContact,
} from 'src/schemas/job.schema';
import { CreateInterviewTime } from './dto/createInterviewTime.dto';
import { ObjectId } from 'mongodb';
import { ClientContact } from 'src/schemas/client.schema';
import { Candidate, CandidateJob } from 'src/schemas/candidate.schema';
import { InterviewNotifi } from 'src/client/interview_notifi.service';

@Injectable()
export class InterviewTimeService {
    constructor(
        private readonly interviewNotifi: InterviewNotifi,
        @InjectModel(InterviewTime)
        private readonly interviewTime: ReturnModelType<typeof InterviewTime>,
        @InjectModel(JobClientContact)
        private readonly repo: ReturnModelType<typeof JobClientContact>,
        @InjectModel(ClientContact)
        private readonly clientContact: ReturnModelType<typeof ClientContact>,
        @InjectModel(Candidate)
        private readonly candidate: ReturnModelType<typeof Candidate>,
        @InjectModel(CandidateJob)
        private readonly candidateJob: ReturnModelType<typeof CandidateJob>,
        @InjectModel(JobClientContact)
        private readonly jobclientcontact: ReturnModelType<
            typeof JobClientContact
        >,
    ) {}

    async createInterviewTime(
        payload: JwtPayload,
        interviewTimeDto: any,
        job_id: any,
        info: string,
        invite_token: string,
    ): Promise<any> {
        const clientContactJob = await this.repo.findOne({
            invite_token: invite_token,
        });
        const clientContact = await this.clientContact.findById(
            clientContactJob.client_contact_id,
        );
        if (interviewTimeDto.length > 0) {
            for (let i = 0; i < interviewTimeDto.length; i++) {
                const time = new CreateInterviewTime();
                // time.created_by = payload.agency_id || "";
                time.job_id = job_id;
                time.date = interviewTimeDto[i].date;
                time.time_start = interviewTimeDto[i].time_start;
                time.time_end = interviewTimeDto[i].time_end;
                time.info = info;
                time.create_by = clientContact;
                time.time_zone = interviewTimeDto[i].time_zone
                await this.interviewTime.insertMany(time);
            }
        }
        await this.interviewTime.updateMany(
            { job_id: new ObjectId(job_id) },
            { info: info },
        );
        return clientContact;
    }
    async getInterviewsTime(job_id: string, payload: any): Promise<any> {
        const time = await this.interviewTime.find({
            job_id: new ObjectId(job_id),
        });
        const timeCompare = new Date();
        const data = time.filter((item) => {
            return item.date.getTime() - timeCompare.getTime() > 0;
        });
        return data;
    }
    async getAllTime(job_id: string){
        const time = await this.interviewTime.find({
            job_id: new ObjectId(job_id),
        });
        return time;
    }
    async findOne(id: string): Promise<InterviewTime> {
        const time = await this.interviewTime.findById(id);
        return time;
    }
    async delete(listTimeDelete: any){
        for(let i = 0; i< listTimeDelete.length; i++){
            //time to delete
            const time = await this.interviewTime.findById(listTimeDelete[i]);
            //delete
            if(time != null){
                await this.interviewTime.findByIdAndDelete({
                    _id: new ObjectId(listTimeDelete[i]),
                });
                // get all time in job
                const data = await this.interviewTime.find({ job_id: time.job_id });
                // get list candidatejob
                const candidateInJob = await this.candidateJob.find({
                    job_id: time.job_id,
                });
                // check
                // for candidate
                if (data.length < 1 && candidateInJob.length > 0) {
                    // time == null
                    for (let j = 0; j < candidateInJob.length; j++) {
                        candidateInJob[j].interview_status = 0;
                        candidateInJob[j].client_contact_time_list = [];
                        await candidateInJob[j].save();
                    }
                } else {
                    for (let j = 0; j < candidateInJob.length; j++) {
                            let listAfterFilter =
                                candidateInJob[j].client_contact_time_list.filter(
                                    (item) => {
                                        return item.time_id != listTimeDelete[i];
                                    },
                                );
                            if (listAfterFilter.length < 1) {
                                candidateInJob[j].client_contact_time_list =
                                    listAfterFilter;
                                candidateInJob[j].interview_status = 1;
                                await candidateInJob[j].save();
                            } else {
                                candidateInJob[j].client_contact_time_list =
                                    listAfterFilter;
                                await candidateInJob[j].save();
                            }
                    }
                }
                const clientContact = await this.jobclientcontact.find({
                    job_id: time.job_id,
                });
                // for client contact
                if (clientContact.length > 0) {
                    for (let j = 0; j < clientContact.length; j++) {
                        if (clientContact[j].interview_time.length > 0) {
                            let timeBiHuy = clientContact[j]
                            .interview_time.filter((item) => {
                                return `${item.time_id}` == `${time._id}`;
                            });
                            if(timeBiHuy.length > 0) {
                                let clientContactSendMail = await this.clientContact.findById(`${clientContact[j].client_contact_id}`)
                                for(let k = 0; k <timeBiHuy.length; k ++){
                                    let candidatePostpone = await this.candidate.findById(`${timeBiHuy[k].candidate_id}`);
                                    await this.interviewNotifi.sendPostpone(clientContactSendMail,candidatePostpone);
                                }
                            } 
                            let interviewtimes = clientContact[j]
                            .interview_time.filter((item) => {
                                return `${item.time_id}` != `${time._id}`;
                            });
                            if (interviewtimes.length < 1) {
                                clientContact[j].interview_status =
                                    InterviewStatus.interview;
                            }
                            clientContact[j].interview_time = interviewtimes;
                            await clientContact[j].save();
                        }
                    }
                }
                if (data.length < 1) {
                    for (let j = 0; j < clientContact.length; j++) {
                        clientContact[j].interview_status =
                            InterviewStatus.pre_interview;
                        clientContact[j].interview_time = [];
                        await clientContact[j].save();
                    }
                }
                // // candidate injob
                const candidateRemain = [];
                for (let i = 0; i < candidateInJob.length; i++) {
                    candidateRemain.push(candidateInJob[i].client_contact_time_list);
                } //--> 1 mang cac mang
                const listObjectTimeInCandidate = [].concat.apply(
                    [],
                    candidateRemain,
                );
                console.log(listObjectTimeInCandidate);
                const filterTime = data.filter((time) => {
                    return listObjectTimeInCandidate.filter((x) => {
                        return `${time._id}` == x.time_id;
                    }).length == 0
                })
                if(filterTime.length < 1){
                    // candidate o trang thai 0 -> 1;
                    // else giu nguyen
                    for (let i = 0; i < candidateInJob.length; i++) {
                        if (candidateInJob[i].interview_status == 1) {
                            candidateInJob[i].interview_status = 0;
                            await candidateInJob[i].save();
                        }
                    }
                }
            }
        }
    }
}
