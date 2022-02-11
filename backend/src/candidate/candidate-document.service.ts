import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'

import { CandidateDocumentList, CandidateDocumentDto } from './dto/candidate'
import { plainToClass } from 'class-transformer'
import { Readable } from 'stream'

import { BinaryLike, createHash } from 'crypto'
import { Candidate, CandidateDocument } from 'src/schemas/candidate.schema'
import { FileInput } from 'src/shared/base.dto'
import { ConfigurationService } from 'src/shared/configuration/configuration.service'
import { S3ManagerService } from 'src/aws/s3-manager.service'
import { JwtPayload } from 'src/auth/dto/login'
import { FilterQuery, ObjectId } from 'mongodb'
import { DocumentFilterParamDto } from './dto/input'

export const md5 = (contents: BinaryLike) => createHash('md5').update(contents).digest('hex')

@Injectable()
export class CandidateDocumentService {
    constructor(
        @InjectModel(CandidateDocument) private readonly repo: ReturnModelType<typeof CandidateDocument>,
        @InjectModel(Candidate) private readonly repoCandidate: ReturnModelType<typeof Candidate>,
        private readonly coreConfig: ConfigurationService,
        private readonly s3Service: S3ManagerService,
    ) { }
    private readonly logger = new Logger(CandidateDocumentService.name);
    async getById(id: string) {
        return await this.repo.findById(id).exec()
    }

    async findByCandidate(candidate_id: string) {
        return await this.repo.find({
            candidate_id: new ObjectId(candidate_id)
        }).exec()
    }
    async updatePublicCandidateDocument(isPublicIds: string[], candidate_id: string): Promise<boolean> {
        const isPublics = await this.repo.updateMany(
            {
                _id: { $in: isPublicIds },
                candidate_id: candidate_id,
            },
            {
                is_public: true,
            },
        )
        const isNotPublic = await this.repo.updateMany(
            {
                _id: {
                    $nin: isPublicIds,
                },
                candidate_id: candidate_id,
            },
            {
                is_public: false,
            },
        )
        return !!(isPublics && isNotPublic)
        
    }
    public async uploadCandidateFile(file: FileInput, candidate_id: string, payload: JwtPayload, type: number) {
        try {
            const fileMd5 = md5(file.buffer)
            
            await this.s3Service.uploadFile(this.coreConfig.aws.bucket, file.buffer, `${payload.agency_id.toString()}/candidate_${candidate_id}/${fileMd5}`)
            const candidate = await this.repoCandidate.findById(candidate_id)
            const newFile = new this.repo()
            newFile.candidate_id = new ObjectId(candidate_id)
            newFile.file_md5 = fileMd5
            newFile.file_name = file.originalname
            newFile.type = type
            newFile.agency_id = new ObjectId(payload.agency_id)
            if(type === 3) newFile.is_public = true
            const savedDb = await newFile.save()

            if (savedDb && savedDb.id) {
                return newFile
            }
            return null
        } catch (error) {
            this.logger.log(error)
            throw error
        }
    }

    public async deleteCandidateDocument(payload: JwtPayload, doc_id: string, candidate_id: string): Promise<CandidateDocument> {
        return await this.repo.findOneAndUpdate({
            _id: doc_id,
            candidate_id: candidate_id
        }, {
            is_deleted: true
        }, { new: true }).then(doc => {
            if (!doc) throw new HttpException('DOCUMENT_NOT_EXISTED', HttpStatus.BAD_REQUEST)
            return doc
        })
    }

    async getListDocumentCandidate(
        candidate_id: string,
        filter: DocumentFilterParamDto
    ): Promise<CandidateDocumentList> {
        try {
            const query: FilterQuery<CandidateDocument> = {
                candidate_id: new ObjectId(candidate_id),
                is_deleted: { $ne: true }
            }
            const getListDocument = await this.repo.paginate(query, filter.buildPagingQuery())
            const result = new CandidateDocumentList(filter.page, filter.size)
            result.total = getListDocument.totalDocs
            result.documents = getListDocument.totalDocs ? getListDocument.docs.map((doc) => {
                const mapped = plainToClass(CandidateDocumentDto, doc, { excludeExtraneousValues: true })
                return mapped
            }) : []

            return result
        } catch (error) {
            this.logger.log(error)
            throw error
        }
    }

    downloadCandidateDoc(agency_id: string, file_md5: string, candidate_id: string) {
        try {
            const Key = `${agency_id.toString()}/candidate_${candidate_id}/${file_md5}`
            return this.s3Service.getPrivateFile(this.coreConfig.aws.bucket, Key)
        } catch (error) {
            this.logger.error(error)
            throw error
        }
    }

    async downloadCandidateDocByInviteToken(token: string, payload: JwtPayload): Promise<Readable> {
        try {
            const candidates = await this.repo.findOne({ invite_token: token })
            if (!candidates) throw new HttpException('Token not found!', HttpStatus.NOT_FOUND)
            const candidateDocument = await this.repo.findById({ _id: candidates._id })
            const candidate_id = candidateDocument.candidate_id
            const fileMd5 = candidateDocument.file_md5
            const Key = `${payload.agency_id.toString()}/candidate_${candidate_id}/${fileMd5}`
            return this.s3Service.getPrivateFile(this.coreConfig.aws.bucket, Key)
        } catch (error) {
            this.logger.error(error)
            throw error
        }
    }

    async hanldeSingletonOriginalResuseDocument(
        agency_id: string,
        candidate_id: string
    ): Promise<any>{
        return await this.repo.updateMany({
            candidate_id: candidate_id,
            agency_id: agency_id,
            type: 3
        }, {
            is_deleted: true
        })
    }
    
    async getOriginalResumeDocument(
        agencyId: string,
        candidateId: string,
    ): Promise<CandidateDocument>{
        return await this.repo.findOne({
            agency_id: agencyId,
            candidate_id: candidateId,
            type: 3,
            is_deleted: { $ne: true }
        })
    }
}
