import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'
import { ObjectID } from 'mongodb'
import { FilterQuery } from 'mongoose'
import { MailTemplate } from 'src/schemas/mailTemplate'
import { PaginationDto } from 'src/shared/base.dto'

export class MailTemplateDto {
    @ApiProperty()
    name: string

    @ApiProperty()
    type: number

    @ApiProperty()
    subject: string

    @ApiProperty()
    content: string
}

export class ListMailTemplateDto {
    @Type(() => MailTemplateDto)
    @IsArray()
    @ValidateNested({ each: true })
    @ApiProperty({ type: [MailTemplateDto] })
    template_list: [MailTemplateDto]
}

export class MailTemplateFilterParamDto extends PaginationDto {
    public buildFilterQuery(): FilterQuery<MailTemplate> {
        const query: FilterQuery<MailTemplate> = {}
        if (this.created_by) query.created_by = new ObjectID(this.created_by)
        return query
    }
    @ApiProperty()
    created_by: string;
}

export class FilterMailTemplateByType {
    @ApiProperty()
    type: number
}
