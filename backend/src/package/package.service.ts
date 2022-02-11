import { BadRequestException, HttpException, Injectable } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { ObjectId } from 'mongodb'
import { Package } from 'src/schemas/package.schema'
import { MapperService } from 'src/shared/mapper/mapper.service'
import { OutPackageListDto, PackageFilterParamDto, PackageInfoDto, CreatePakageDto } from './dto/package.dto'
import { JwtPayload } from 'src/auth/dto/login'
import { SortDirection } from 'src/shared/base.dto'

@Injectable()
export class PackageService {
    constructor(
        @InjectModel(Package)
        private readonly repo: ReturnModelType<typeof Package>,
        private readonly mapperService: MapperService,
    ) {
        this.mapperService.createMap(Package.name, PackageInfoDto.name)
    }

    async paginatePackageList(filter: PackageFilterParamDto): Promise<OutPackageListDto> {
        try {
            filter.paginate = 'false'
            filter.sort_field = 'price'
            filter.sort_direction = SortDirection.ASC
            const list = await this.repo.paginate(
                filter.buildFilterQuery(),
                filter.buildPagingQuery(),
            )
            const result = new OutPackageListDto(filter.page, filter.size)
            result.total = list.totalDocs
            result.list = []
            if (!list.totalDocs) return result

            const mapperList = list.docs.map((p) =>
                this.mapperService.map<PackageInfoDto>(
                    p,
                    PackageInfoDto.name,
                    Package.name,
                ),
            )
            result.list = mapperList
            return result
        } catch (error) {
            throw new HttpException(error, 500)
        }
    }

    async getDetail(package_id: string): Promise<Package> {
        try {
            const packageDetail = await this.repo.findById(
                new ObjectId(package_id),
            )
            return packageDetail
        } catch (error) {
            throw new HttpException(error, 500)
        }
    }

    async create(createPackageDto: CreatePakageDto, user: JwtPayload): Promise<PackageInfoDto> {
        try {
            const newDataPackage = new this.repo()
            newDataPackage.package_name = createPackageDto.package_name
            newDataPackage.price = createPackageDto.price
            newDataPackage.description = createPackageDto.description
            newDataPackage.max_cv_parsing = createPackageDto.max_cv_parsing
            newDataPackage.max_recruiter = createPackageDto.max_recruiter
            newDataPackage.max_assessment_limit = createPackageDto.max_assessment_limit
            newDataPackage.color = createPackageDto.color
            newDataPackage.package_size = createPackageDto.package_size
            newDataPackage.created_by = new ObjectId(user.id)

            const newPackage = await newDataPackage.save()
            return this.mapperService.map<PackageInfoDto>(newPackage, PackageInfoDto.name, Package.name)

        } catch (error) {
            throw new HttpException(error, 500)
        }
    }
}
