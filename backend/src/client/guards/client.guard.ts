
import { Injectable, CanActivate, ExecutionContext, HttpStatus, HttpException } from '@nestjs/common'
import { ClientService } from '../client.service'
import { JwtPayload } from 'src/auth/dto/login'
import { ObjectId } from 'mongodb'
@Injectable()
export class ClientGuard implements CanActivate {
    constructor(
    private readonly clientService: ClientService
    ) {
    // do nothing
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const { user, params: { client_id } } = request
        let errMessage = ''
        if (client_id) {
            const client = await this.clientService.findOne({
                _id: client_id,
                agency_id: new ObjectId((user as JwtPayload).agency_id)
            })
            if (!client) {
                errMessage = 'CLIENT_NOT_FOUND'
            }
            if (errMessage)
                throw new HttpException(errMessage, HttpStatus.FORBIDDEN)

        }
        return true
    }
}
