import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppLoggerService implements LoggerService {
  private logger = new Logger('HTTP');
  private errLogFileName = '';
  private logFileName = '';
  constructor() {
    this.errLogFileName = `errorFile_${Date.now()}.log`;
    this.logFileName = `logFile_${Date.now()}.log`;
  }

  log(message: string) {
    this.logger.log(message);
    this.saveLogToFile(`LOG: ${message}`);
  }

  warn(message: string) {
    this.logger.warn(message);
    this.saveLogToFile(`WARN: ${message}`);
  }

  error(message: string) {
    this.logger.error(message);
    this.saveLogToFile(`ERR: ${message}`, true);
  }

  private async saveLogToFile(data: string, isSeparateErrorFile = false) {
    const formattedEntry = `${Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date())}\t${data}\n`;

    try {
      if (!this.exists(path.join(__dirname, '..', '..', 'logs'))) {
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

  private async saveLogToFileSync(data: string, isSeparateErrorFile = false) {
    const formattedEntry = `${Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date())}\t${data}\n`;

    try {
      if (!this.exists(path.join(__dirname, '..', '..', 'logs'))) {
        fs.mkdirSync(path.join(__dirname, '..', '..', 'logs'));
      }
      let logFilePath = this.getFilePath(this.logFileName);
      if (!this.exists(logFilePath)) {
        const stats = fs.statSync(logFilePath);
        if (stats.size > this.getMaxFileSize()) {
          this.logFileName = `logFile_${Date.now()}.log`;
          logFilePath = this.getFilePath(this.logFileName);
        }
      }
      fs.appendFileSync(logFilePath, formattedEntry);

      if (isSeparateErrorFile) {
        let errLogFilePath = this.getFilePath(this.errLogFileName);
        if (!this.exists(errLogFilePath)) {
          const stats = fs.statSync(errLogFilePath);
          if (stats.size > this.getMaxFileSize()) {
            this.errLogFileName = `errorFile_${Date.now()}.log`;
            errLogFilePath = this.getFilePath(this.errLogFileName);
          }
        }
        fs.appendFileSync(errLogFilePath, formattedEntry);
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

  public logUncaughtException(message: string) {
    this.logger.error(message);
    this.saveLogToFileSync(`ERR: ${message}`, true);
  }

  public logUnhandledRejection(message: string) {
    this.logger.error(message);
    this.saveLogToFile(`ERR: ${message}`, true);
  }
}
