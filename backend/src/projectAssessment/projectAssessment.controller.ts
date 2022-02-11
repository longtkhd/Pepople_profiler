import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { User } from '../shared/decorators/user.decorator'
import { JwtPayload } from 'src/auth/dto/login'
import { JWTAuthGuard, JwtPermissionGuard } from 'src/auth/guards/auth.guard'
import { BaseResponse } from 'src/shared/base.dto'
import { ProjectAssessmentService } from './projectAssessment.service'
import { ProjectAssessmentDto } from './dto/projectAssessment'

@Controller('projectassessment')
@ApiTags('projectassessment')
@UseGuards(JWTAuthGuard)
@ApiBearerAuth()
export class ProjectAssessmentController {
    constructor(
        private readonly projectAssessmentService: ProjectAssessmentService
    ) {

    }

    @HttpCode(HttpStatus.OK)
    @Post('addProjectAssessment')
    @UseGuards(JwtPermissionGuard('admin'))
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to add Project Assessment'
    })
    async addProjectAssessment(@Res() res, @User() payload: JwtPayload, @Body() _ProjectAssessmentDto: ProjectAssessmentDto): Promise<BaseResponse<boolean>> {
        const response: BaseResponse<boolean> = {
            success: true
        }
        await this.projectAssessmentService.createProjectAssessment(_ProjectAssessmentDto)
        response.data = true
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Post('editProjectAssessment/:id')
    @UseGuards(JwtPermissionGuard('admin'))
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to edit Project Assessment'
    })
    async editProjectAssessment(@Res() res, @Param('id') id: string, @Body() _ProjectAssessmentDto: ProjectAssessmentDto): Promise<BaseResponse<boolean>> {
        const response: BaseResponse<boolean> = {
            success: true
        }
        await this.projectAssessmentService.editProjectAssessment(id, _ProjectAssessmentDto)
        response.data = true
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Delete('deleteProjectAssessment/:id')
    @UseGuards(JwtPermissionGuard('admin'))
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to delete Project Assessment'
    })
    async deleteProjectAssessment(@Res() res, @User() payload, @Param('id') id: string): Promise<BaseResponse<boolean>> {
        const response: BaseResponse<boolean> = {
            success: true
        }
        await this.projectAssessmentService.deleteProjectAssessment(id)
        response.data = true
        return res.status(HttpStatus.OK).json(response)
    }

}