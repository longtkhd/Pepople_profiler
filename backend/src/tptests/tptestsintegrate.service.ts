import { HttpException, HttpService, Injectable } from '@nestjs/common'
import { ConfigurationService } from 'src/shared/configuration/configuration.service'
import { TPCreateCandidateResponse, TPGetAssessmentsForCandidateResponse, TPGetAssessmentsScoreResponse, TPGetAssessmentsStatusResponse, TPIsCandidateResponse, TPTokenResponse } from './dto/response.mode'
import { map } from 'rxjs/operators'
import { RedisCacheService } from 'src/redisCache/redisCache.service'
import { TPCreateCandidateRequest, TPGetAssessmentsForCandidateRequest, TPGetAssessmentsScoresRequest, TPIsCandidateRequest } from './dto/request.model'

import { AssessmentReport } from 'src/schemas/candidate.schema'
import { Readable } from 'stream'

@Injectable()
export class TPTestsIntegrateService {
    constructor(
        private readonly httpService: HttpService,
        private readonly coreConfig: ConfigurationService,
        private readonly redisCacheService: RedisCacheService) { }
    private readonly TPTokenCacheKey = 'TPToken'
    private async generateToken() {
        const cacheToken = await this.redisCacheService.get(this.TPTokenCacheKey)

        if (!cacheToken) {
            const requestUrl = `${this.coreConfig.tp_test_config.base_url}/api/client/token?username=${this.coreConfig.tp_test_config.username}&password=${this.coreConfig.tp_test_config.password}`

            const res = await this.httpService.get<TPTokenResponse>(requestUrl).pipe(map(response => response.data)).toPromise()
            if (res.Errors && res.Errors.length > 0) {
                throw new HttpException('UNABLE_TO_GENERATE_TPTOKEN', 500)
            }

            this.redisCacheService.set(this.TPTokenCacheKey, res.AccessToken, {
                ttl: 2 * 60 // 4 min
            })

            return res.AccessToken
        }
        return cacheToken
    }
    async createCandidate(dto: TPCreateCandidateRequest, candidateAssessment: AssessmentReport) {
        const token = await this.generateToken()
       
        dto.AccessToken = token
        let requestUrl = `${this.coreConfig.tp_test_config.base_url}/api/candidate/?`
        for (const key in dto) {
            requestUrl += `&${key}=${encodeURIComponent(dto[key])}`
        }
        requestUrl += `&RedirectURL=${this.coreConfig.mailConfig.frontURL}finish-assessments?candidate_id=${candidateAssessment.tp_username}`
        const res = await this.httpService.post<TPCreateCandidateResponse>(requestUrl).pipe(map(response => response.data)).toPromise()
        return res
    }

    async IsCandidateExist(tpUsername: string) {
        const token = await this.generateToken()
       
        const dto = new TPIsCandidateRequest()
        dto.AccessToken = token
        dto.Username = tpUsername

        const requestUrl = `${this.coreConfig.tp_test_config.base_url}/api/candidate/IsCandidate?username=${dto.Username}&accessToken=${dto.AccessToken}`

        const res = await this.httpService.get<TPIsCandidateResponse>(requestUrl).pipe(map(response => response.data)).toPromise()
        
        return res.IsCandidate
    }

    async getAssessmentsForCandidate(tpUserName: string) {
        const token = await this.generateToken()
        const dto = new TPGetAssessmentsForCandidateRequest()
        dto.AccessToken = token
        dto.Username = tpUserName

        const requestUrl = `${this.coreConfig.tp_test_config.base_url}/api/candidate/GetAssessmentsForCandidate/${dto.Username}?&AccessToken=${dto.AccessToken}`
        const res = await this.httpService.get<TPGetAssessmentsForCandidateResponse>(requestUrl).pipe(map(response => response.data)).toPromise()

        return res.Assessments
    }

    //This API call returns the current scores for the Assessment specified by making a GET request to the above URL where 
    //tp_assessment_id is the unique Id of the  Assessment record that was returned in the JSON data from the above call to create the Candidate
    async getAssessmentScore(tp_assessment_id: string) {
        const token = await this.generateToken()
        const dto = new TPGetAssessmentsScoresRequest()
        dto.AccessToken = token
        const requestUrl = `${this.coreConfig.tp_test_config.base_url}/api/assessment/scores/${tp_assessment_id}?&AccessToken=${dto.AccessToken}`

        const res = await this.httpService.get<TPGetAssessmentsScoreResponse>(requestUrl).pipe(map(response => response.data)).toPromise()

        return res
    }
    async getAssessmentStatus(tp_assessment_id: string) {
        const token = await this.generateToken()
        const dto = new TPGetAssessmentsScoresRequest()
        dto.AccessToken = token
        const requestUrl = `${this.coreConfig.tp_test_config.base_url}/api/assessment/status/${tp_assessment_id}?&AccessToken=${dto.AccessToken}`

        const res = await this.httpService.get<TPGetAssessmentsStatusResponse>(requestUrl).pipe(map(response => response.data)).toPromise()

        return res
    }
    getReadableStream(buffer: Buffer): Readable {
        const stream = new Readable()

        stream.push(buffer)
        stream.push(null)

        return stream
    }
    async getAssessmentReportsZip(tp_assessment_id: string) {
        const token = await this.generateToken()
        const dto = new TPGetAssessmentsScoresRequest()
        dto.AccessToken = token
        const requestUrl = `${this.coreConfig.tp_test_config.base_url}/api/assessment/reports/${tp_assessment_id}?&AccessToken=${dto.AccessToken}`

        const response = await this.httpService.get(requestUrl, { responseType: 'arraybuffer' }).pipe(map(response => response.data)).toPromise()
        const buffer = Buffer.from(response, 'binary')
       
        return this.getReadableStream(buffer)
    }
}
