import 'dotenv/config' 
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useStaticAssets(join(__dirname, '..', '..', 'public'), {
    setHeaders: (res) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    }
  })

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  })

  const config = new DocumentBuilder()
    .setTitle('Movie Explorer API')
    .setDescription('REST API Movie Explorer')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(3000)
}
bootstrap();