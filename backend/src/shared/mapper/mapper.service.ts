import { Injectable } from '@nestjs/common'
import 'automapper-ts/dist/automapper'

@Injectable()
export class MapperService {
    private mapper: AutoMapperJs.AutoMapper;

    constructor() {
        this.mapper = automapper
        this.initializeMapper()
    }

    private initializeMapper(): void {
        this.mapper.initialize(MapperService.configure)
    }

    public createMap(
        from: string | (new () => any),
        to: string | (new () => any),
    ): AutoMapperJs.ICreateMapFluentFunctions {
        return this.mapper.createMap(from, to)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private static configure(_config: AutoMapperJs.IConfiguration): void { }

    map<K>(
        object: any | any[],
        to: string | (new () => any),
        from: string | (new () => any),
        isArray = false,
    ): K {
        try {
            const _sourceKey = isArray
                ? `${from || object.constructor.name}[]`
                : from || object.constructor.name

            const _destinationKey = isArray ? `${to}[]` : to

            // Convert Mongoose objects to JSON before mapping
            const _object = object && typeof object.toJSON === 'function' ? object.toJSON() : object

            return this.mapper.map(_sourceKey, _destinationKey, _object)
        } catch (error) {
            throw error
        }

    }
}
