/**
 *
 * Create new Exception with response from API Pinpayment
 */

import { HttpException } from '@nestjs/common';

export class PinPaymentException extends HttpException {
    constructor(error: any, status: number) {
        let handleError: any;
        let invalidResource = error?.response?.data;
        if (invalidResource) {
            if (invalidResource.messages) {
                let messages = invalidResource.messages.map(
                    (mes) => mes.message,
                );
                handleError = messages.length
                    ? messages.join('\n')
                    : messages[0];
            } else {
                handleError = invalidResource.error_description
                    ? invalidResource.error_description
                    : invalidResource;
            }
        } else {
            handleError = error;
        }
        super(handleError, status);
    }
}
