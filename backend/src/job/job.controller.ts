import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Response,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    Get,
    Delete,
    Res,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { JwtPayload } from '../auth/dto/login';
import { JWTAuthGuard } from '../auth/guards/auth.guard';
import { BaseResponse } from '../shared/base.dto';
import { User } from '../shared/decorators/user.decorator';
import { GetOperationId } from '../shared/utils/get-operation-id';
import { JobService } from './job.service';
import {
    InterviewStatus,
    InterviewTime,
    Job,
    JobClientContact,
} from '../schemas/job.schema';
import { JobGuard } from './guards/job.guard';

import {
    JobFilterParamDto,
    CreateJobDto,
    ChangeJobStatusDto,
    UpdateJobRequestDto,
    JobRecruitmentActivityDto,
    JobClientContactFilterDto,
    ChangeJobRecruiterDto,
    UpdateJobRecruitmentActivityDto,
    ChangeStatusInterviewDto,
} from './dto/job.req.dto';
import {
    OutJobListingDto,
    ChangeJobStatusResultDto,
    OutChangeJobsStatusResultDto,
    ListJobRecruitmentActivityDto,
    JobDetailDto,
    OutJobClientContactDto,
    ChangeJobAssignUserResultDto,
} from './dto/job.res.dto';
import {
    ClientListByProjectDto,
    InFilterClientParamDto,
} from 'src/client/dto/client';
import { JobClientContactService } from './job-client-contact.service';
import { ObjectId } from 'mongodb';
import { ClientContact } from 'src/schemas/client.schema';
import { CandidateJobService } from 'src/candidate/job-candidate.service';
import { CandidateJobFilterParamDto } from 'src/candidate/dto/input';
//import { ClientService } from 'src/client/client.service'
import { InterviewTimeService } from 'src/interviewTime/interviewTime.service';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { InterviewTimeDto } from './dto/interviewTime.dto';

@Controller('job')
@ApiTags('job')
@UseGuards(JWTAuthGuard)
export class JobController {
    constructor(
        private readonly jobService: JobService,
        private readonly jobClientContactService: JobClientContactService,
        private readonly candidateJobService: CandidateJobService,
        private readonly interviewTimeService: InterviewTimeService,
        @InjectModel(JobClientContact)
        private readonly repo: ReturnModelType<typeof JobClientContact>,
        @InjectModel(ClientContact)
        private readonly clientContact: ReturnModelType<typeof ClientContact>,
    ) {
        // do nothing
    }
    @HttpCode(HttpStatus.OK)
    @Post('re-assign-user')
    @UseGuards(JobGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: ChangeJobAssignUserResultDto,
        description: 'API to change jobs recruiter',
    })
    @ApiOperation(
        GetOperationId('job', 're-assign-user', 'API to change jobs recruiter'),
    )
    async changeJobRecruiter(
        @Response() res,
        @User() payload: JwtPayload,
        @Body() _ChangeJobRecruiterDto: ChangeJobRecruiterDto,
    ): Promise<BaseResponse<ChangeJobAssignUserResultDto[]>> {
        const response: BaseResponse<ChangeJobAssignUserResultDto[]> = {
            success: true,
        };
        const list: Array<ChangeJobAssignUserResultDto> = [];
        for await (const j of _ChangeJobRecruiterDto.job_id) {
            const resOne = await this.jobService.updateJobRecruiter(
                payload,
                j,
                new ObjectId(_ChangeJobRecruiterDto.assign_user),
            );
            list.push(resOne);
        }
        response.data = list;
        return res.status(HttpStatus.CREATED).json(response);
    }
    //! List Job
    @HttpCode(HttpStatus.OK)
    @Get(':agency_id')
    @UseGuards(JobGuard)
    @ApiBearerAuth() // Swagger
    @ApiResponse({
        status: HttpStatus.OK,
        type: OutJobListingDto,
        description: 'API to get and filter job ',
    })
    @ApiOperation(
        GetOperationId('job', 'listing', 'API to get and filter job '),
    )
    async jobList(
        @Response() res,
        //@User() payload: JwtPayload,
        @Param('agency_id') agency_id: string,
        @Query() filterParams: JobFilterParamDto,
    ): Promise<BaseResponse<OutJobListingDto>> {
        filterParams.agency_id = agency_id;

        const populate = ['client_id', 'assigned_user', 'client_contact_list'];
        populate.push('candidate_count');

        if (filterParams.exclude_candidate_id) {
            const inJobFilter = new CandidateJobFilterParamDto();
            inJobFilter.candidate_id = filterParams.exclude_candidate_id;
            const inJoblist =
                await this.candidateJobService.paginateCandidateList(
                    inJobFilter,
                );

            if (inJoblist.candidate_list.length > 0) {
                const excludeJob = inJoblist.candidate_list.map(
                    (x) => x.job_id,
                );
                filterParams.exclude_job_id = excludeJob;
            }
        }
        const jobList = await this.jobService.paginateJobList(
            filterParams,
            populate,
        );
        if (filterParams.exclude_job_id && filterParams.exclude_job_id.length) {
            jobList.job_list = jobList.job_list.filter(
                (x) => filterParams.exclude_job_id.indexOf(x.id) == -1,
            );
        }

        const response: BaseResponse<OutJobListingDto> = {
            success: true,
            data: jobList,
        };
        return res.status(HttpStatus.OK).json(response);
    }

    @HttpCode(HttpStatus.OK)
    @Get(':agency_id/in-job/:job_id')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: [OutJobClientContactDto],
        description: 'API to get list of client contact in job ',
    })
    @ApiOperation(
        GetOperationId(
            'client',
            'edit',
            'API to get list of client contact in job ',
        ),
    )
    async listClientContact(
        @Res() res,
        @Param('agency_id') agencyId: string,
        @User() payload: JwtPayload,
        @Param('job_id') job_id: string,
    ): Promise<BaseResponse<OutJobClientContactDto[]>> {
        const response: BaseResponse<OutJobClientContactDto[]> = {
            success: true,
        };

        const _inFilterClientParamDto = new InFilterClientParamDto(0, 0);
        _inFilterClientParamDto.agency_id = agencyId;

        const clientList = await this.jobService.contactInJob(agencyId, job_id);
        response.data = clientList;
        return res.status(HttpStatus.OK).json(response);
    }

    @HttpCode(HttpStatus.OK)
    @Get(':agency_id/available-for-job/:job_id')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: [ClientContact],
        description: 'API to get list of client contact can add to job ',
    })
    @ApiOperation(
        GetOperationId(
            'job',
            'list',
            'API to get list of client contact can add to job ',
        ),
    )
    async listClientContactAvailableToJob(
        @Res() res,
        @Param('agency_id') agencyId: string,
        @Param('job_id') job_id: string,
    ): Promise<BaseResponse<ClientContact[]>> {
        const response: BaseResponse<ClientContact[]> = { success: true };

        const _inFilterClientParamDto = new InFilterClientParamDto(0, 0);
        _inFilterClientParamDto.agency_id = agencyId;

        const clientList = await this.jobService.availableContactToAddToJob(
            agencyId,
            job_id,
        );
        response.data = clientList;
        return res.status(HttpStatus.OK).json(response);
    }

    //! Job detail
    @HttpCode(HttpStatus.OK)
    @Get(':agency_id/:job_id')
    @UseGuards(JobGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: OutJobListingDto,
        description: 'API get job detail',
    })
    @ApiOperation(GetOperationId('job', 'detail', 'API get job detail'))
    async getJob(
        @Response() res,
        @User() payload: JwtPayload,
        @Param('job_id') job_id: string,
    ): Promise<BaseResponse<Job>> {
        const response: BaseResponse<JobDetailDto> = {
            success: true,
            data: await this.jobService.jobDetail(payload.agency_id, job_id),
        };

        return res.status(HttpStatus.OK).json(response);
    }
    //! Create new Job
    @HttpCode(HttpStatus.OK)
    @Post(':agency_id')
    @UseGuards(JobGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Job,
        description: 'API to create jobs and return job id',
    })
    @ApiOperation(
        GetOperationId('job', 'create', 'API to create jobs and return job id'),
    )
    async createJob(
        @Response() res,
        @User() payload: JwtPayload,
        @Body() _JobDto: CreateJobDto,
    ): Promise<BaseResponse<JobDetailDto>> {
        const job = await this.jobService.createJob(payload, _JobDto);
        const response: BaseResponse<JobDetailDto> = {
            success: true,
            data: job,
        };
        await this.jobService.buildSearchText(job.id);
        return res.status(HttpStatus.CREATED).json(response);
    }

    //! Update job status
    @HttpCode(HttpStatus.OK)
    @Post(':agency_id/change-status')
    @UseGuards(JobGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: OutChangeJobsStatusResultDto,
        description: 'API to change jobs status',
    })
    @ApiOperation(
        GetOperationId('job', 'change_status', 'API to change jobs status'),
    )
    async changeJobStatus(
        @Response() res,
        @Param('agency_id') agency_id: string,
        @User() payload: JwtPayload,
        @Body() _changeJobStatusDto: ChangeJobStatusDto,
    ): Promise<BaseResponse<OutChangeJobsStatusResultDto>> {
        //const job = await this.jobService.findById(_changeJobStatusDto.job_id,agency_id);
        const response: BaseResponse<OutChangeJobsStatusResultDto> = {
            success: true,
        };

        const out = new OutChangeJobsStatusResultDto();
        const list: Array<ChangeJobStatusResultDto> = [];
        for await (const j of _changeJobStatusDto.job_id) {
            const resOne = await this.jobService.changeJobStatus(
                payload,
                j,
                _changeJobStatusDto.status,
            );
            list.push(resOne);
        }
        out.job_status = list;
        response.data = out;

        return res.status(HttpStatus.CREATED).json(response);
    }
    //! Update job status

    //! Update recruiter activity
    @HttpCode(HttpStatus.OK)
    @Put(':job_id/recruiter-activity')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: [JobRecruitmentActivityDto],
        description: 'API to update Recruitment Activity for job',
    })
    @ApiOperation(
        GetOperationId(
            'job',
            'update Recruitment Activity',
            'API to update Recruitment Activity for job',
        ),
    )
    async updateRecruitmentActivity(
        @Response() res,
        @Param('job_id') job_id: string,
        @User() payload: JwtPayload,
        @Body()
        updateJobRecruitmentActivityDto: UpdateJobRecruitmentActivityDto,
    ): Promise<BaseResponse<ListJobRecruitmentActivityDto>> {
        const response: BaseResponse<ListJobRecruitmentActivityDto> = {
            success: true,
            data: await this.jobService.updateListRecruiterActivity(
                payload,
                job_id,
                updateJobRecruitmentActivityDto,
            ),
        };

        return res.status(HttpStatus.OK).json(response);
    }

    //! Update Job
    @HttpCode(HttpStatus.OK)
    @Put(':job_id')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Job,
        description: 'API to update jobs',
    })
    @ApiOperation(GetOperationId('job', 'update', 'API to update jobs'))
    async updateJob(
        @Response() res,
        @Param('job_id') job_id: string,
        @User() payload: JwtPayload,
        @Body() UpdateJobRequestData: UpdateJobRequestDto,
    ): Promise<BaseResponse<Job>> {
        const response: BaseResponse<Job> = {
            success: true,
            data: await this.jobService.updateJobDetail(
                payload,
                job_id,
                UpdateJobRequestData,
            ),
        };
        await this.jobService.buildSearchText(job_id);
        return res.status(HttpStatus.CREATED).json(response);
    }

    @HttpCode(HttpStatus.OK)
    @Delete(':job_id')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to delete job ',
    })
    @ApiOperation(GetOperationId('client', 'edit', 'API to delete job'))
    async DeleteJob(
        @Response() res,
        @Param('job_id') job_id: string,
        @User() payload: JwtPayload,
    ): Promise<BaseResponse<boolean>> {
        const response: BaseResponse<Job> = {
            success: true,
            data: await this.jobService.deleteJob(payload, job_id),
        };
        return res.status(HttpStatus.OK).json(response);
    }

    @HttpCode(HttpStatus.OK)
    @Get('can-add-to/:job_id')
    @UseGuards(JWTAuthGuard)
    @UseGuards(JobGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: ClientListByProjectDto,
        description:
            'API to get list of client contact that can be added to job ',
    })
    @ApiOperation(
        GetOperationId(
            'job',
            'can-add-to',
            'API to get list of client contact that can be added to job',
        ),
    )
    async ContactClientCanAddJob(
        @Response() res,
        @Param('job_id') job_id: string,
    ): Promise<BaseResponse<OutJobClientContactDto[]>> {
        const filter: JobClientContactFilterDto =
            new JobClientContactFilterDto();
        filter.job_id = job_id;
        const response: BaseResponse<any> = {
            success: true,
            data: await this.jobClientContactService.list(filter),
        };
        return res.status(HttpStatus.OK).json(response);
    }
    @HttpCode(HttpStatus.OK)
    @Delete(':job_id/delete/:contact_client_id')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to delete client contact from job ',
    })
    @ApiOperation(
        GetOperationId(
            'client',
            'edit',
            'API to delete client contact from job',
        ),
    )
    async DeleteClientFromJob(
        @Response() res,
        @Param('contact_client_id') contact_client_id: string,
        @Param('job_id') job_id: string,
    ): Promise<BaseResponse<boolean>> {
        const response: BaseResponse<any> = {
            success: true,
            data: await this.jobClientContactService.delete(
                job_id,
                contact_client_id,
            ),
        };
        await this.jobService.buildSearchText(job_id);
        return res.status(HttpStatus.OK).json(response);
    }

    @Get('activity/pdf/:job_id')
    @UseGuards(JWTAuthGuard)
    async jobactivitypdf(
        @Res() res: any,
        @Param('job_id') job_id: ObjectId,
    ): Promise<BaseResponse<any>> {
        const jobFIle = await this.jobService.exportJobRecruitmentActivity(
            job_id,
        );

        res.set({
            // zip
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${jobFIle.fileName}`,
            'Content-Length': jobFIle.buffer.length,

            // prevent cache
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: 0,
        });

        return res.status(200).send(jobFIle.buffer);
    }

    @HttpCode(HttpStatus.OK)
    @Get('getTimeofJob/:job_id/:client_contact_id')
    @UseGuards(JobGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: OutJobListingDto,
        description: 'API get time of job',
    })
    @ApiOperation(GetOperationId('job', 'detail', 'API get job detail'))
    async getTimeInterviewOfJobClientContact(
        @User() payload: JwtPayload,
        @Param('job_id') job_id,
        @Param('client_contact_id') client_contact_id,
    ) {
        // job_id, client_contact_id, payload.id
        const data =
            await this.jobClientContactService.findTimeOfJobClientContact(
                payload,
                client_contact_id,
                job_id,
            );
        const response: BaseResponse<any> = {
            data: data || [],
            success: true,
        };
        return response;
    }
}
