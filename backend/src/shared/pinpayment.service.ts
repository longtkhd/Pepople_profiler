import Axios from 'axios'
import { ConfigurationService } from './configuration/configuration.service'
import { HttpException, Injectable, Logger } from '@nestjs/common'
import { PinPaymentException } from './pin-payment.exception'
import { IPinpaymentCharges } from '../agency/dto/agency'
import { roundNumber } from './utils/constants'

@Injectable()
export class PinpaymentService {
    private readonly logger = new Logger()
    constructor(
        private readonly coreService: ConfigurationService
    ) {}
    
    public createInstanceAxios() {
        try {
            const pinUrl = this.coreService.get('PIN_PAYMENT_TEST_URL')
            const pinSecret = this.coreService.get('PIN_SECRET')
            const pinSecretBase64 = Buffer.from(pinSecret).toString('base64')
            const pinPaymentAxios = Axios.create({
                baseURL: pinUrl,
                timeout: 1000,
            })
            pinPaymentAxios.defaults.headers.common['Authorization'] = `Basic ${pinSecretBase64}`
            return pinPaymentAxios
        }catch (e) {}
    }
    
    public async createPinpaymentCustomer(customerData){
        try {
            const pinPaymentAxios = this.createInstanceAxios()
            const response =  await await pinPaymentAxios.post(
                `/1/customers`,
                customerData,
            )
            const result= response?.data?.response
            if(!result && !result?.card){
                throw new HttpException('Response data card not found!', 404)  
            }
            return result
        }catch (e) {
            throw new PinPaymentException(e, 500)
        }
    }
    
    public async updatePinpaymentCustomer(customerToken, customerData){
        try {
            const pinPaymentAxios = this.createInstanceAxios()
            const response =  await await pinPaymentAxios.put(
                `/1/customers/${customerToken}`,
                customerData,
            )
            const result= response?.data?.response
            if(!result && !result?.card){
                throw new HttpException('Response data card not found!', 404)
            }
            return result
        }catch (e) {
            throw new PinPaymentException(e, 500)
        }
    }
    
    public async customerCharges(dataCharges: IPinpaymentCharges){
        try {
            const pinPaymentAxios = this.createInstanceAxios()
            /* AU$1 = 100 cent */
            dataCharges.amount = roundNumber(dataCharges.amount * 100)
            const response = await pinPaymentAxios.post(
                `/1/charges`,
                dataCharges
            )
            const result= response?.data?.response
            return result || null
        }catch (e){
            this.logger.error(e)    
            return null
        }
    }
}

