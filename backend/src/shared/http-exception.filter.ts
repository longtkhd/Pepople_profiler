import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp()
        const request = context.getRequest()
        const response = context.getResponse()
        const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
        console.log(exception)
        const errorResponse = {
            code: status,
            timestamp: Date.now(),
            path: request.url,
            method: request.method,
            message: status !== HttpStatus.INTERNAL_SERVER_ERROR ? (exception.getResponse() || null) : 'INTERNAL_SERVER_ERROR'
        }

        return response.status(status).json(errorResponse)
    }
}