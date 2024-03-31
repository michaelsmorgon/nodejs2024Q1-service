import { NestFactory, Reflector } from '@nestjs/core';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from './app.module';
import * as swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as YAML from 'yaml';
import { loggerLevel } from './utils/constants';
const file = fs.readFileSync('./doc/api.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    logger: [loggerLevel[process.env.LOGGER_LEVEL]],
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.useLogger(new Logger());
  await app.listen(parseInt(process.env.PORT, 10) || 4000);
}
bootstrap();
