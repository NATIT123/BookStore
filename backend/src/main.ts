import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  //Reflector using for metadata assign for route
  const reflector = app.get(Reflector);
  //Global Guard handle JWT
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  //Global Interceptor handle error message
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  //Using pipe validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Loại bỏ các thuộc tính không được định nghĩa trong DTO.
      // forbidNonWhitelisted:true //ném ra ngoại lệ nếu phát hiện bất kỳ thuộc tính nào không được định nghĩa trong DTO.
    }),
  );

  ///Cookie
  app.use(cookieParser());

  ///CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  //config versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2'],
  });

  ///Helmet
  app.use(helmet());

  //Config Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS Series APIs Document')
    .setDescription('All Modules APIs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
    .addSecurityRequirements('token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(configService.get<string>('PORT') || 8080);
}
bootstrap();
