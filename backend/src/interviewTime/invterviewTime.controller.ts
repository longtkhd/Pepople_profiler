import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Response,
    Param,
    Post,
    Delete,
    Get,
    Res,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiResponse,
    ApiOperation,
} from '@nestjs/swagger';
import { JwtPayload } from '../auth/dto/login';
import { User } from '../shared/decorators/user.decorator';
import { GetOperationId } from '../shared/utils/get-operation-id';
import {
    InterviewStatus,
    InterviewTime,
    JobClientContact,
} from '../schemas/job.schema';
import { JobClientContactService } from '../job/job-client-contact.service';
import { CandidateJobService } from 'src/candidate/job-candidate.service';
import { InterviewTimeService } from 'src/interviewTime/interviewTime.service';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { InterviewTimeDto } from '../job/dto/interviewTime.dto';
import { BaseResponse } from 'src/shared/base.dto';
import { OutJobListingDto } from 'src/job/dto/job.res.dto';
import { ObjectId } from 'mongodb';

@Controller('job')
export class InterviewController {
    constructor(
        private readonly jobClientContactService: JobClientContactService,
        private readonly candidateJobService: CandidateJobService,
        private readonly interviewTimeService: InterviewTimeService,
        @InjectModel(JobClientContact)
        private readonly repo: ReturnModelType<typeof JobClientContact>,
    ) {
        // do nothing
    }
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @Post(':job_id/createDateInterview/:invite_token')
    @ApiResponse({
        status: HttpStatus.OK,
        type: InterviewTime,
        description: 'API to create time interview and return any time',
    })
    @ApiOperation(
        GetOperationId(
            'date-time',
            'create',
            'API to create date - time and return list interview time',
        ),
    )
    async createInterviewTime(
        @Response() res,
        @User() payload: JwtPayload,
        @Body('interview_time') interviewTimeDto: InterviewTimeDto[],
        @Body('info') info: string,
        @Param('job_id') job_id: string,
        @Param('invite_token') invite_token: string,
    ): Promise<any> {
        try {
            const time = await this.interviewTimeService.createInterviewTime(
                payload,
                interviewTimeDto,
                job_id,
                info,
                invite_token,
            );
            // tạo thời gian --> set toàn bộ candidate
            await this.candidateJobService.updateInterviewStatus(job_id, 1); // all candidate 0 --> 1
            const clientContactJob = await this.repo.find({job_id: new ObjectId(job_id)})
            for(let i = 0; i < clientContactJob.length; i++){
                if (clientContactJob[i].interview_status != 2 && clientContactJob[i].is_invite == true) {
                    clientContactJob[i].interview_status = InterviewStatus.interview;
                    await clientContactJob[i].save();
                }
            }
            return res.status(200).send(time);
        } catch (error) {
            return 'some error';
        }
    }
    @HttpCode(HttpStatus.OK)
    @Get('activity/gettime/:job_id')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: OutJobListingDto,
        description: 'API get job detail',
    })
    @ApiOperation(GetOperationId('job', 'detail', 'API get job detail'))
    async getTimeInterview(
        @Param('job_id') job_id: string,
        @User() payload: JwtPayload,
        @Res() res,
    ): Promise<any> {
        const times = await this.interviewTimeService.getInterviewsTime(
            job_id,
            payload,
        );
        return res.status(HttpStatus.OK).json(times);
    }

    @HttpCode(HttpStatus.OK)
    @Post('activity/delete-time')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to delete interview time from job ',
    })
    @ApiOperation(
        GetOperationId(
            'client',
            'edit',
            'API to delete interview time from job',
        ),
    )
    async deleteTime(
        @Body('time') time: string[],
        @Response() res,
    ): Promise<any> {
        if(time != null && time.length > 0){
            const data = await this.interviewTimeService.delete(time);
            const response: BaseResponse<any> = {
                success: true,
            };
            response.data = data
            return res.status(HttpStatus.OK).json(response);
        }else{
            const response: BaseResponse<any> = {
                success: false,
                error: {
                    message: ""
                }
            };
            response.error.message = 'data of time id to delete is wrong'
            return res.status(HttpStatus.OK).json(response);
        }
    }
}
