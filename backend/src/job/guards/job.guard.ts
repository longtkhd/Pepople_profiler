import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ObjectId } from 'mongodb'
import { JwtPayload } from 'src/auth/dto/login'
import { JobService } from '../job.service'

@Injectable()
export class JobGuard implements CanActivate {
    constructor(private readonly jobService: JobService) {
        // do nothing
    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()
        const { user, params: { agency_id, job_id } } = request

        if (agency_id && agency_id.length > 23 && user.agency_id.toString() !== agency_id) {
            console.log(agency_id)
            throw new HttpException('AGENCY_NOT_FOUND', HttpStatus.FORBIDDEN)
        }
        if (job_id) {
            const job = await this.jobService.findOne({
                _id: job_id,
                agency_id: new ObjectId((user as JwtPayload).agency_id)
            })
            if (!job) {
                throw new HttpException('JOB_NOT_FOUND', HttpStatus.FORBIDDEN)
            }
            
        }
        return true
    }
}