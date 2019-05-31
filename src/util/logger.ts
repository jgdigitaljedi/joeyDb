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

// const dailyRotateFileTransport = new transports.DailyRotateFile({
//   filename: `${logDir}/%DATE%-results.log`,
//   datePattern: 'YYYY-MM-DD'
// });


export default createLogger({
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
    new transports.File({ filename })
  ]
});