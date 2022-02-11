import { ApiProperty } from '@nestjs/swagger'
import { IsMongoId, IsOptional } from 'class-validator'
import { ObjectId } from 'mongodb'
import { FilterQuery } from 'mongoose'
import { ProjectAssessment } from 'src/schemas/assessments.schema'

export class ProjectAssessmentDto {
    @ApiProperty()
    name: string

    @ApiProperty()
    project_access_key: string

    @ApiProperty()
    @IsMongoId()
    industry: string

    @ApiProperty()
    @IsMongoId()
    type: string;
}
export class ProjectAssessmentFilterDto {
    @ApiProperty()
    @IsOptional()
    industry?: string

    @ApiProperty()
    @IsOptional()
    @IsMongoId()
    type?: string

    @ApiProperty()
    @IsOptional()
    project_access_key?: string
    public buildFilterQuery(): FilterQuery<ProjectAssessment> {
        const query: FilterQuery<ProjectAssessment> = {}
        if (this.industry) {
            query.industry = new ObjectId(this.industry)
        }
        if (this.type) {
            query.type = new ObjectId(this.type)
        }
        // if (this.project_access_key) {
        //     query.project_access_key = this.project_access_key
        // }

        query.is_deleted = { $ne: true }
        return query
    }
}