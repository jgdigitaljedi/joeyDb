// import * as winston from 'winston';
import { Logger, LoggerOptions, loggers, transports, createLogger, format } from 'winston';
import fs from 'fs';
import path from 'path';

const level = process.env.NODE_ENV !== 'production' ? 'debug' : 'info';
const logDir = 'logs';
const filename = path.join(logDir, 'results.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export class ApiLogger {
  logger: Logger;
  constructor() {
    this.logger = createLogger({
      level,
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
      transports: [
        new transports.Console({
          level: 'info',
          format: format.combine(
            format.colorize(),
            format.printf(
              info => `${info.timestamp} ${info.level}: ${info.message}`
            )
          )
        }),
        new transports.Console({
          level: 'error',
          format: format.combine(
            format.colorize(),
            format.printf(
              info => `${info.timestamp} ${info.level}: ${info.message}`
            )
          )
        }),
        new transports.Console({
          level: 'warning',
          format: format.combine(
            format.colorize(),
            format.printf(
              info => `${info.timestamp} ${info.label} ${info.level}: ${info.message}`
            )
          )
        }),
        new transports.File({ filename })
      ]
    });
  }
  write(text: string, level?: string): void {
    const eLevel = level || 'info';
    this.logger[eLevel](text);
  }
  getLogger(): Logger {
    return this.logger;
  }
}