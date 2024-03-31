import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { promises as fsPromises } from 'fs';
import * as fs from 'fs';
import * as path from 'path';

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
          this.saveLogToFile(`LOG: ${logMsg}`);
          break;
        case 400:
        case 401:
        case 403:
        case 404:
        case 422:
          this.logger.warn(logMsg);
          this.saveLogToFile(`WARN: ${logMsg}`);
          break;
        default:
          this.logger.error(logMsg);
          this.saveLogToFile(`ERR: ${logMsg}`, true);
      }
    });
    next();
  }

  private async saveLogToFile(data: string, isSeparateErrorFile = false) {
    const formattedEntry = `${Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date())}\t${data}\n`;

    try {
      if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
        await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'));
      }
      let logFilePath = this.getFilePath(this.logFileName);
      if (await this.exists(logFilePath)) {
        const stats = await fsPromises.stat(logFilePath);
        if (stats.size > this.getMaxFileSize()) {
          this.logFileName = `logFile_${Date.now()}.log`;
          logFilePath = this.getFilePath(this.logFileName);
        }
      }
      await fsPromises.appendFile(logFilePath, formattedEntry);

      if (isSeparateErrorFile) {
        let errLogFilePath = this.getFilePath(this.errLogFileName);
        if (await this.exists(errLogFilePath)) {
          const stats = await fsPromises.stat(errLogFilePath);
          if (stats.size > this.getMaxFileSize()) {
            this.errLogFileName = `errorFile_${Date.now()}.log`;
            errLogFilePath = this.getFilePath(this.errLogFileName);
          }
        }
        await fsPromises.appendFile(errLogFilePath, formattedEntry);
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    }
  }

  private getMaxFileSize(): number {
    return (parseInt(process.env.LOGGER_FILE_SIZE_KB, 10) || 10) * 1000;
  }

  private getFilePath(fileName: string): string {
    return path.join(__dirname, '..', '..', 'logs', fileName);
  }

  private async exists(path: string): Promise<boolean> {
    try {
      await fsPromises.access(path);
      return true;
    } catch {
      return false;
    }
  }
}
