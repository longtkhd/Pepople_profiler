import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose'

import { CreateNotificationDto } from './dto/create-notification.dto'
import { GetNotificationDto } from './dto/get-notification.dto'
import { UpdateNotificationReqDto } from './dto/update-notification.dto'
import { NotificationFilterParam, NotificationDto, UpdateNotificationState } from './dto/notification.dto'
import { Notification } from '../schemas/notification.schema'

import { MapperService } from '../shared/mapper/mapper.service'
import { SortDirection } from '../shared/base.dto'
import { v1 } from 'uuid'
@Injectable()
export class NotificationService {
    private readonly logger = new Logger('NotificationService');
    constructor(
        @InjectModel(Notification) private readonly repo: ReturnModelType<typeof Notification>,
        private readonly mapperService: MapperService,
    ) {
        this.mapperService.createMap(Notification, UpdateNotificationState)
        this.mapperService.createMap(Notification.name, NotificationDto.name)
    }

    async findById(id: string): Promise<Notification | null> {
        return await this.repo.findOne({ _id: id }).exec()
    }

    async findOne(query: FilterQuery<Notification>): Promise<Notification | null> {
        return await this.repo.findOne(query)
    }

    async paginate(options: PaginateOptions, query: FilterQuery<Notification>): Promise<PaginateResult<Notification>> {
        return this.repo.paginate(query, options)
    }

    async create(createNotificationDto: CreateNotificationDto) {
        createNotificationDto.created_date = new Date()
        return await this.repo.create(createNotificationDto)
    }

    async paginateList(userId: string, filter: NotificationFilterParam): Promise<GetNotificationDto> {
        try {
            filter.sort_field = 'created_date'
            filter.sort_direction = SortDirection.DES
            const filterQuery: FilterQuery<Notification> = {
                receiver_id: userId,
                is_deleted: false
            }
           
            const notificationList = await this.paginate(filter.buildPagingQuery(filter.populate), filterQuery)
            const result = new GetNotificationDto(filter.page, filter.size)
            result.total = notificationList.totalDocs
            result.notifications = []
            if (!notificationList.totalDocs) return result
            if (filter.lastSeenNotification) {
                filterQuery.created_date = { $gt: filter.lastSeenNotification }
                filterQuery.status = 0
            }
            const unReadCount = await this.repo.countDocuments(filterQuery)
            const mapNotifications = notificationList.docs.map(u => {
                const mapNotification = this.mapperService.map<NotificationDto>(u, NotificationDto.name, Notification.name)
                return mapNotification
            })
            result.un_read_count = unReadCount
            result.notifications = mapNotifications
            return result
        } catch (error) {
            this.logger.error(error)
        }
    }

    async deleteNotification(id: string): Promise<Notification | null> {
        const notification = await this.findById(id)
        let state = new UpdateNotificationState()
        if (notification && notification.id) {
            state = this.mapperService.map<UpdateNotificationState>(notification, UpdateNotificationState.name, Notification.name)
            state.is_deleted = true
            return this.updateNotificationDelete(id, state)
        }
        return null
    }

    async updateNotificationDelete(id: string, state: UpdateNotificationState): Promise<Notification | null> {
        if (state.is_deleted) {
            state.prepareDelete(v1())
        }
        return this.repo.findByIdAndUpdate({ _id: id }, {
            ...state
        })
    }

    async updateNotification(id: string, state: UpdateNotificationReqDto) {
        console.log(state)
        return await this.repo.findByIdAndUpdate({ _id: id }, {
            ...state
        })
    }
}
