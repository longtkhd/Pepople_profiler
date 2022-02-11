import { ApiProperty } from '@nestjs/swagger'
import { PaginateOptions } from 'mongoose'
export class FileInput {
    @ApiProperty()
    fieldname: string;
    @ApiProperty()
    originalname: string;
    @ApiProperty()
    mimetype: string;
    @ApiProperty()
    file_md5: string

    @ApiProperty()
    size: number;
    @ApiProperty()
    buffer: Buffer;
}

export interface BaseResponse<T> {
    data?: T | null,
    error?: {
        message: string,
        payload?: any
    } | null
    success?: boolean | true
}
export enum SortDirection {
    DES = -1,
    ASC = 1
}
export class PaginationDto {

    @ApiProperty()
    page: number;

    @ApiProperty()
    size: number;

    @ApiProperty()
    total: number;

    @ApiProperty()
    sort_field: string;

    @ApiProperty()
    paginate:string;

    @ApiProperty()
    populate = undefined

    @ApiProperty()
    keyword:string;

    @ApiProperty()
    sort_direction: SortDirection;
    constructor(page: number, size: number) {
        this.page = page || 1
        this.size = size || 20
    }
    public buildPagingQuery(populate?: any): PaginateOptions {
        const options: PaginateOptions = {
            page: this.page,
            limit: this.size
        }
       
        options.pagination =  this.paginate != 'false'

        if (this.sort_field && this.sort_direction) {
            options.sort = {}
            options.sort[this.sort_field] = this.sort_direction
        }

        if (populate) {
            options.populate = populate
        }
        
        return options
    }
}