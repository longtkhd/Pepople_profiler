import { forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { JwtPayload, UpdateUserState, UserBasicInfoDto, UserDto } from '../auth/dto/login'
import { User, UserTextSearch } from '../schemas/user.schema'
import { NotificationSetting } from '../schemas/notification-setting.schema'
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose'
import { AgencyService } from '../agency/agency.service'
import {
    CreatePaymentHistoryDto,
    IPinpaymentCharges,
    RecruiterBasicInfoDto,
    UserInvitedDto,
} from '../agency/dto/agency'
import { ObjectID as DBObjectID } from 'mongodb'
import { InjectModel } from 'nestjs-typegoose'
import { MapperService } from '../shared/mapper/mapper.service'
import { ReturnModelType } from '@typegoose/typegoose'
import { FileInput } from 'src/shared/base.dto'
import { CsvParser, ParsedData } from 'nest-csv-parser'
import { Readable } from 'stream'
import { AgencyNotificationSettings, CSVSetting, InfoChargesRecruiter, RecruiterNotificationSettings, UserNotificationSettingDto } from './dto/settings'
import { QueryPopulateOptions } from 'mongoose'
import { PinPaymentException } from '../shared/pin-payment.exception'
import { PinpaymentService } from '../shared/pinpayment.service'
import { plainToClass } from 'class-transformer'
import { v1 } from 'uuid'
@Injectable()
export class UsersService {
    private readonly logger = new Logger('UserSerivce');
    constructor(
        @InjectModel(User) private readonly repo: ReturnModelType<typeof User>,
        private readonly csvParser: CsvParser,
        private readonly mapperService: MapperService,
        @Inject(forwardRef(() => AgencyService))
        private readonly agencyService: AgencyService,
        private readonly pinPaymentService: PinpaymentService,
    ) {
        this.mapperService.createMap(UserBasicInfoDto.name, User.name)
        this.mapperService.createMap(UserInvitedDto.name, User.name)
        this.mapperService.createMap(UserDto.name, User.name)
        this.mapperService.createMap(User.name, UserDto.name)
        this.mapperService.createMap(RecruiterBasicInfoDto.name, UserInvitedDto.name)
        this.mapperService.createMap(UserNotificationSettingDto.name, NotificationSetting.name)
    }

    async paginate(options: PaginateOptions, query: FilterQuery<User>): Promise<PaginateResult<User>> {
        return this.repo.paginate(query, options)
    }
    public async findByEmail(userEmail: string): Promise<User | null> {
        return await this.repo.findOne({ email: { $regex: new RegExp(userEmail.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i') } })
    }
    public async findById(id: string): Promise<User | null> {
        return await this.repo.findOne({ _id: id }).exec()
    }
    async findOne(query: FilterQuery<User>, populate?: QueryPopulateOptions[]) {
        const queryBuild = this.repo.findOne(query)
        if (populate) {
            return await queryBuild.populate(populate).exec()
        }
        return await queryBuild.exec()
    }
    async find(query: FilterQuery<User>) {
        return await this.repo.find(query)
    }
    async findUserByRole(role: string): Promise<User[] | []> {
        return await this.repo.find({ role: role })
    }
    async deleteAgency(agency_id: string) {
        const users = await this.repo.find({ agency_id: new DBObjectID(agency_id) })
        for (let index = 0; index < users.length; index++) {
            const uuid = v1() + index
            const user = users[index]
            user.email = `deleted${uuid}@deleted.deleted`
            user.first_name = `deleted${uuid}`
            user.last_name = `deleted${uuid}`
            user.job_title = `deleted${uuid}`
            user.phone_number = `deleted${uuid}`
            user.country_code = null
            user.is_deleted = true
            await this.repo.findByIdAndUpdate({ _id: user.id }, {
                ...user
            })
        }
        return users
    }
    public async countUser() {
        const agency = await this.repo.countDocuments({
            is_deleted: { $ne: true },
            role: 'agency'
        })
        const recruiter = await this.repo.countDocuments(
            {
                is_deleted: { $ne: true },
                role: { $ne: 'admin' },
            })
        return { agency, recruiter }
    }

    public async updateInfo(user_id: string, userDto: UserBasicInfoDto): Promise<User | null> {
        const user = await this.findById(user_id)
        if (user && (await user).email !== userDto.email) {
            const existEmail = await this.findByEmail(userDto.email)
            if (existEmail) {
                throw new HttpException(
                    'email_already_exist',
                    HttpStatus.BAD_REQUEST,
                )
            }
        }
        const res = await this.repo.findByIdAndUpdate({ _id: user_id }, {
            ...userDto
        })

        if (res) {
            const dbUser = await this.findById(user_id)
            const mappedUser = this.mapperService.map<UserDto>(user, UserDto.name, User.name)
            await this.buildSearchText(mappedUser)
            return dbUser
        } else {
            return null
        }
    }
    public async updateNotificationSetting(user_id: string, notification_settings: UserNotificationSettingDto[]): Promise<User | null> {
        const res = await this.repo.findByIdAndUpdate({ _id: user_id }, {
            notification_settings: notification_settings
        })
        if (res) {
            return this.findById(user_id)
        } else {
            return null
        }
    }
    public async changeUserState(user_id: string, userState: UpdateUserState): Promise<User | null> {
        if (userState.is_deleted) {
            userState.prepareDelete(v1())
        }
        const res = await this.repo.findByIdAndUpdate({ _id: user_id }, {
            ...userState
        })
        if (res) {
            return res
        } else {
            return null
        }
    }

    public async deactiveAllRecruiterByAgencyId(agencyId: string) {
        await this.repo.updateMany(
            { agency_id: agencyId, role: 'recruiter' },
            { is_active: false },
        )
    }

    public async changePassword(
        id: string,
        newPass: string,
    ): Promise<User | null> {
        const user = await this.repo.findById(id)
        if (!user._id) {
            // tslint:disable-next-line:no-console
            console.error('user doesn\'t exist')
            return null
        }
        //console.error("user id");
        user.password = newPass
        user.is_verify = true
        await user.hashPassword()
        await this.repo.updateOne({ _id: id }, user)
        return await this.repo.findById(id)
    }

    public async registerAgency(userDto: UserBasicInfoDto): Promise<User> {
        try {
            const existEmail = await this.findByEmail(userDto.email)
            if (existEmail) {
                throw new HttpException(
                    'User already exists',
                    HttpStatus.BAD_REQUEST,
                )
            }
            const userModel = this.mapperService.map<User>(
                userDto,
                User.name,
                UserBasicInfoDto.name,
            )
            //this.repo.paginate()
            const newUser = new this.repo(userModel) // InstanceType<User>
            newUser.role = 'agency'
            newUser.text_search = this.createSearchText(newUser)
            newUser.notification_settings = AgencyNotificationSettings
            const saveduser = await this.repo.create(newUser)

            //const savedUser = await this.repo.create(user);
            const nAgency = await this.agencyService.createAgency(userDto, saveduser.id)
            //saveduser.agency_id = new DBObjectID(nAgency.id);

            await this.repo.updateOne({ _id: saveduser.id }, { agency_id: new DBObjectID(nAgency.id) })

            const dbUser = await this.findById(saveduser.id)

            return dbUser
        } catch (error) {
            this.logger.error(error)
            throw error
        }
    }
    bufferToStream(binary) {

        const readableInstanceStream = new Readable({
            read() {
                this.push(binary)
                this.push(null)
            }
        })

        return readableInstanceStream
    }
    snakeCase = string => {
        // eslint-disable-next-line quotes
        return string.replace(/\W+/g, " ")
            .split(/ |\B(?=[A-Z])/)
            .map(word => word.trim().toLowerCase())
            .join('_')
    };
    public async parseImportRecruiterCSV(file: FileInput, csvSetting: CSVSetting): Promise<Array<UserInvitedDto>> {
        try {
            const entities: ParsedData<any> = await this.csvParser.parse(this.bufferToStream(file.buffer), Object, null, null, { separator: csvSetting.separator })
            console.log('parseImportRecruiterCSV')
            const nUser: UserInvitedDto[] = []
            const template = { email: '', first_name: '', job_title: '', last_name: '', contact_number: '', country_code: '' }
            if (entities && entities.total) {
                const recruiter_list = entities.list

                for (let i = 0; i < recruiter_list.length; i++) {
                    const recruiter = recruiter_list[i]
                    const recruiterDto = new UserInvitedDto()
                    let parseOk = false
                    for (const key in recruiter) {
                        const dtoKey = Object.keys(template)
                        dtoKey.forEach(k => {
                            if (this.snakeCase(k.trim()) === this.snakeCase(key.trim())) {
                                if (this.snakeCase(key.trim()) == 'contact_number') {
                                    recruiterDto.phone_number = recruiter[key]
                                }
                                else {
                                    recruiterDto[k] = recruiter[key]
                                }
                                parseOk = true
                            }
                        })

                    }
                    if (parseOk) {
                        nUser.push(recruiterDto)
                    }
                }
            }
            return nUser
        } catch (error) {
            this.logger.error(error)
            throw error
        }
    }
    public async registerRecruiter(userDto: UserInvitedDto, payload: JwtPayload, isValidate?: boolean): Promise<UserInvitedDto> {
        try {
            userDto.invite_result_code = 'ok'
            const existEmail = await this.findByEmail(userDto.email)
            if (existEmail) {
                userDto.invite_result_code = 'existed_user'
                return userDto
            }
            const nUser = this.mapperService.map<User>(
                userDto,
                User.name,
                UserInvitedDto.name,
            )
            nUser.agency_id = new DBObjectID(payload.agency_id)
            nUser.created_by = new DBObjectID(payload.id)
            nUser.role = 'recruiter'
            nUser.text_search = this.createSearchText(nUser)
            nUser.notification_settings = RecruiterNotificationSettings
            if (!isValidate) {
                const savedUser = await this.repo.create(nUser)
                if (!savedUser || !savedUser._id) {
                    userDto.invite_result_code = 'internal_server_error'
                    return userDto
                }
                userDto.id = savedUser._id.toHexString()

            }

            return userDto
        } catch (error) {
            this.logger.error(error)
            throw error
        }
    }

    async validateMaxRecruiterOnSubcribe(agencyId: string, max_recruiter: number): Promise<boolean> {
        const recruiters = await this.repo
            .countDocuments({
                agency_id: agencyId,
                is_deleted: false,
            })
            .exec()
        return recruiters <= max_recruiter

    }

    /**
     * Payment invite recruiter charges and update agency size
     * @param { InfoChargesRecruiter } _chargesInfo: Info charges
     * @param { string } agencyId: Id agency in current user
     * @return { boolean }
     * */
    async paymentChargesInviteRecruiter(
        _chargesInfo: InfoChargesRecruiter,
        agencyId: string
    ): Promise<boolean> {
        try {
            const agency = await this.agencyService.getAgencyDetail(agencyId)
            if (!agency?.payment_info) {
                throw new HttpException('PAYMENT_INFO_ERROR', 500)
            }
            const chargesData: IPinpaymentCharges = {
                amount: _chargesInfo.amount,
                description: 'Payment the cost to invite the recruiter',
                customer_token: agency?.payment_info?.customer_token,
                email: agency?.payment_info?.customer_email
            }
            const paymentInfo = await this.pinPaymentService.customerCharges(chargesData)
            const chargeResponse = {
                ...paymentInfo,
                agency_id: agency.id,
                package_id: agency.subscription_plan.package_id.id,
            }
            const paymentHistoryData = plainToClass(
                CreatePaymentHistoryDto,
                chargeResponse,
            )
            await this.agencyService.createPaymentHistory(paymentHistoryData)
            let totalRecruiter: number = _chargesInfo.recruiters + agency.recruiter_count
            if (_chargesInfo?.isAgencySize) totalRecruiter = +agency?.company_info?.agency_size + _chargesInfo.recruiters
            await this.agencyService.updateAgencySize(agencyId, totalRecruiter.toString(), true)
            return true
        } catch (e) {
            throw new PinPaymentException(e, 500)
        }
    }
    createSearchText(user: UserTextSearch) {
        try {
            return `${user.first_name || ''} ${user.last_name || ''} ${user.email || ''}`
        } catch (error) {
            this.logger.error('unable to build text search for user')
            this.logger.error(error)
        }
    }

    async buildSearchText(dbUser: UserDto) {
        try {
            if (dbUser) {
                const text_search = this.createSearchText({ ...dbUser })

                await this.repo.updateOne({ _id: new DBObjectID(dbUser.id) }, {
                    text_search: text_search
                })
            }
        } catch (error) {
            this.logger.error('unable to build text search for user')
            this.logger.error(error)
        }
    }

    async buildAllSearchText() {
        try {
            const users = await this.repo.find({ role: { $ne: 'admin' }, is_deleted: { $ne: true } }).exec()
            const promises = users.map(async user => {
                const mappedUser = this.mapperService.map<UserDto>(user, UserDto.name, User.name)
                await this.buildSearchText(mappedUser)
            })
            await Promise.all(promises)
        } catch (error) {
            this.logger.error('unable to build text search for user')
            this.logger.error(error)
        }
    }
}
