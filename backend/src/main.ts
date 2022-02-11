import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { RedisIoAdapter } from './app.adapter'
import { ValidationPipe } from '@nestjs/common'

import * as helmet from 'helmet'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.enableCors({
        exposedHeaders: ['Content-Disposition']
    })
    app.use(helmet())

    // app.setGlobalPrefix('api/v1')

    const options = new DocumentBuilder()
        .setTitle('People Profile api')
        .addBearerAuth()
        //.setVersion('1.0')
        .build()

    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('swagger', app, document)
    // Validate query params and body
    app.useGlobalPipes(new ValidationPipe({ transform: true }))
    // Convert all JSON object keys to snake_case
    app.useWebSocketAdapter(new RedisIoAdapter(app))
    await app.listen(AppModule.port)
}
bootstrap()
