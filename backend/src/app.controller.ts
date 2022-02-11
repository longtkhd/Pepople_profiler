import { Controller, Get, HttpCode, HttpStatus, Param, Query, Res } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AdminService } from './admin/admin.service'
import { AssessmentType, ProjectAssessment } from './schemas/assessments.schema'
import { BaseResponse } from './shared/base.dto'
import { ProjectAssessmentService } from './projectAssessment/projectAssessment.service'
import { ProjectAssessmentFilterDto } from './projectAssessment/dto/projectAssessment'
import { OutPackageListDto, PackageFilterParamDto } from './package/dto/package.dto'
import { GetOperationId } from './shared/utils/get-operation-id'
import { PackageService } from './package/package.service'

@Controller('common')
@ApiTags('common')
export class AppController {
    constructor(private readonly appService: AppService,
        private readonly projectAssessmentService: ProjectAssessmentService,
        private readonly packageService: PackageService,
        private readonly adminService: AdminService,) { }

    @Get()
    ping(): string {
        return this.appService.ping()
    }
    @Get('/countries')
    @ApiBearerAuth()
    async getListCountry() {
        return await this.adminService.getListCountry()
    }
    @Get('/industry')
    @ApiBearerAuth()
    async getListIndustry() {
        return await this.adminService.getListIndustry()
    }

    @Get('/getAssessmentIndustry')
    @ApiBearerAuth()
    async getAssessmentIndustry() {
        return await this.adminService.getAssessmentIndustry()
    }

    @Get('/getAssessmentIndustry/:id')
    @ApiBearerAuth()
    async getAssessmentIndustryById(@Param('id') id: string) {
        return await this.adminService.getAssessmentIndustryById(id)
    }

    @Get('getAssessmentType')
    @ApiBearerAuth()
    async getAssessmentType() {
        return await this.adminService.getAssessmentType()
    }

    @Get('getAssessmentTypeById/:id')
    @ApiBearerAuth()
    async getAssessmentTypeById(@Res() res, @Param('id') id: string): Promise<BaseResponse<AssessmentType>>{
        const response: BaseResponse<AssessmentType> = {
            success: true
        }
        const data = await this.adminService.getAssessmentTypeById(id)
        response.data = data
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Get('getProjectAssessment')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: [ProjectAssessment],
        description: 'API to get Project Assessment list'
    })
    async getProjectAssessment(@Res() res, @Query() filterParams: ProjectAssessmentFilterDto): Promise<ProjectAssessment[]> {
        const response: BaseResponse<ProjectAssessment[]> = {
            success: true
        }
        const data = await this.projectAssessmentService.getProjectAssessments(filterParams)
        response.data = data
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Get('getProjectAssessmentById/:id')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: ProjectAssessment,
        description: 'API to get Project Assessment By Id'
    })
    async getProjectAssessmentById(@Res() res, @Param('id') id: string): Promise<ProjectAssessment> {
        const response: BaseResponse<ProjectAssessment> = {
            success: true
        }
        const data = await this.projectAssessmentService.getProjectAssessmentById(id)
        response.data = data
        return res.status(HttpStatus.OK).json(response)
    }

    /** PACKAGE API */
    @HttpCode(HttpStatus.OK)
    @Get('packages')
    @ApiResponse({
        status: HttpStatus.OK,
        type: OutPackageListDto,
        description: 'API to Get list of package',
    })
    @ApiOperation(
        GetOperationId('package', 'list', 'API to Get list of package'),
    )
    async package_list(
        @Res() res,
        @Query() _packageFilterParamDto: PackageFilterParamDto,
    ): Promise<BaseResponse<OutPackageListDto>> {
        const response: BaseResponse<OutPackageListDto> = { success: true }
        try {
            const list = await this.packageService.paginatePackageList(
                _packageFilterParamDto,
            )
            response.data = list
        } catch (error) {
            response.success = false
            response.error = error
        }

        return res.status(HttpStatus.OK).json(response)
    }

}
