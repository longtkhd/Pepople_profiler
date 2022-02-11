import { modelOptions, pre, Severity, prop } from '@typegoose/typegoose'
import { Aggregate } from 'mongoose'
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose'
import { Typegoose } from 'typegoose'

/**
 * MongoDb based Model and Schema
 */

export type PaginateMethod<T> = (
    query?: FilterQuery<T>,
    options?: PaginateOptions,
    callback?: (err: any, result: PaginateResult<T>) => void,
) => Promise<PaginateResult<T>>;


export type AggregatePaginateMethod<T> = (
    query?: Aggregate<any>,
    options?: PaginateOptions,
    callback?: (err: any, result: PaginateResult<T>) => void,
) => Promise<PaginateResult<T>>;


@pre<BaseModel>('save', function (next) {
    this.updated_at = new Date(Date.now())
    next()
})

@modelOptions({
    options: { allowMixed: Severity.ALLOW },
    schemaOptions: {
        timestamps: false,
        toJSON: {
            virtuals: true,
            getters: true,
        },
    },
})

export class BaseModel extends Typegoose {
    id?: string;
    @prop({ default: Date.now() })
    created_at?: Date;

    @prop({ default: Date.now() })
    updated_at?: Date;
}

