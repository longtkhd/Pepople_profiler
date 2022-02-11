import { TokenService } from './token.service'
import { Module } from '@nestjs/common'
import { Token } from '../schemas/token.schema'
import { TypegooseModule } from 'nestjs-typegoose'


@Module({
    imports: [
        TypegooseModule.forFeature([Token]),
    ],

    controllers: [],
    providers: [TokenService],
    exports: [TokenService]
})
export class TokenModule { }
