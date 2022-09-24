import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  })
  app.useGlobalPipes(new ValidationPipe())

  const config = new DocumentBuilder()
    .setTitle('Global Market API')
    .setDescription('The global market API description')
    .setVersion('0.1.1')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api', app, document)

  await app.listen(4000)
}
bootstrap()
