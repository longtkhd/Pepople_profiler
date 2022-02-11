import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Res, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtPayload } from '../auth/dto/login'
import { GetOperationId } from '../shared/utils/get-operation-id'

import { User } from '../shared/decorators/user.decorator'
import { BaseResponse } from '../shared/base.dto'
import { OutStatistiesDto, SubscriptionTypeDto } from './dto/statistics'
import { JWTAuthGuard, JwtPermissionGuard } from '../auth/guards/auth.guard'
import { MapperService } from 'src/shared/mapper/mapper.service'
import { AgencyService } from 'src/agency/agency.service'
import { AgencyFilterParamDto, OutAgencyListingDto } from 'src/agency/dto/agency'
import { PackageService } from 'src/package/package.service'
import { CreatePakageDto, PackageInfoDto } from 'src/package/dto/package.dto'

import { AdminService } from './admin.service'
import { ListCountry, ListIndustry } from './dto/csv'
import { AssessmentIndustryDto, AssessmentTypeDto } from './dto/assessment'
import { UsersService } from 'src/user/user.service'
import { Agency } from 'src/schemas/agency.schema'
import { DaxtraIntegrationService } from 'src/daxtra.Integration/daxtra-integration.service'
import { CandidateAssessmentService } from 'src/candidate/candidate-assessment.service'
import { OutCvParsingDto } from 'src/daxtra.Integration/dto/response.dto'
import { FilterCvParsing } from 'src/daxtra.Integration/dto/request.dto'
import { FilterAssessmentReport } from 'src/candidate/dto/input'
import { OutAssessmentReportDto } from 'src/candidate/dto/output'
import { SubscriptionService } from 'src/agency/agency_subscription.service'
import { JobService } from 'src/job/job.service'
import { ClientService } from 'src/client/client.service'

@Controller('admin')
@ApiTags('admin')
@UseGuards(JwtPermissionGuard('admin'))
@ApiBearerAuth()
export class AdminController {
    constructor(
        private readonly usersService: UsersService,
        private readonly jobService: JobService,
        private readonly clientService: ClientService,
        private readonly adminService: AdminService,
        private readonly subscriptionService: SubscriptionService,
        private readonly agencyService: AgencyService,
        private readonly packageService: PackageService,
        private readonly mapperService: MapperService,
        private readonly daxtraIntegrationService: DaxtraIntegrationService,
        private readonly candidateAssessmentService: CandidateAssessmentService,
    ) {
        //this.mapperService.createMap(User.name, UserDto);
    }
    @HttpCode(HttpStatus.OK)
    @Get('agencies')
    @ApiResponse({
        status: HttpStatus.OK,
        type: OutAgencyListingDto,
        description: 'API to Get list of agency',
    })
    @ApiOperation(GetOperationId('agency', 'list', 'API to Get list of agency'))
    async agency_list(
        @Res() res,
        @User() payload,
        @Query() _agencyFilterParamDto: AgencyFilterParamDto,
    ): Promise<BaseResponse<OutAgencyListingDto>> {
        const list = await this.agencyService.paginateAgencyList(
            _agencyFilterParamDto,
        )
        const response: BaseResponse<OutAgencyListingDto> = { success: true }
        response.data = list
        return res.status(HttpStatus.OK).json(response)
    }

    @Get('/re-index')
    async ReIndex(@Res() res) {
        const response: BaseResponse<boolean> = { success: true }
        await this.usersService.buildAllSearchText()
        await this.clientService.buildAllSearchText()
        await this.jobService.buildAllSearchText()
        response.data = true
        return res.status(HttpStatus.CREATED).json(response)
    }

    @Get('/cleanUp')
    async cleanUp(@Res() res) {
        const response: BaseResponse<boolean> = { success: true }
        await this.agencyService.cleanUp()
      
        response.data = true
        return res.status(HttpStatus.CREATED).json(response)
    }
    @Post('/import-countries')
    async ImportCounties(@Res() res) {
        const response: BaseResponse<Array<ListCountry>> = { success: true }
        const countries = await this.adminService.parseImportCountryCSV()
        response.data = countries
        return res.status(HttpStatus.CREATED).json(response)
    }

    @Post('/import-industries')
    async ImportIndustries(@Res() res) {
        const response: BaseResponse<Array<ListIndustry>> = { success: true }
        const industries = await this.adminService.parseImportIndustryCSV()
        response.data = industries
        return res.status(HttpStatus.CREATED).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Post('package')
    async create_package(
        @Res() res,
        @User() payload,
        @Body() _createPackage: CreatePakageDto,
    ): Promise<BaseResponse<PackageInfoDto>> {
        const response: BaseResponse<PackageInfoDto> = { success: true }
        try {
            const newPackage = await this.packageService.create(
                _createPackage,
                payload,
            )
            response.data = newPackage
        } catch (error) {
            response.success = false
            response.error = error
        }

        return res.status(HttpStatus.OK).json(response)
    }


    @HttpCode(HttpStatus.OK)
    @Post('addAssessmentIndustry')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to add Assessment Industry'
    })
    async addAssessmentIndustry(@Res() res, @User() payload: JwtPayload, @Body() _AssessmentIndustryDto: AssessmentIndustryDto): Promise<BaseResponse<AssessmentIndustryDto>> {
        const response: BaseResponse<AssessmentIndustryDto> = {
            success: true
        }
        const data = await this.adminService.createAssessmentIndustry(_AssessmentIndustryDto)
        response.data = data
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Post('editAssessmentIndustry/:id')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to edit Assessment Industry'
    })
    async editProjectAssessment(@Res() res, @User() payload, @Param('id') id: string, @Body() _AssessmentIndustryDto: AssessmentIndustryDto): Promise<BaseResponse<AssessmentIndustryDto>> {
        const response: BaseResponse<AssessmentIndustryDto> = {
            success: true
        }
        const data = await this.adminService.editAssessmentIndustry(id, _AssessmentIndustryDto)
        response.data = data
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Delete('deleteAssessmentIndustry/:id')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to delete Assessment Industry'
    })
    async deleteProjectAssessment(@Res() res, @User() payload, @Param('id') id: string): Promise<BaseResponse<AssessmentIndustryDto>> {
        const response: BaseResponse<AssessmentIndustryDto> = {
            success: true
        }
        const data = await this.adminService.deleteAssessmentIndustry(id)
        response.data = data
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Post('addAssessmentType')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to add Assessment Type'
    })
    async addAssessmentType(@Res() res, @User() payload: JwtPayload, @Body() _AssessmentTypeDto: AssessmentTypeDto): Promise<BaseResponse<AssessmentTypeDto[]>> {
        const response: BaseResponse<AssessmentTypeDto> = {
            success: true
        }
        const data = await this.adminService.createAssessmentType(_AssessmentTypeDto)
        response.data = data
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Post('editAssessmentType/:id')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to edit Assessment Type'
    })
    async editAssessmentType(@Res() res, @User() payload, @Param('id') id: string, @Body() _AssessmentTypeDto: AssessmentTypeDto): Promise<BaseResponse<AssessmentTypeDto>> {
        const response: BaseResponse<AssessmentTypeDto> = {
            success: true
        }
        const data = await this.adminService.editAssessmentType(id, _AssessmentTypeDto)
        response.data = data
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Delete('deleteAssessmentType/:id')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to delete Assessment Type'
    })
    async deleteAssessmentType(@Res() res, @User() payload, @Param('id') id: string): Promise<BaseResponse<AssessmentTypeDto>> {
        const response: BaseResponse<AssessmentTypeDto> = {
            success: true
        }
        const data = await this.adminService.deleteAssessmentType(id)
        response.data = data
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Get('countUser')
    @ApiResponse({
        status: HttpStatus.OK,
        type: OutStatistiesDto,
        description: 'API to get Assessment Statistic  (PENDING)',
    })
    @ApiOperation(
        GetOperationId(
            'Admin',
            'Assessment_Statistic',
            'API to get Assessment Statistic',
        ),
    )
    async countUser() {
        //const token = await this.tokenService.create(req.user);
        const response: BaseResponse<any> = {
            success: true,
        }
        const data = await this.usersService.countUser()
        response.data = data
        return response
        //return plainToClass(OutBasicDto, { status, message });
    }

    @Delete('/:agency_id/deleteAgency')
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth()
    async deleteAgency(
        @Res() res,
        @Param('agency_id') agency_id: string,
        @User() payload: JwtPayload,
    ) {
        if (payload.role !== 'admin') {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: 'agency_not_found',
            })
        }
        const response: BaseResponse<Agency> = {
            success: true,
        }
        const data = await this.agencyService.deleteAgency(agency_id)
        response.data = data
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Post(':agency_id/Deactive')
    @UseGuards(JwtPayload)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: String,
        description: 'API to deactivate agency'
    })
    @ApiOperation(GetOperationId('agency', 'deactivate', 'API to delete agency'))
    async deactivate(@Res() res, @Param('agency_id') agency_id: string): Promise<BaseResponse<any>> {
        const response: BaseResponse<any> = { success: true }

        const deactiveUser = await this.agencyService.deactivateAgency(agency_id)
        response.success = deactiveUser != null
        response.data = deactiveUser

        return res.status(HttpStatus.OK).json(response)
    }


    @HttpCode(HttpStatus.OK)
    @Get('getCountParsing')
    @UseGuards(JwtPayload)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: OutCvParsingDto,
        description: 'API to count parsing'
    })
    @ApiOperation(GetOperationId('count', 'parsing', 'API to count parsing'))
    async getCountParsing(@Res() res, @Query() _filterCvParsing: FilterCvParsing): Promise<BaseResponse<OutCvParsingDto>> {
        const response: BaseResponse<OutCvParsingDto> = { success: true }
        const data = await this.daxtraIntegrationService.countTotalParsing(_filterCvParsing)
        response.data = data

        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Get('getCountAssessment')
    @UseGuards(JwtPayload)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: OutAssessmentReportDto,
        description: 'API to count assessment'
    })
    @ApiOperation(GetOperationId('count', 'assessment', 'API to count assessment'))
    async getCountAssessment(@Res() res, @Query() _filterAssessmentReport: FilterAssessmentReport): Promise<BaseResponse<OutAssessmentReportDto>> {
        const response: BaseResponse<OutAssessmentReportDto> = { success: true }
        const data = await this.candidateAssessmentService.countAssessmentReport(_filterAssessmentReport)
        response.data = data

        return res.status(HttpStatus.OK).json(response)
    }


    @HttpCode(HttpStatus.OK)
    @Get('getCountSubscription')
    @UseGuards(JwtPayload)
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: SubscriptionTypeDto,
        description: 'API to count subscriptions type'
    })
    @ApiOperation(GetOperationId('count', 'subscriptions', 'API to count subscriptions type'))
    async getCountSubscription(@Res() res): Promise<SubscriptionTypeDto> {
        const response: BaseResponse<any> = { success: true }
        const data = await this.subscriptionService.statisticSubscriptionType()
        response.data = data
        return res.status(HttpStatus.OK).json(response)
    }
}
