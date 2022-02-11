import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { ObjectId } from 'mongodb'
import { InjectModel } from 'nestjs-typegoose'
import { ProjectAssessment } from 'src/schemas/assessments.schema'
import { ProjectAssessmentDto, ProjectAssessmentFilterDto } from './dto/projectAssessment'

@Injectable()
export class ProjectAssessmentService {
    private readonly logger = new Logger('ProjectAssessmentService')
    constructor(
        @InjectModel(ProjectAssessment) private readonly repo: ReturnModelType<typeof ProjectAssessment>,
    ) { }

    async getProjectAssessments(filter: ProjectAssessmentFilterDto) {
        return await this.repo.find(filter.buildFilterQuery()).populate(['industry', 'type']).exec()
    }

    async getProjectAssessmentById(id: string) {
        return await this.repo.findById({ _id: new ObjectId(id) }).exec()
    }
    // async getProjectAssessmentByKey(key: string) {
    //     return await this.repo.findOne({ project_access_key: key }).exec()
    // }

    async createProjectAssessment(_ProjectAssessmentDto: ProjectAssessmentDto) {
        const projectAssessment = new this.repo()
        projectAssessment.name = _ProjectAssessmentDto.name
        projectAssessment.project_access_key = _ProjectAssessmentDto.project_access_key
        // projectAssessment.industry = new ObjectId(_ProjectAssessmentDto.industry)
        // projectAssessment.type = new ObjectId(_ProjectAssessmentDto.type)
        return await projectAssessment.save()
    }
    async editProjectAssessment(id: string, _ProjectAssessmentDto: ProjectAssessmentDto): Promise<ProjectAssessment> {
        await this.repo.findOneAndUpdate({
            _id: new ObjectId(id),
        }, {
            industry: new ObjectId(_ProjectAssessmentDto.industry),
            name: _ProjectAssessmentDto.name,
            project_access_key: _ProjectAssessmentDto.project_access_key,
            type: new ObjectId(_ProjectAssessmentDto.type)

        }, { new: true }).then(result => {
            this.logger.error(result)
            if (!result) throw new HttpException('ProjectAssessment_NOT_FOUND', HttpStatus.NOT_FOUND)
            result
        })
        const data = await this.repo.findById({ _id: new ObjectId(id) })

        return data
    }

    async deleteProjectAssessment(id: string) {
        return await this.repo.findOneAndUpdate({
            _id: new ObjectId(id)
        }, {
            is_deleted: true
        }, { new: true }).then(doc => {
            if (!doc) throw new HttpException('ProjectAssessment_NOT_FOUND', HttpStatus.BAD_REQUEST)
            return doc
        })
    }

}