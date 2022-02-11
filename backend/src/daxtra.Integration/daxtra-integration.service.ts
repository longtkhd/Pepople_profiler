import { forwardRef, HttpException, HttpService, Inject, Injectable, Logger } from '@nestjs/common'
import * as AdmZip from 'adm-zip'
import { map } from 'rxjs/operators'
import { FileInput } from 'src/shared/base.dto'
import { ConfigurationService } from 'src/shared/configuration/configuration.service'
import { DaxtraCVParserResponseDto, OutCvParsingDto, TopCvParsingDto } from './dto/response.dto'
import * as FormData from 'form-data'
import { AxiosRequestConfig } from 'axios'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { CVParsingLog } from 'src/schemas/cvparsing.log'
import { JwtPayload } from 'src/auth/dto/login'
import { AgencyService } from 'src/agency/agency.service'
import { Agency } from 'src/schemas/agency.schema'
import { FilterQuery, ObjectId } from 'mongodb'
import { FilterCvParsing } from './dto/request.dto'

@Injectable()
export class DaxtraIntegrationService {
    constructor(
        @InjectModel(CVParsingLog) private readonly repo: ReturnModelType<typeof CVParsingLog>,
        @InjectModel(CVParsingLog) private readonly agencies: ReturnModelType<typeof Agency>,
        private readonly httpService: HttpService,
        @Inject(forwardRef(() => AgencyService))
        private readonly agencyService: AgencyService,
        private readonly coreConfig: ConfigurationService) { }
    private readonly logger = new Logger(DaxtraIntegrationService.name)
    private async generateToken() {
        const requestUrl = `${this.coreConfig.datrax_config.base_url}auth/v1/access_token?account=${this.coreConfig.datrax_config.username}`
        const token = await this.httpService.get<string>(requestUrl).pipe(map(response => response.data)).toPromise()
        if (!token) {
            throw new HttpException('UNABLE_TO_GENERATE_TPTOKEN', 500)
        }
        return token
    }
    async parseFull(file: FileInput) {
        try {
            const requestUrl = `${this.coreConfig.datrax_config.base_url}api/v1/profile/full/json`
            const bodyFormData = new FormData()
            bodyFormData.append('account', this.coreConfig.datrax_config.username + '; -turbo')
            bodyFormData.append('file', file.buffer, file.originalname)
            const response = await this.httpService.get<DaxtraCVParserResponseDto>(requestUrl).pipe(map(response => response.data)).toPromise()
            if (response.Resume) {
                return response.Resume
            }
        } catch (error) {
            this.logger.error(error)
            throw new HttpException('UNABLE_TO_PARSE_CV', 500)
        }

    }

    async parseBatch(files: FileInput[]) {
        try {

            const requestUrl = `${this.coreConfig.datrax_config.base_url}api/v1/profile/batch/json`
            const bodyFormData = new FormData()
            const zip = new AdmZip()
            if (!files) return undefined
            files.forEach(file => {
                if (file && file.buffer && file.buffer.length)
                    zip.addFile(file.originalname, file.buffer)
            })

            const willSendthis = zip.toBuffer()
            bodyFormData.append('account', this.coreConfig.datrax_config.username + '; -turbo')
            bodyFormData.append('file', willSendthis)

            const config: AxiosRequestConfig = {
                // method: 'post',
                // url: requestUrl,
                headers: {
                    ...bodyFormData.getHeaders()
                },
                // data: bodyFormData,
                timeout: 60000
            }
            return await this.httpService.post(requestUrl, bodyFormData, config).pipe(map(response => {
                return response.data
            })).toPromise()

        } catch (error) {
            this.logger.error(error)
            return undefined
            // throw new HttpException('UNABLE_TO_PARSE_BATCH_CV', 500)
        }
    }

    str2bytes(str) {
        const bytes = new Uint8Array(str.length)
        for (let i = 0; i < str.length; i++) {
            bytes[i] = str.charCodeAt(i)
        }
        return bytes
    }

    async convert2Html(file: FileInput) {
        try {
           
            const requestUrl = `${this.coreConfig.datrax_config.base_url}api/v1/convert2html`
            const bodyFormData = new FormData()
            bodyFormData.append('account', this.coreConfig.datrax_config.username + '; -turbo')
            bodyFormData.append('file', file.buffer)

            const config: AxiosRequestConfig = {
                // method: 'post',
                // url: requestUrl,
                headers: {
                    ...bodyFormData.getHeaders()
                },
                // data: bodyFormData,
                timeout: 60000
            }

            return await this.httpService.post(requestUrl, bodyFormData, config).pipe(map(response => {
                return response.data
            })).toPromise()
        } catch (error) {
            console.log(error)
            this.logger.error(error)
        }
    }

    async processBatch(token: string, files: FileInput[], payload: JwtPayload) {
        try {

            const requestUrl = `${this.coreConfig.datrax_config.base_url}api/v1/data?token=${token}`
            const res = await this.httpService.get(requestUrl, {
                timeout: 60000,
                responseType: 'arraybuffer'
            }).pipe(map(response => response.data)).toPromise()

            const isZip = res.toString() !== token

            if (!isZip) {
                return await this.processBatch(token, files, payload)
            }
            //const buf = this.str2bytes(res)
            // const buf = Buffer.alloc(res.length, res)
            const buffer = Buffer.from(res, 'binary')
            const zip = new AdmZip(buffer)
            //zip.readFile
            const zipEntries = zip.getEntries()
            const response = {}
            for (let i = 0; i < zipEntries.length; i++) {
                const zfilename = zipEntries[i].entryName
                const file = files.find(x => zfilename.includes(x.originalname))
                const fileContent = zip.readAsText(zipEntries[i])
                try {
                    const jsonContent = JSON.parse(fileContent) as DaxtraCVParserResponseDto
                    //console.log(jsonContent)
                    if (file && jsonContent) {
                        response[file.originalname] = jsonContent
                    }
                } catch (error) {
                    console.log(error)
                    this.logger.error(error)
                }
            }
            if (files.length) {
                const promises = files.map(async _f => await this.saveParsingLog(payload, token))
                await Promise.all(promises)
            }
            return response
        } catch (error) {
            console.log(error)
            this.logger.error(error)
        }
    }
    async saveParsingLog(payload: JwtPayload, key: string) {
        const model = new this.repo()
        model.created_by = new ObjectId(payload.id)
        model.agency_id = new ObjectId(payload.agency_id)
        model.result = key
        await model.save()
    }
    public async countParsing(agency_id: string, userId: string) {
        const currentMonth = new Date().getMonth() + 1
        const currentYear = new Date().getFullYear()
        //count parsing by month
        const queryBuilder: any[] = [
            { $expr: { $eq: [{ $month: '$created_at' }, currentMonth] } },
            { $expr: { $eq: [{ $year: '$created_at' }, currentYear] } },
            { agency_id: new ObjectId(agency_id), created_by: new ObjectId(userId) }
        ]
        return await this.repo.countDocuments({
            $and: queryBuilder
        })
    }


    public async countParsingById(agency_id: string, user_id?: string) {
        const currentMonth = new Date().getMonth() + 1
        const currentYear = new Date().getFullYear()
        const queryBuilderInnerTotal: any[] = [
        ]
        const queryBuilderInnerMonth: any[] = [
            { $expr: { $eq: [{ $month: '$updated_at' }, currentMonth] } },
            { $expr: { $eq: [{ $year: '$updated_at' }, currentYear] } },
        ]

        const queryBuilderInnerYear: any[] = [
            { $expr: { $eq: [{ $year: '$updated_at' }, currentYear] } },
        ]
        if (agency_id) {
            queryBuilderInnerMonth.push({ agency_id: new ObjectId(agency_id) })
            queryBuilderInnerYear.push({ agency_id: new ObjectId(agency_id) })
            queryBuilderInnerTotal.push({ agency_id: new ObjectId(agency_id) })
        }
        if (user_id) {
            queryBuilderInnerMonth.push({ created_by: new ObjectId(user_id) })
            queryBuilderInnerYear.push({ created_by: new ObjectId(user_id) })
            queryBuilderInnerTotal.push({ created_by: new ObjectId(user_id) })
        }
        const queryBuilderByMonth: FilterQuery<CVParsingLog> = {
            $and: queryBuilderInnerMonth
        }
        const queryBuilderByYear: FilterQuery<CVParsingLog> = {
            $and: queryBuilderInnerYear
        }
        const queryBuilderTotal: FilterQuery<CVParsingLog> = {
            $and: queryBuilderInnerYear
        }
        const totalCvParsingByMonth = await this.repo.countDocuments(queryBuilderByMonth)

        const totalCvParsingByYear = await this.repo.countDocuments(queryBuilderByYear)
        const totalCvParsing = await this.repo.countDocuments(queryBuilderTotal)

        return { totalCvParsingByMonth, totalCvParsingByYear, totalCvParsing }

    }

    async countTotalParsing(_filterCvParsing: FilterCvParsing): Promise<OutCvParsingDto> {


        let match = {}
        let filter = {}
        if (_filterCvParsing.agency_id && _filterCvParsing.from_date && _filterCvParsing.to_date) {
            match = { 'stringDate': { $gte: _filterCvParsing.from_date, $lte: _filterCvParsing.to_date }, agency_id: new ObjectId(_filterCvParsing.agency_id) }
            filter = {
                created_at: { $gte: _filterCvParsing.from_date, $lte: _filterCvParsing.to_date },
                agency_id: new ObjectId(_filterCvParsing.agency_id)
            }
        }
        else {
            match = {
                'stringDate': { $gte: _filterCvParsing.from_date, $lte: _filterCvParsing.to_date }
            }
            filter = {
                created_at: { $gte: _filterCvParsing.from_date, $lte: _filterCvParsing.to_date }
            }
        }
        const totalCvParsing = await this.repo.countDocuments(filter)
        const topCvParsing = await this.repo.aggregate([
            {
                $lookup: {
                    from: 'agencies',       // other table name
                    localField: 'agency_id',   // name of users table field
                    foreignField: '_id', // name of userinfo table field
                    as: 'user_info'         // alias for userinfo table
                }
            },
            { $unwind: '$user_info' },
            { $addFields: { stringDate: { $dateToString: { format: '%Y-%m-%d', date: '$updated_at' } } } },
            { $match: { ...match } },
            { $group: { _id: { agency_id: '$agency_id', agency_name: '$user_info.agency_name' }, count: { $sum: 1 } } },
            { $sort: { 'count': -1 } },
            { $limit: 10 }
        ])
        const topCV = topCvParsing.map(x => {
            const dto = new TopCvParsingDto()
            dto.agency_id = x._id.agency_id
            dto.count = x.count
            dto.agency_name = x._id.agency_name
            return dto
        })
        return { totalCvParsing, topCvParsing: topCV }
    }
}

