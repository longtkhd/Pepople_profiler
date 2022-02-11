import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post,  Query,  Res, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'

import { JwtPayload } from '../auth/dto/login'
import { Ip } from '../shared/decorators/ip.decorator'
import { User } from '../shared/decorators/user.decorator'
import { BaseResponse } from '../shared/base.dto'
import { JWTAuthGuard } from '../auth/guards/auth.guard'
import { FilterMailTemplateByType, ListMailTemplateDto, MailTemplateDto } from './dto/mailTemplate'
import { MailTemplateService } from './mailtemplate.service'
import { MailTemplate } from 'src/schemas/mailTemplate'

@Controller('mailTemplate')
@ApiTags('mailTemplate')
@UseGuards(JWTAuthGuard)
@ApiBearerAuth()
export class MailTemplateController {
    constructor(
    private readonly mailTemplateService: MailTemplateService,
    ){}
    @HttpCode(HttpStatus.OK)
    @Get('getMailTemplatesForUser')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: ListMailTemplateDto,
        description: 'API to Get list of mail template for user'
    })
    async getMailTemplatesForUser(@Res() res,  @User() payload: JwtPayload, @Query() _filterMailTemplateByType: FilterMailTemplateByType): Promise<BaseResponse<MailTemplateDto[]>> {
        const response: BaseResponse<MailTemplateDto[]> = {
            success: true
        }
        const data = await this.mailTemplateService.getListMailTemplate(payload,_filterMailTemplateByType)
        response.data = data
        return res.status(HttpStatus.OK).json(response) 
    }

    @HttpCode(HttpStatus.OK)
    @Get('getMailTemplatesForUser/:id')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: ListMailTemplateDto,
        description: 'API to Get mail template for user by id'
    })
    async getMailTemplatesById(@Res() res, @Param('id') id: string): Promise<BaseResponse<MailTemplateDto>> {
        const response: BaseResponse<MailTemplateDto> = {
            success: true
        }
        const data = await this.mailTemplateService.getMailTemplateById(id)
        response.data = data
        return res.status(HttpStatus.OK).json(response) 
    }


    @HttpCode(HttpStatus.OK)
    @Post('addMailTemplatesForUser')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: Boolean,
        description: 'API to add new mail template for user'
    })
    async addMailTemplatesForUser(@Res() res, @Ip() userIp, @User() payload: JwtPayload, @Body() _MailTemplateDto:MailTemplateDto): Promise<BaseResponse<MailTemplate>> {
        const response: BaseResponse<MailTemplate> = {
            success: true
        }
        const data = await this.mailTemplateService.createMailTemplate(payload, _MailTemplateDto)
        response.data = data
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Post('editMailTemplatesForUser/:id')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: MailTemplateDto,
        description: 'API to edit mail template for user'
    })
    async editMailTemplatesForUser(@Res() res,@Param('id') id: string, @Body() _MailTemplateDto:MailTemplateDto): Promise<BaseResponse<MailTemplateDto>> {
        const response: BaseResponse<MailTemplateDto> = {
            success: true
        }
        const data = await this.mailTemplateService.editMailTemplate(id, _MailTemplateDto)
        response.data = data 
        return res.status(HttpStatus.OK).json(response)
    }

    @HttpCode(HttpStatus.OK)
    @Delete('deleteMailTemplatesForUser/:id')
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        type: MailTemplateDto,
        description: 'API to edit mail template for user'
    })
    async deleteMailTemplatesForUser(@Res() res, @Param('id') id: string): Promise<BaseResponse<MailTemplateDto>> {
        const response: BaseResponse<MailTemplateDto> = {
            success: true
        }
        const data = await this.mailTemplateService.deleteMailTemplate(id)
        response.data = data 
        return res.status(HttpStatus.OK).json(response)
    }
}
