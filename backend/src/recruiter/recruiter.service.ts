import { Injectable, Logger } from '@nestjs/common'
import { UsersService } from '../user/user.service'

import { OutListRecruiterDto, RecruiteFilterParam, RecruiterDto } from './dto/recruiter'
import { MapperService } from '../shared/mapper/mapper.service'
import { User } from '../schemas/user.schema'
import { JwtPayload, UpdateUserState, UserBasicInfoDto, UserDto } from '../auth/dto/login'
import { ObjectId } from 'mongodb'
import { Job } from '../schemas/job.schema'
import { DaxtraIntegrationService } from 'src/daxtra.Integration/daxtra-integration.service'
import { CandidateAssessmentService } from 'src/candidate/candidate-assessment.service'
import { PaginateOptions } from 'mongoose'
import { JobListDto as JobDto } from '../job/dto/job.res.dto'
import { FilterQuery } from 'mongoose'
@Injectable()
export class RecruiterService {
    private readonly logger = new Logger('RecruiterService');
    constructor(
        private readonly usersService: UsersService,
        private readonly daxtraIntegrationService: DaxtraIntegrationService,
        private readonly candidateAssessmentService: CandidateAssessmentService,
        private readonly mapperService: MapperService,
    ) {
        this.mapperService.createMap(User, RecruiterDto)//.forSourceMember(x => 'password', opt => opt.Ignore());;
        this.mapperService.createMap(User, UpdateUserState)
        this.mapperService.createMap(User.name, UserDto.name)
        this.mapperService.createMap(Job.name, JobDto.name)
    }
    public async deactivateRecruiter(agency_id: string, recruiter_id: string): Promise<User | null> {
        const user = await this.usersService.findOne({
            agency_id: new ObjectId(agency_id),
            _id: recruiter_id
        })
        console.log(user)
        let state = new UpdateUserState()

        if (user) {
            state = this.mapperService.map<UpdateUserState>(user, UpdateUserState.name, User.name)
            state.is_active = false
            return await this.usersService.changeUserState(recruiter_id, state)
        }
        return null
    }

    public async updateInfo(agency_id: string, user_id: string, userDto: UserBasicInfoDto): Promise<User | null> {
        const user = await this.usersService.findOne({
            agency_id: new ObjectId(agency_id),
            _id: user_id
        })
        if (user) {
            return await this.usersService.updateInfo(user_id, userDto)
        }

        return null
    }

    // public async updateEmail(agency_id: string, user_id: string, userDto: UserBasicInfoDto): Promise<User | null> {
    //     const user = await this.usersService.findOne({
    //         agency_id: new ObjectId(agency_id),
    //         _id: user_id
    //     })
    //     if (user) {
    //         return this.usersService.updateInfo(user_id, userDto)
    //     }

    //     return null
    // }

    public async deleteRecruiter(agency_id, recruiter_id: string): Promise<User | null> {
        const user = await this.usersService.findOne({
            agency_id: new ObjectId(agency_id),
            _id: recruiter_id
        })
        let state = new UpdateUserState()

        if (user && user.id) {
            state = this.mapperService.map<UpdateUserState>(user, UpdateUserState.name, User.name)
            state.is_deleted = true
            return this.usersService.changeUserState(recruiter_id, state)
        }
        return null
    }
    public async getRecruiterInfo(payload: JwtPayload, user_id: string, populate_statistic?: boolean): Promise<RecruiterDto> {
        const query: any = {
            _id: user_id,
            role: 'recruiter'
        }
        if (payload.role !== 'admin') {
            query.agency_id = payload.agency_id
        }
        const user = await this.usersService.findOne(query, [{
            path: 'assigned_job_list'
        }, { path: 'created_job_list' }
        ])

        if (user) {
            const objUser = this.mapperService.map<RecruiterDto>(user, RecruiterDto.name, User.name)
            objUser.open_job = user.open_job
            objUser.close_job = user.close_job
            if (populate_statistic) {
                const totalCvParsing = await this.daxtraIntegrationService.countParsingById(user.agency_id.toString(), user_id)
                const totalAssessmentReport = await this.candidateAssessmentService.countAssessmentReportById(user.agency_id.toString(), user_id)
                return { ...objUser, ...totalCvParsing, ...totalAssessmentReport }
            }
            return objUser
        }
        return null
    }
    public async getRecruiterDetail(user_id: string): Promise<RecruiterDto> {
        const user = await this.usersService.findOne({
            _id: user_id,
            role: 'recruiter'
        }, [{
            path: 'assigned_job_list'
        }, { path: 'created_job_list' }
        ])

        if (user) {

            const objUser = this.mapperService.map<RecruiterDto>(user, RecruiterDto.name, User.name)
            objUser.open_job = user.open_job
            objUser.close_job = user.close_job
            return objUser
        }
        return null
    }
    async paginateList(filter: RecruiteFilterParam): Promise<OutListRecruiterDto> {
        try {
            const query: FilterQuery<any> = {
                is_deleted: { $ne: true },
                role: 'recruiter'
            }
            if (filter.agency_id) {
                query.agency_id = new ObjectId(filter.agency_id)
            }
            if (filter.keyword) {
                if (filter.keyword && filter.keyword.trim().length > 0) {
                    query.$text = {
                        $search: `"${filter.keyword.trim()}"`
                    }
                }
            }
            const size = filter.size
            let skip = (filter.page - 1) * filter.size
            if (filter.page == 1 && filter.agency_id) {
                filter.size = size - 1
            }
            if (filter.page != 1 && filter.agency_id) {
                skip = (filter.page - 1) * filter.size - 1
            }

            const options: PaginateOptions = {
                offset: skip,
                limit: filter.size
            }
            options.pagination = filter.paginate != 'false'

            if (filter.sort_field && filter.sort_direction) {
                options.sort = {}
                options.sort[filter.sort_field] = filter.sort_direction
            }

            options.populate = ['assigned_job_list', 'created_job_list']

            const userList = await this.usersService.paginate(options, query)
            const result = new OutListRecruiterDto(filter.page, filter.size)

            if (filter.agency_id) {
                const agencyFilter: FilterQuery<any> = {
                    agency_id: new ObjectId(filter.agency_id),
                    is_deleted: { $ne: true },
                    role: 'agency'
                }
                if (filter.keyword) {
                    if (filter.keyword && filter.keyword.trim().length > 0) {
                        agencyFilter.$text = {
                            $search: `"${filter.keyword}"`
                        }
                    }
                }
                const agency = await this.usersService.findOne(agencyFilter, [
                    {
                        path: 'assigned_job_list'
                    },
                    {
                        path: 'created_job_list'
                    }
                ])
                if (agency) {
                    if (filter.page == 1) {
                        userList.docs.unshift(agency)
                        result.size++
                    }
                    userList.totalDocs = userList.totalDocs + 1
                }
                // add one agency to the list of recruiter on top page
            }
            result.total = userList.totalDocs
            result.recruiter_list = []
            if (!userList.totalDocs) {
                return result
            }
            const mapUsers = userList.docs.map(u => {
                const mappedUser = this.mapperService.map<UserDto>(u, UserDto.name, User.name)
                mappedUser.open_job = u.open_job
                mappedUser.close_job = u.close_job
                return mappedUser
            })

            result.recruiter_list = mapUsers
            return result
        } catch (error) {
            this.logger.error(error)
        }
    }
}
