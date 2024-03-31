import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as YAML from 'yaml';
import { AllExceptionFilter } from './filter/all-exception.filter';
import { loggerLevel } from './utils/constants';
import { AppLoggerService } from './app-logger/app-logger.service';
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
  const logger = app.get(AppLoggerService);
  app.useGlobalFilters(new AllExceptionFilter());

  process.on('uncaughtException', () => {
    logger.logUncaughtException('Uncaught Exception thrown');
    process.exit(1);
  });

  process.on('unhandledRejection', () => {
    logger.logUnhandledRejection('Unhandled Rejection at Promise');
  });
  await app.listen(parseInt(process.env.PORT, 10) || 4000);
}
bootstrap();
