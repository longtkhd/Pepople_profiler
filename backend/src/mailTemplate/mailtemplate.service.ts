import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { FilterQuery, ObjectId } from 'mongodb'
import { InjectModel } from 'nestjs-typegoose'
import { JwtPayload } from 'src/auth/dto/login'
import { MailTemplate } from 'src/schemas/mailTemplate'
import { FilterMailTemplateByType, MailTemplateDto } from './dto/mailTemplate'

@Injectable()
export class MailTemplateService {
    private readonly logger = new Logger('MailTemplateService');
    constructor(
        @InjectModel(MailTemplate) private readonly repo: ReturnModelType<typeof MailTemplate>,
    ) { }

    async createMailTemplate(payload: JwtPayload, _MailTemplateDto: MailTemplateDto): Promise<MailTemplate> {
        const mailTemplate = new this.repo()
        mailTemplate.name = _MailTemplateDto.name
        mailTemplate.type = _MailTemplateDto.type
        mailTemplate.created_by = new ObjectId(payload.id)
        mailTemplate.subject = _MailTemplateDto.subject
        mailTemplate.content = _MailTemplateDto.content
        return await mailTemplate.save()
    }

    async getListMailTemplate(payload: JwtPayload, _filterMailTemplateByType: FilterMailTemplateByType) {
        const filter: FilterQuery<MailTemplate> = {
            is_deleted: { $ne: true },
            created_by: new ObjectId(payload.id)
        }
        if (_filterMailTemplateByType && _filterMailTemplateByType.type) {
            filter.type = _filterMailTemplateByType.type
        }
        return await this.repo.find(filter).exec()
    }

    async getMailTemplateById(id: string) {
        return await this.repo.findById({ _id: new ObjectId(id) })
    }

    async editMailTemplate(id: string, _MailTemplateDto: MailTemplateDto): Promise<MailTemplate> {
        await this.repo.findOneAndUpdate({
            _id: new ObjectId(id),
        }, {
            name: _MailTemplateDto.name,
            type: _MailTemplateDto.type,
            subject: _MailTemplateDto.subject,
            content: _MailTemplateDto.content
        }, { new: true }).then(result => {
            this.logger.error(result)
            if (!result) throw new HttpException('EMAIL_TEMPLATE_NOT_FOUND', HttpStatus.NOT_FOUND)
            result
        })
        const data = await this.repo.findById({ _id: new ObjectId(id) })
        console.log(data)
        return data
    }

    async deleteMailTemplate(id: string) {
        return await this.repo.findOneAndUpdate({
            _id: new ObjectId(id)
        }, {
            is_deleted: true
        }, { new: true }).then(doc => {
            if (!doc) throw new HttpException('EMAIL_TEMPLATE_NOT_FOUND', HttpStatus.BAD_REQUEST)
            return doc
        })
    }


}
