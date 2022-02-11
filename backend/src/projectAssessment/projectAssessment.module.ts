import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { ProjectAssessment } from 'src/schemas/assessments.schema'
import { ProjectAssessmentController } from './projectAssessment.controller'
import { ProjectAssessmentService } from './projectAssessment.service'

@Module({
    imports: [TypegooseModule.forFeature([ProjectAssessment])],
    controllers: [ProjectAssessmentController],
    providers: [ProjectAssessmentService],
    exports: [ProjectAssessmentService]
})
export class ProjectAssessmentModule { }
