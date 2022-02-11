import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { CsvParser } from 'nest-csv-parser'
import { InjectModel } from 'nestjs-typegoose'
import { Country } from 'src/schemas/country.schema'
import { MapperService } from 'src/shared/mapper/mapper.service'
import * as fs from 'fs'
import { Industry } from 'src/schemas/industry.schema'
import { AssessmentIndustryDto, AssessmentTypeDto } from './dto/assessment'
import { AssessmentIndustry, AssessmentType } from 'src/schemas/assessments.schema'
import { ObjectId } from 'mongodb'

@Injectable()
export class AdminService {
    private readonly logger = new Logger('AssessmentIndustry')
    constructor(@InjectModel(Country) private readonly repo: ReturnModelType<typeof Country>,
        @InjectModel(Industry) private readonly repoIndustry: ReturnModelType<typeof Industry>,
        @InjectModel(AssessmentIndustry) private readonly repoAssessmentIndustry: ReturnModelType<typeof AssessmentIndustry>,
        @InjectModel(AssessmentType) private readonly repoAssessmentType: ReturnModelType<typeof AssessmentType>,
        private readonly csvParser: CsvParser,
        private readonly mapperService: MapperService,
    ) { }

    public async getListCountry() {
        return await this.repo.find({})
    }

    public async parseImportCountryCSV() {
        //'./email_template/agency_welcome.ejs
        const stream = fs.createReadStream('./data/countries.csv')
        const entities = await this.csvParser.parse(stream, Country, null, null, { separator: ',', mapHeaders: ({ header }) => header.toLowerCase() })
        const countries = await this.repo.insertMany(entities.list)
        return countries
    }

    public async getListIndustry() {
        return await this.repoIndustry.find()
    }

    public async parseImportIndustryCSV() {
        const stream = fs.createReadStream('./data/industries.csv')
        const entities = await this.csvParser.parse(stream, Industry, null, null, { separator: ',' })
        const industries = await this.repoIndustry.insertMany(entities.list)
        return industries
    }

    async getAssessmentIndustry(): Promise<AssessmentIndustry[]> {
        return await this.repoAssessmentIndustry.find({ 'is_deleted': { $exists: false } })
    }

    async getAssessmentIndustryById(id: string): Promise<AssessmentIndustry> {
        return await this.repoAssessmentIndustry.findById({ _id: new ObjectId(id) })
    }
    async createAssessmentIndustry(_AssessmentIndustryDto: AssessmentIndustryDto): Promise<AssessmentIndustry> {
        const assessmentIndustry = new this.repoAssessmentIndustry()
        assessmentIndustry.name = _AssessmentIndustryDto.name
        return await assessmentIndustry.save()
    }

    async editAssessmentIndustry(id: string, _AssessmentIndustryDto: AssessmentIndustryDto): Promise<AssessmentIndustry> {
        await this.repoAssessmentIndustry.findOneAndUpdate({
            _id: new ObjectId(id),
        }, {
            ..._AssessmentIndustryDto
        }, { new: true }).then(result => {
            this.logger.error(result)
            if (!result) throw new HttpException('AssessmentIndustry_NOT_FOUND', HttpStatus.NOT_FOUND)
            result
        })
        const data = await this.repoAssessmentIndustry.findById({ _id: new ObjectId(id) })
        console.log(data)
        return data
    }

    async deleteAssessmentIndustry(id: string) {
        return await this.repoAssessmentIndustry.findOneAndUpdate({
            _id: new ObjectId(id)
        }, {
            is_deleted: true
        }, { new: true }).then(doc => {
            if (!doc) throw new HttpException('AssessmentIndustry_NOT_FOUND', HttpStatus.BAD_REQUEST)
            return doc
        })
    }


    async getAssessmentType(): Promise<AssessmentType[]> {
        return await this.repoAssessmentType.find({ 'is_deleted': { $exists: false } })
    }

    async getAssessmentTypeById(id: string): Promise<AssessmentType> {
        return await this.repoAssessmentType.findById({ _id: new ObjectId(id) })
    }

    async createAssessmentType(_AssessmentTypeDto: AssessmentTypeDto): Promise<AssessmentType> {
        const assessmentType = new this.repoAssessmentType()
        assessmentType.name = _AssessmentTypeDto.name
        return await assessmentType.save()
    }
    async editAssessmentType(id: string, _AssessmentTypeDto: AssessmentTypeDto): Promise<AssessmentType> {
        await this.repoAssessmentType.findOneAndUpdate({
            _id: new ObjectId(id),
        }, {
            ..._AssessmentTypeDto
        }, { new: true }).then(result => {
            this.logger.error(result)
            if (!result) throw new HttpException('AssessmentType_NOT_FOUND', HttpStatus.NOT_FOUND)
            result
        })
        const data = await this.repoAssessmentType.findById({ _id: new ObjectId(id) })
        console.log(data)
        return data
    }
    async deleteAssessmentType(id: string) {
        return await this.repoAssessmentType.findOneAndUpdate({
            _id: new ObjectId(id)
        }, {
            is_deleted: true
        }, { new: true }).then(doc => {
            if (!doc) throw new HttpException('AssessmentType_NOT_FOUND', HttpStatus.BAD_REQUEST)
            return doc
        })
    }




}
