import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  private errLogFileName = '';
  private logFileName = '';
  constructor() {
    this.errLogFileName = `errorFile_${Date.now()}.log`;
    this.logFileName = `logFile_${Date.now()}.log`;
  }
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
          this.logger.log(logMsg);
          break;
        case 400:
        case 401:
        case 403:
        case 404:
        case 422:
          this.logger.warn(logMsg);
          break;
        default:
          this.logger.error(logMsg);
      }
    });
    next();
  }
}
