import { HttpException, Injectable } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { PaymentHistory } from 'src/schemas/payment-history.schema'
import { MapperService } from 'src/shared/mapper/mapper.service'
import { PaginateOptions, FilterQuery, PaginateResult } from 'mongoose'
import {
    CreatePaymentHistoryDto,
    PaymentHistoriesDto,
    PaymentHistoryDto,
    PaymentHistoryFilterParamDto,
} from './dto/agency'
import { SortDirection } from 'src/shared/base.dto'

@Injectable()
export class PaymentHistoryService {
    constructor(
        @InjectModel(PaymentHistory)
        private readonly repo: ReturnModelType<typeof PaymentHistory>,
        private readonly mapperService: MapperService,
    ) {
        this.mapperService.createMap(
            PaymentHistory.name,
            PaymentHistoryDto.name,
        )
    }

    async create(
        createPaymentHistoryDto: CreatePaymentHistoryDto,
    ): Promise<PaymentHistory> {
        try {
            const newPayment = new this.repo({ 
                ...createPaymentHistoryDto, 
                amount: createPaymentHistoryDto.amount / 100 
            })
            return await newPayment.save()
        } catch (error) {
            throw new HttpException(error, 500)
        }
    }

    async paginate(
        options: PaginateOptions,
        query: FilterQuery<PaymentHistory>,
    ): Promise<PaginateResult<PaymentHistory>> {
        return this.repo.paginate(query, options)
    }

    async paginatePaymentHistoryList(
        filter: PaymentHistoryFilterParamDto,
    ): Promise<PaymentHistoriesDto> {
        try {
            filter.sort_field = 'updated_at'
            filter.sort_direction = SortDirection.DES
            const list = await this.repo.paginate(
                filter.buildFilterQuery(),
                filter.buildPagingQuery(['package_id'])
            )
            filter.sort_field
            const result = new PaymentHistoriesDto(filter.page, filter.size, )
            result.total = list.totalDocs
            result.list = []
            if (!list.totalDocs) return result

            const mapperList = list.docs.map((p) =>
                this.mapperService.map<PaymentHistoryDto>(
                    p,
                    PaymentHistoryDto.name,
                    PaymentHistory.name,
                ),
            )
            result.list = mapperList
            return result
        } catch (error) {
            throw new HttpException(error, 500)
        }
    }
}
