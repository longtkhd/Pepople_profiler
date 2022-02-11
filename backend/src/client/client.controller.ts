import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    Res,
    UseGuards,
    Response,
    Logger,
    HttpException,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { JwtPayload } from 'src/auth/dto/login';
import { JobClientContactService } from 'src/job/job-client-contact.service';
import { MailService } from 'src/mail/mail.service';

import { Client, ClientContact } from 'src/schemas/client.schema';
import { JWTAuthGuard } from '../auth/guards/auth.guard';

import { BaseResponse } from '../shared/base.dto';
import { User } from '../shared/decorators/user.decorator';
import { GetOperationId } from '../shared/utils/get-operation-id';
import { ClientService } from './client.service';
import { ClientContactService } from './client_contact.service';
import {
    CreateClientDetailDto,
    ClientListDto,
    InFilterClientParamDto,
    ClientDetailDto,
    AddListClientContactDto,
    ClientInfoDto,
    EditClientContactDto,
    MultipleClientContact,
    OutListClientFeedbackDto,
    InviteClientJobMail,
    AddMultipleClientContact,
} from './dto/client';
import { ClientGuard } from './guards/client.guard';
import { OutJobClientContactDto } from 'src/job/dto/job.res.dto';
import { InterviewStatus, InterviewTime, JobClientContact } from 'src/schemas/job.schema';
import { JobService } from 'src/job/job.service';
import { AgencyService } from 'src/agency/agency.service';
import { InterviewTimeService } from 'src/interviewTime/interviewTime.service';
import { CandidateService } from 'src/candidate/candidate.service';
import { ChangeStatusInterviewDto } from 'src/job/dto/job.req.dto';
import { CandidateJobService } from 'src/candidate/job-candidate.service';
import { Candidate } from 'src/schemas/candidate.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import e from 'express';
import { AddTimeDto } from './dto/addTime.dto';
import { log } from 'console';
import { InterviewNotifi } from './interview_notifi.service';

@ApiTags('client')
@Controller('client')
@UseGuards(JWTAuthGuard)
export class ClientController {
    constructor(
        private readonly clientService: ClientService,
        private readonly jobClientContactService: JobClientContactService,
        private readonly clientContactService: ClientContactService,
        private readonly agencyService: AgencyService,
        private readonly jobService: JobService,
        private readonly mailService: MailService,
        private readonly interviewTimeService: InterviewTimeService,
        private readonly candidateService: CandidateService,
        private readonly candidateJobService: CandidateJobService,
        @InjectModel(Candidate)
        private readonly candidateModel: ReturnModelType<typeof Candidate>,
        @InjectModel(InterviewTime)
        private readonly interview: ReturnModelType<typeof InterviewTime>,
        private readonly interviewNotifi: InterviewNotifi,
    ) {}
    private readonly logger = new Logger(ClientController.name);

    /** CREATE CLIENT */
    @HttpCode(HttpStatus.OK)
    @Post()
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: ClientDetailDto,
        description: 'API to create detail of client and client contact list',
    })
    @ApiOperation(
        GetOperationId(
            'client',
            'create',
            'API to create client and client contact list',
        ),
    )
    async createClient(
        @Response() res,
        @User() payload: JwtPayload,
        @Body() _createClientDto: CreateClientDetailDto,
    ): Promise<BaseResponse<Client>> {
        const response: BaseResponse<Client> = { success: true };
        try {
            const newClient = await this.clientService.create(
                payload,
                _createClientDto,
            );
            response.data = newClient;
        } catch (error) {
            this.logger.error(error);
            response.success = false;
            response.error = error;
        }
        return res.status(HttpStatus.OK).json(response);
    }
    @HttpCode(HttpStatus.OK)
    @Post(':client_id/add-contact')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: ClientContact,
        description: 'API to add client contact to client',
    })
    @ApiOperation(
        GetOperationId(
            'client',
            'create',
            'API to create client and client contact list',
        ),
    )
    async createClientContact(
        @Param('client_id') client_id: string,
        @Response() res,
        @User() payload: JwtPayload,
        @Body() contacts: AddListClientContactDto,
    ): Promise<BaseResponse<ClientContact>> {
        const response: BaseResponse<ClientContact[]> = { success: true };
        try {
            if (
                !contacts &&
                !contacts.contact_list &&
                !contacts.contact_list.length
            ) {
                response.success = false;
                return res.status(HttpStatus.BAD_REQUEST).json(response);
            }
            const promises = contacts.contact_list.map(async (contact) => {
                return await this.clientContactService.create(
                    payload,
                    contact,
                    client_id,
                );
            });
            response.data = await Promise.all(promises);
            await this.clientService.buildSearchTextFromId(client_id);
        } catch (error) {
            this.logger.error(error);
            response.success = false;
            response.error = error;
        }
        return res.status(HttpStatus.OK).json(response);
    }

    @HttpCode(HttpStatus.OK)
    @Post(':client_id/update-client')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Client,
        description: 'API to update client',
    })
    @ApiOperation(GetOperationId('client', 'create', 'API to update client'))
    async updateClient(
        @Param('client_id') client_id: string,
        @Response() res,
        @User() payload: JwtPayload,
        @Body() client: ClientInfoDto,
    ): Promise<BaseResponse<Client>> {
        const response: BaseResponse<Client> = { success: true };
        try {
            client.id = client_id;
            const newClient = await this.clientService.update(payload, client);
            if (!newClient) {
                response.success = false;
                response.error.message = 'interal_server_error';
            }
            await this.clientService.buildSearchTextFromId(client_id);
            response.data = newClient;
        } catch (error) {
            this.logger.error(error);
            response.success = false;
            response.error = error;
        }
        return res.status(HttpStatus.OK).json(response);
    }

    @HttpCode(HttpStatus.OK)
    @Post(':client_id/update-client-contact')
    @UseGuards(JWTAuthGuard)
    @UseGuards(ClientGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Client,
        description: 'API to update client contact',
    })
    @ApiOperation(
        GetOperationId('client', 'create', 'API to update client contact'),
    )
    async updateClientContact(
        @Param('client_id') client_id: string,
        @Response() res,
        @User() payload: JwtPayload,
        @Body() contact: EditClientContactDto,
    ): Promise<BaseResponse<EditClientContactDto>> {
        const response: BaseResponse<EditClientContactDto> = { success: true };
        try {
            const newClient = await this.clientContactService.update(
                payload,
                contact,
                client_id,
            );
            if (!newClient) {
                response.success = false;
                response.error.message = 'interal_server_error';
            }
            response.data = contact;
        } catch (error) {
            this.logger.error(error);
            response.success = false;
            response.error = error;
        }
        return res.status(HttpStatus.OK).json(response);
    }

    @HttpCode(HttpStatus.OK)
    @Post(':client_contact_id/add-to-job/:job_id')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: ClientDetailDto,
        description: 'API to add client contact to job',
    })
    @ApiOperation(
        GetOperationId(
            'client',
            'add-to-job',
            'API to add client contact to job',
        ),
    )
    async addClientContactToJob(
        @Response() res,
        @Param('client_contact_id') client_contact_id: string,
        @Param('job_id') job_id: string,
        @User() payload: JwtPayload,
    ): Promise<BaseResponse<ClientDetailDto>> {
        const response: BaseResponse<ClientDetailDto> = { success: true };
        const jobContact = await this.jobClientContactService.findOne({
            client_contact_id: client_contact_id,
            job_id: job_id,
        });
        if (jobContact) {
            response.success = false;
            response.error = { message: 'duplicate_contact_in_job' };
            return res.status(HttpStatus.OK).json(response);
        }
        await this.jobClientContactService.AddToJob(
            {
                contact_id: client_contact_id,
                job_id: job_id,
            },
            payload,
        );
        // await this.jobService
        return res.status(HttpStatus.OK).json(response);
    }

    @HttpCode(HttpStatus.OK)
    @Post('/add-to-job/:job_id')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to add multiple client contact to job',
    })
    @ApiOperation(
        GetOperationId(
            'client',
            'add-to-job',
            'API to add multiple client contact to job',
        ),
    )
    async addMultipleClientContactToJob(
        @Response() res,
        @Param('job_id') job_id: string,
        @Body() _multipleClientContact: AddMultipleClientContact,
        @User() payload: JwtPayload,
    ): Promise<BaseResponse<ClientDetailDto>> {
        const response: BaseResponse<ClientDetailDto> = { success: true };
        try {
            await this.clientService.addMultilpleClientContactToJob(
                payload,
                _multipleClientContact,
                job_id,
            );
        } catch (error) {
            response.success = false;
            response.error = error;
        }
        return res.status(HttpStatus.OK).json(response);
    }

    @HttpCode(HttpStatus.OK)
    @Get(':agency_id/list')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: ClientListDto,
        description: 'API to get list of client base on filter ',
    })
    @ApiOperation(
        GetOperationId(
            'client',
            'edit',
            'API to get list of client base on filter',
        ),
    )
    async listClient(
        @Res() res,
        @Param('agency_id') agencyId: string,
        @User() payload: JwtPayload,
        @Query() _inFilterClientParamDto: InFilterClientParamDto,
    ): Promise<BaseResponse<ClientListDto>> {
        const response: BaseResponse<ClientListDto> = { success: true };
        if (payload.role !== 'admin' && payload.agency_id != agencyId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: 'agency_not_found',
            });
        }
        _inFilterClientParamDto.agency_id = agencyId;
        _inFilterClientParamDto.populate = ['contact_list', 'job_list'];
        const clientList = await this.clientService.paginateList(
            _inFilterClientParamDto,
        );
        response.data = clientList;
        return res.status(HttpStatus.OK).json(response);
    }

    @HttpCode(HttpStatus.OK)
    @Get(':client_id/client-contact-list')
    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard)
    @UseGuards(ClientGuard)
    @ApiResponse({
        status: HttpStatus.OK,
        type: ClientListDto,
        description: 'API to get list of client base on filter ',
    })
    @ApiOperation(
        GetOperationId(
            'client',
            'list contact client',
            'API to get list of contact client from client',
        ),
    )
    async listContactByClient(
        @Res() res,
        @Param('client_id') client_id: string,
    ): Promise<BaseResponse<ClientListDto>> {
        const response: BaseResponse<ClientContact[]> = { success: true };

        const clientList = await this.clientContactService.list(client_id);
        response.data = clientList.docs;
        return res.status(HttpStatus.OK).json(response);
    }

    @HttpCode(HttpStatus.OK)
    @Delete(':client_id/delete-contact/:contact_id')
    @UseGuards(JWTAuthGuard)
    @UseGuards(ClientGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to delete client contact',
    })
    @ApiOperation(
        GetOperationId(
            'client',
            'deletecontact',
            'API to delete client contact',
        ),
    )
    async deletecontact(
        @Response() res,
        @Param('client_id') client_id: string,
        @Param('contact_id') contact_id: string,
        @User() user: JwtPayload,
    ): Promise<BaseResponse<any>> {
        const response: BaseResponse<any> = { success: true };
        try {
            const client = await this.clientContactService.delete(user, [
                contact_id,
            ]);
            await this.clientService.buildSearchTextFromId(client_id);
            response.data = client;
        } catch (error) {
            this.logger.error(error);
            response.success = false;
            response.error = error;
        }

        return res.status(HttpStatus.OK).json(response);
    }

    @HttpCode(HttpStatus.OK)
    @Delete(':client_id')
    @UseGuards(JWTAuthGuard)
    @UseGuards(ClientGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to delete client',
    })
    @ApiOperation(
        GetOperationId('client', 'deleteclient', 'API to delete client'),
    )
    async deleteclient(
        @Response() res,
        @Param('client_id') client_id: string,
        @User() user: JwtPayload,
    ): Promise<BaseResponse<any>> {
        const response: BaseResponse<any> = { success: true };
        try {
            const client = await this.clientService.delete(user, [client_id]);
            response.data = client;
        } catch (error) {
            this.logger.error(error);
            response.success = false;
            response.error = error;
        }

        return res.status(HttpStatus.OK).json(response);
    }

    @HttpCode(HttpStatus.OK)
    @Get(':client_id')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: ClientDetailDto,
        description:
            'API to Get detail of client and client contact list (PENDING)',
    })
    @ApiOperation(
        GetOperationId(
            'client',
            'detail',
            'API to Get detail of client and client contact list',
        ),
    )
    async getClientDetail(
        @Response() res,
        @Param('client_id') client_id: string,
    ): Promise<BaseResponse<Client>> {
        const response: BaseResponse<Client> = { success: true };
        try {
            const client = await this.clientService.findOne(
                { _id: new ObjectId(client_id), is_deleted: false },
                [{ path: 'job_list' }],
            );
            response.data = client;
        } catch (error) {
            this.logger.error(error);
            response.success = false;
            response.error = error;
        }

        return res.status(HttpStatus.OK).json(response);
    }

    //////////////////////////////////////////////

    @HttpCode(HttpStatus.OK)
    @Post(':client_contact_id/invite_to/:job_id')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: OutJobClientContactDto,
        description: 'API to invite client contact to job',
    })
    @ApiOperation(
        GetOperationId(
            'client',
            'invite_to_job',
            'API to invite client contact to job',
        ),
    )
    async inviteClientContactToJob(
        @Param('client_contact_id') client_contact_id: string,
        @Param('job_id') job_id: string,
        @User() payload: JwtPayload,
        @Body() _inviteClientJobMail: InviteClientJobMail,
        @Response() res,
    ) {
        const response: BaseResponse<OutJobClientContactDto> = {
            success: true,
        };
        try {
            const agencyInfo = await this.agencyService.getAgencyDetail(
                payload.agency_id,
            );
            const jobClientContact =
                await this.jobClientContactService.inviteJobClientContact(
                    payload,
                    client_contact_id,
                    job_id,
                    undefined,
                );
            // console.log(jobClientContact);

            await this.mailService.sendMailInviteJobClientContact(
                jobClientContact,
                payload,
                _inviteClientJobMail,
                agencyInfo,
            );
            response.data = jobClientContact;
        } catch (error) {
            this.logger.error(error);
            response.success = false;
            response.error = error;
        }
        return res.status(HttpStatus.OK).json(response);
    }

    @HttpCode(HttpStatus.OK)
    @Post('invite_to/:job_id')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: OutJobClientContactDto,
        description: 'API to invite multiple client contact to job',
    })
    @ApiOperation(
        GetOperationId(
            'client',
            'invite_to_job',
            'API to invite multiple client contact to job',
        ),
    )
    async inviteMultipleClientContactToJob(
        @Param('job_id') job_id: string,
        @Body() _multipleClientContact: MultipleClientContact,
        @User() payload: JwtPayload,
        @Response() res,
    ) {
        const response: BaseResponse<OutJobClientContactDto[]> = {
            success: true,
        };
        try {
            const agencyInfo = await this.agencyService.getAgencyDetail(
                payload.agency_id,
            );
            const promises = _multipleClientContact.client_contact_list.map(
                async (client_contact_id) => {
                    const inviteClientJobMail = new InviteClientJobMail();
                    inviteClientJobMail.body = _multipleClientContact.body;
                    inviteClientJobMail.subject =
                        _multipleClientContact.subject;
                    const jobClientContact =
                        await this.jobClientContactService.inviteJobClientContact(
                            payload,
                            client_contact_id,
                            job_id,
                            inviteClientJobMail,
                        );
                    inviteClientJobMail.body = jobClientContact.body;
                    inviteClientJobMail.subject = jobClientContact.subject;
                    await this.mailService.sendMailInviteJobClientContact(
                        jobClientContact,
                        payload,
                        inviteClientJobMail,
                        agencyInfo,
                    );
                    return jobClientContact;
                },
            );
            response.data = await Promise.all(promises);
        } catch (error) {
            this.logger.error(error);
            response.success = false;
            response.error = error;
        }
        return res.status(HttpStatus.OK).json(response);
    }

    @HttpCode(HttpStatus.OK)
    @Post(':client_contact_id/revoke-from/:job_id')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: JobClientContact,
        description: 'API to revoke client from job',
    })
    @ApiOperation(
        GetOperationId(
            'client',
            'revoke-from-job',
            'API to revoke client from job',
        ),
    )
    async irevokeFromClientFromJob(
        @Param('client_contact_id') client_contact_id: string,
        @Param('job_id') job_id: string,
        @Response() res,
    ): Promise<BaseResponse<JobClientContact>> {
        const response: BaseResponse<JobClientContact> = { success: true };
        try {
            const jobClientContact =
                await this.jobClientContactService.revokeJobClientContact(
                    client_contact_id,
                    job_id,
                );
            response.data = jobClientContact;
        } catch (error) {
            this.logger.error(error);
            response.success = false;
            response.error = error;
        }
        return res.status(HttpStatus.OK).json(response);
    }

    @HttpCode(HttpStatus.OK)
    @Post('revoke-from/:job_id')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: JobClientContact,
        description: 'API to revoke multiple client contact to job',
    })
    @ApiOperation(
        GetOperationId(
            'client',
            'revoke-from-job',
            'API to revoke multiple client from job',
        ),
    )
    async revokeMultipleFromClientFromJob(
        @Param('job_id') job_id: string,
        @Body() _multipleClientContact: MultipleClientContact,
        @User() payload: JwtPayload,
        @Response() res,
    ): Promise<BaseResponse<JobClientContact[]>> {
        const response: BaseResponse<JobClientContact[]> = { success: true };
        try {
            const promises = _multipleClientContact.client_contact_list.map(
                async (client_contact_id) => {
                    const jobClientContact =
                        await this.jobClientContactService.revokeJobClientContact(
                            client_contact_id,
                            job_id,
                        );
                    return jobClientContact;
                },
            );
            response.data = await Promise.all(promises);
        } catch (error) {
            this.logger.error(error);
            response.success = false;
            response.error = error;
        }
        return res.status(HttpStatus.OK).json(response);
    }

    @HttpCode(HttpStatus.OK)
    @Get(':job_id/client-feedback/:client_contact_id')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: OutListClientFeedbackDto,
        description: 'API to get list of client feedback',
    })
    @ApiOperation(
        GetOperationId('client', 'edit', 'API to get list of client feedback'),
    )
    async clientFeedback(
        @Res() res,
        @Param('job_id') job_id: string,
        @Param('client_contact_id') client_contact_id: string,
    ): Promise<BaseResponse<OutListClientFeedbackDto>> {
        const response: BaseResponse<OutListClientFeedbackDto> = {
            success: true,
        };
        try {
            const jobClientContact =
                await this.jobClientContactService.findJobClientContactById(
                    client_contact_id,
                    job_id,
                );
            const jobClientContactId = jobClientContact?.job_client_contact_id;
            if (!jobClientContactId) response.data = null;

            const feedbacks = await this.clientService.getListFeedback(
                jobClientContactId,
            );
            response.data = feedbacks;
        } catch (error) {
            this.logger.error(error);
            response.success = false;
            response.error = error;
        }
        return res.status(HttpStatus.OK).json(response);
    }
    @HttpCode(HttpStatus.OK)
    @Post(':job_id/:client_contact_id/addTimeInterview')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: JobClientContact,
        description: 'API to add time interview',
    })
    @ApiOperation(
        GetOperationId(
            'client',
            'add time interview',
            'API to add time interview',
        ),
    )
    async addInterviewTime(
        @Res() res,
        @Param('job_id') job_id: string,
        @Param('client_contact_id') client_contact_id: string,
        @Body() other: AddTimeDto[],
        @User() payload: JwtPayload,
    ): Promise<any> {
        // data return
        const docs: BaseResponse<any> = {
            success: true,
            error: {
                message: '',
            },
        };
        // client contact job
        const client = await this.clientContactService.findClientContact(
            client_contact_id,
        );
        if (!client) {
            docs.error.message = 'client doesnt exit';
            return res.status(HttpStatus.BAD_REQUEST).send(docs);
        }
        // client befor update interview Time
        const clientContactBeforUpdateInterviewTime =
            await this.jobClientContactService.findClientContact(
                client_contact_id,
                job_id,
            );
        // kiểm tra nếu interivewtime null thì tiến hành gửi mail toàn bộ + cap nhat
        // nếu khác null thì đi bước tiếp theo
        if (clientContactBeforUpdateInterviewTime.interview_time.length < 1) {
            // sendmail
            for (let i = 0; i < other.length; i++) {
                let time = await this.interviewTimeService.findOne(
                    other[i].time_id,
                );
                let candidate = await this.candidateModel.findById(
                    other[i].candidate_id,
                );
                const title = 'Interview Time';
                await this.interviewNotifi.sendNotificationInterview(
                    payload,
                    time,
                    candidate,
                    client,
                    title,
                );
                // update status candidate
                // cap nhat status candidate
                await this.candidateJobService.updateInterviewStatus(
                    job_id,
                    2,
                    client_contact_id,
                    other[i].candidate_id,
                    other[i].time_id,
                );
            }
             const candidateJobOfJob1 =
                 await this.candidateJobService.getListCandidateOfJob(job_id);
        } else {
            // list timeID in interviewTime in jobClientContact befor
            // danhs sach time id, candidateid trong interviewTime cuar jobClientContact befor
            const timeOfClientContactBeforUpadte =
                clientContactBeforUpdateInterviewTime.interview_time.map(
                    (item) => {
                        let x = {
                            candidate_id: `${item.candidate_id}`,
                            time_id: `${item.time_id}`,
                        };
                        return x;
                    },
                );
            // candidate thay doi thoi gian pv
            for (let i = 0; i < other.length; i++) {
                for (
                    let j = 0;
                    j < timeOfClientContactBeforUpadte.length;
                    j++
                ) {
                    if (
                        other[i].candidate_id ==
                            timeOfClientContactBeforUpadte[j].candidate_id &&
                        other[i].time_id !=
                            timeOfClientContactBeforUpadte[j].time_id
                    ) {
                        let title = 'Interview schedule change';
                        let candidate = await this.candidateModel.findById(
                            other[i].candidate_id,
                        );
                        let time = await this.interviewTimeService.findOne(
                            other[i].time_id,
                        );
                        await this.candidateJobService.updateInterviewStatus(
                            job_id,
                            2,
                            client_contact_id,
                            other[i].candidate_id,
                            other[i].time_id,
                        );
                        await this.interviewNotifi.sendNotificationInterview(
                            payload,
                            time,
                            candidate,
                            client,
                            title,
                        );
                    }
                }
            }
            // nhung thang them moi
            const newCandidateChecked = other.filter((item) => {
                return (
                    timeOfClientContactBeforUpadte.filter((time) => {
                        return time.candidate_id == item.candidate_id;
                    }).length == 0
                );
            });
            if (newCandidateChecked.length > 0) {
                for (let i = 0; i < newCandidateChecked.length; i++) {
                    let title = 'Interview time';
                    let candidate = await this.candidateModel.findById(
                        newCandidateChecked[i].candidate_id,
                    );
                    let time = await this.interviewTimeService.findOne(
                        newCandidateChecked[i].time_id,
                    );
                    await this.interviewNotifi.sendNotificationInterview(
                        payload,
                        time,
                        candidate,
                        client,
                        title,
                    );
                    await this.candidateJobService.updateInterviewStatus(
                        job_id,
                        2,
                        client_contact_id,
                        newCandidateChecked[i].candidate_id,
                        newCandidateChecked[i].time_id,
                    );
                }
            }
            // nhung thang gach bo
            let candidateUnCheck = timeOfClientContactBeforUpadte.filter(
                (time) => {
                    return (
                        other.filter((item) => {
                            return time.candidate_id == item.candidate_id;
                        }).length == 0
                    );
                },
            );
            if (candidateUnCheck.length > 0) {
                for (let i = 0; i < candidateUnCheck.length; i++) {
                    const candidate = await this.candidateModel.findById(
                        candidateUnCheck[i].candidate_id,
                    );
                    if (candidate != null) {
                        await this.interviewNotifi.sendPostpone(
                            client,
                            candidate,
                        );
                        await this.candidateJobService.updateStatusWhenUncheck(
                            job_id,
                            candidateUnCheck[i].candidate_id,
                            client_contact_id
                        );
                    }
                }
            }
        }

        // list candidate of job
        // danh sach candidate of job
        const candidateJobOfJob =
            await this.candidateJobService.getListCandidateOfJob(job_id);
        if (candidateJobOfJob.length < other.length) {
            docs.error.message = 'bad request';
            return res.status(HttpStatus.BAD_REQUEST).send(docs);
        }
        // allTime.map()
        // all time
        const allTime = await this.interviewTimeService.getAllTime(job_id);
        // time not use
        let timeNotUse = allTime.filter((item) => {
            return (
                other.filter((time) => {
                    return `${item._id}` == time.time_id;
                }).length == 0
            );
        });
        if (timeNotUse.length < 1) {
            // if do not have time ==> all candidate have status = 1 --> 0
            for (let i = 0; i < candidateJobOfJob.length; i++) {
                if (candidateJobOfJob[i].interview_status == 1) {
                    candidateJobOfJob[i].interview_status = 0;
                    await candidateJobOfJob[i].save();
                }
            }
        } else {
            for (let i = 0; i < candidateJobOfJob.length; i++) {
                if (candidateJobOfJob[i].interview_status == 0) {
                    candidateJobOfJob[i].interview_status = 1;
                    await candidateJobOfJob[i].save();
                }
            }
        }
        // set time interview to client and canidate (jobclientcontact)
        const data = await this.jobClientContactService.updateInterviewTime(
            other,
            client_contact_id,
            job_id,
        );
        try {
            const clientConatct =
                await this.jobClientContactService.findClientContact(
                    client_contact_id,
                    job_id,
                );
            if (clientConatct.interview_time.length < 1) {
                await this.jobClientContactService.updateStatusInterview(
                    job_id,
                    InterviewStatus.interview,
                    client_contact_id,
                );
            } else {
                await this.jobClientContactService.updateStatusInterview(
                    job_id,
                    InterviewStatus.has_interview,
                    client_contact_id,
                );
            }
        } catch (error) {
            return;
        }
        // docs.data = data;
        docs.data = data;
        return res.status(HttpStatus.OK).send(docs);
    }
}
