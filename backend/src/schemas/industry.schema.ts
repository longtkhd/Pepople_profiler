import { prop } from '@typegoose/typegoose'
import { BaseModel } from './base.model'


export class Industry extends BaseModel {
    @prop({})
    name: string
}