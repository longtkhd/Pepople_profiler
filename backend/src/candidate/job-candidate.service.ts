import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import * as _ from 'lodash';
import { BinaryLike, createHash } from 'crypto';
import {
    Candidate,
    CandidateJob,
    CompetenceAssessmentWheels,
} from 'src/schemas/candidate.schema';
import { JwtPayload } from 'src/auth/dto/login';
import { ObjectId } from 'mongodb';
import { Logger } from '@nestjs/common/services/logger.service';
import { CandidateJobFilterParamDto } from './dto/input';
import { CandidateJobInfo, CandidateJobListDto } from './dto/candidate';
import { MapperService } from 'src/shared/mapper/mapper.service';
import { CandidateAssessmentService } from './candidate-assessment.service';
import { InterviewTimeService } from 'src/interviewTime/interviewTime.service';

export const md5 = (contents: BinaryLike) =>
    createHash('md5').update(contents).digest('hex');

@Injectable()
export class CandidateJobService {
    constructor(
        @InjectModel(CandidateJob)
        private readonly repo: ReturnModelType<typeof CandidateJob>,
        @Inject(forwardRef(() => CandidateAssessmentService))
        private candidateAssessmentService: CandidateAssessmentService,
        private readonly mapperService: MapperService,
        @InjectModel(Candidate)
        private readonly candidateModule: ReturnModelType<typeof Candidate>,
        private readonly interviewTimeService: InterviewTimeService,
    ) {
        this.mapperService.createMap(CandidateJob.name, CandidateJobInfo.name);
    }

    private readonly logger = new Logger(CandidateJobService.name);
    public async paginateCandidateList(filter: CandidateJobFilterParamDto) {
        try {
            const list = await this.repo
                .find(filter.buildFilterQuery())
                .populate({
                    path: 'candidate_id',
                })
                .exec();
            const result = new CandidateJobListDto();

            // userList[0]
            const mapJob = await Promise.all(
                list.map(async (j) => {
                    const mapped = CandidateJobInfo.fromDB(j);

                    const candidate = j.candidate_id as Candidate;
                    if (candidate && candidate.id && filter.job_id) {
                        const assessments =
                            await this.candidateAssessmentService.getCandidateAssessmentDetail(
                                candidate.id,
                                filter.job_id,
                            );
                        if (assessments && assessments.length) {
                            const completeStatus = ['Submitted', 'Downloaded'];
                            const completedAssessment = assessments.filter(
                                (x) => completeStatus.indexOf(x.status) > -1,
                            );
                            mapped.assessment_status =
                                completedAssessment.length == assessments.length
                                    ? 'Completed'
                                    : 'Invited';
                        } else {
                            mapped.assessment_status = 'Not invited yet';
                        }
                    }
                    mapped.job_id = j.job_id.toString();

                    return mapped;
                }),
            );

            result.candidate_list = mapJob;
            return result;
        } catch (error) {
            console.log(error);
            this.logger.error(error);
        }
    }
    public async addCandidateToJob(
        payload: JwtPayload,
        job_id: string,
        candidate_id: string,
    ) {
        try {
            const dbModel = new this.repo();
            dbModel.created_by = new ObjectId(payload.id);
            dbModel.candidate_id = new ObjectId(candidate_id);
            dbModel.job_id = new ObjectId(job_id);
            const allTime = await this.interviewTimeService.getAllTime(job_id);
            // tim all time in candidatejob
            // 1: get candidateinjob
            const candidateJobOfJob = await this.getListCandidateOfJob(job_id);
            const timeOfListCandidate = []; // [{time_id, client_contact_id}]
            for (let i = 0; i < candidateJobOfJob.length; i++) {
                timeOfListCandidate.push(
                    candidateJobOfJob[i].client_contact_time_list,
                );
            }
            // check time slot doesn't use
            const listObjectTimeInCandidate = [].concat.apply(
                [],
                timeOfListCandidate,
            );
            let timeNotUse = allTime.filter((item) => {
                return (
                    listObjectTimeInCandidate.filter((time) => {
                        return `${item._id}` == time.time_id;
                    }).length == 0
                );
            });

            if(timeNotUse.length > 0){
                dbModel.interview_status = 1;
            }
            const res = await dbModel.save();
            if (res && res.id) {
                return this.repo.findById(res.id).exec();
            }
            return null;
        } catch (error) {
            this.logger.log(error);
            throw error;
        }
    }
    public async removeCandidateFromJob(job_id: string, candidate_id: string) {
        try {
            return await this.repo
                .deleteMany({
                    job_id: new ObjectId(job_id),
                    candidate_id: new ObjectId(candidate_id),
                })
                .exec();
        } catch (error) {
            this.logger.log(error);
            throw error;
        }
    }

    async updateRecruiterAssessment(
        candidateId: string,
        jobId: string,
        recruiterAssessment: CompetenceAssessmentWheels,
        isApply?: boolean,
    ): Promise<CandidateJob> {
        await this.repo.updateOne(
            {
                candidate_id: new ObjectId(candidateId),
                job_id: new ObjectId(jobId),
            },
            {
                recruiter_assessments: recruiterAssessment,
            },
        );

        if (recruiterAssessment?.is_apply && isApply) {
            await this.updateRecruiterAssessmentOtherCandidiates(
                candidateId,
                jobId,
                recruiterAssessment,
            );
        }

        return await this.getCandidateJob(candidateId, jobId);
    }

    async getCandidateJob(
        candidateId: string,
        jobId: string,
    ): Promise<CandidateJob | null> {
        return this.repo.findOne({
            candidate_id: new ObjectId(candidateId),
            job_id: new ObjectId(jobId),
        });
    }

    async updateRecruiterAssessmentOtherCandidiates(
        candidateId: string,
        jobId: string,
        newData: CompetenceAssessmentWheels,
    ): Promise<any> {
        const otherCandidates = await this.repo.find({
            job_id: new ObjectId(jobId),
            candidate_id: { $ne: new ObjectId(candidateId) },
        });
        const promises = otherCandidates.map(async (c) => {
            // eslint-disable-next-line prefer-const
            let data = _.cloneDeep(newData);
            if (c.candidate_id.toString() != candidateId) {
                const updateInfo =
                    CandidateJobService.mappedDataRecruiterAssessment(
                        data,
                        c?.recruiter_assessments,
                    );
                return await this.updateRecruiterAssessment(
                    c.candidate_id.toString(),
                    jobId,
                    updateInfo,
                    false,
                );
            }
        });
        return await Promise.all(promises);
    }

    static mappedDataRecruiterAssessment(
        newWheel: CompetenceAssessmentWheels,
        oldWheels: CompetenceAssessmentWheels,
    ): CompetenceAssessmentWheels {
        const newWheels = { ...newWheel, is_apply: oldWheels?.is_apply };
        if (!oldWheels) return newWheels;

        for (let i = 0; i < newWheels.wheels.length; i++) {
            const wheel = newWheels.wheels[i];
            if (!wheel.competency_list?.length) {
                continue;
            }
            const existWheelName = oldWheels.wheels.find(
                (w) => w?.wheel_name === wheel?.wheel_name,
            );
            if (existWheelName) {
                for (let j = 0; j < wheel.competency_list.length; j++) {
                    const competency = wheel.competency_list[j];
                    const existCompetency =
                        existWheelName.competency_list?.find(
                            (c) =>
                                c?.name?.toLowerCase() ===
                                competency?.name.toLowerCase(),
                        );

                    if (existCompetency) {
                        console.log(existCompetency);
                        competency.status = existCompetency.status;
                        competency.value = existCompetency.value;
                        competency.weight = existCompetency.weight;
                    } else {
                        competency.value = undefined;
                        competency.weight = undefined;
                    }
                }
            }
        }
        return newWheels;
    }
    async getListCandidateOfJob(job_id: string) {
        const data = await this.repo.find({ job_id: new ObjectId(job_id) });
        return data;
    }
    async updateInterviewStatus(
        job_id: string,
        interview_status: number,
        client_contact_id?: string,
        candidate_id?: string,
        time_id?: string,
    ) {
        // 0: default, 1: setup time interview  , 2: has send mail
        // job_id --> (candidate_job) ==> [candidate need update interview_status] ==> loop to update status
        if (!candidate_id) {
            // update toàn bộ  0,1->1, 2 thì giữ nguyên
            const candidate = await this.repo.find({
                job_id: new ObjectId(job_id),
            });
            const result = candidate.map(async (item) => {
                if (item.interview_status == 0) {
                    item.interview_status = 1;
                }
                await item.save();
                return item;
            });
            return result;
        } else {
            // const dataa = await this.candidateModule.findById(candidate_id);
            const dataa = await this.repo.findOne({
                job_id: new ObjectId(job_id),
                candidate_id: new ObjectId(candidate_id),
            });
            dataa.interview_status = interview_status;
            const list_client_time = dataa.client_contact_time_list.filter(
                (item) => {
                    return item.client_contact_id != client_contact_id;
                },
            );
            list_client_time.push({
                client_contact_id: client_contact_id,
                time_id: time_id,
            });
            dataa.client_contact_time_list = list_client_time;
            await dataa.save();
            return dataa;
        }
    }
    async updateStatusWhenUncheck(
        job_id: string,
        candidate_id: string,
        client_contact_id: string,
    ) {
        const dataa = await this.repo.findOne({
            job_id: new ObjectId(job_id),
            candidate_id: new ObjectId(candidate_id),
        });
        const list_client_time = dataa.client_contact_time_list.filter(
            (item) => {
                return item.client_contact_id != client_contact_id;
            },
        );
        dataa.client_contact_time_list = list_client_time;
        if (list_client_time.length < 1) {
            dataa.interview_status = 1;
        }
        await dataa.save();
        return dataa;
    }
}
