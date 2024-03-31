import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppLoggerService } from 'src/app-logger/app-logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly appLoggerService: AppLoggerService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const { method, query, originalUrl, body } = req;

    res.on('finish', () => {
      const { statusCode } = res;

      const logMsg = `{${originalUrl} ${method} ${statusCode}} ${JSON.stringify(
        body,
      )} ${JSON.stringify(query)}`;

      switch (statusCode) {
        case 200:
        case 201:
        case 204:
          this.appLoggerService.log(logMsg);
          break;
        case 400:
        case 401:
        case 403:
        case 404:
        case 422:
          this.appLoggerService.warn(logMsg);
          break;
        default:
          this.appLoggerService.error(logMsg);
      }
    });
    next();
  }
}
