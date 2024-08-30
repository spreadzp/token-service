import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ServerConfig } from '@config/server-config/server-config.service';
import NestjsLoggerServiceAdapter from '@common/logger/logger.adapter';
// import * as session from 'express-session';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle(`Token service backend v0.1 API`)
    .setDescription('The Bot API documentation')
    .setVersion(`0.1`)
    .addTag('Backend')
    .addSecurity('bearerAuth', {
      type: 'http',
      scheme: 'Bearer',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    //operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });
  const endpointRelativePath = '/api';

  SwaggerModule.setup(endpointRelativePath, app, document, {
    swaggerOptions: {
      security: [{ bearerAuth: [] }],
    },
  });

  app.use((req, res, next) => {
    if (req.url?.includes('swagger-ui-init.js')) {
      res.set('Last-Modified', new Date().toUTCString());
      res.set('Cache-Control', 'no-cache');
      res.set('Pragma', 'no-cache');
    }
    next();
  });
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(NestjsLoggerServiceAdapter);
  app.useLogger(logger);

  const serverConfig = app.get(ServerConfig);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({ credentials: true });
  setupSwagger(app);
  await app.listen(serverConfig.port, () => {
    logger.log(
      `Service listen on: ${serverConfig.host}:${serverConfig.port}`,
      'main.ts',
    );
  });
}

bootstrap();
