import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const isDevEnv = Number(process.env.IS_DEV_ENV) | 0
  if (isDevEnv) {
    const config = new DocumentBuilder()
      .setTitle('Image API')
      .setDescription('API description')
      .setVersion('1.0')
      .addCookieAuth('access_token', {
        type: 'apiKey',
        in: 'cookie',
        name: 'access_token',}
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document,{
      swaggerOptions: {
        withCredentials: true,
      },
    });
  }

  // Habilitar CORS para permitir solicitações de um domínio específico
  app.enableCors({
    origin: 'http://localhost:5173', // Domínio que pode fazer requisições
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
    credentials: true, // Permite enviar cookies ou cabeçalhos de autenticação
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.use(cookieParser());
  
  await app.listen(process.env.PORT ?? 3000); // Escuta na porta configurada ou 3000 por padrão
}

void bootstrap();
