import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const levels = { fatal: 0, error: 1, warn: 2, info: 3, http: 4, debug: 5 };
const colors = { fatal: 'bold red', error: 'red', warn: 'yellow', info: 'green', http: 'cyan', debug: 'blue' };
winston.addColors(colors);

const isProduction = process.env.NODE_ENV === 'production';

const logger = winston.createLogger({
    levels,
    level: isProduction ? 'info' : 'debug',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `${timestamp} [${level}]: ${message}`;
                })
            )
        }),
        new DailyRotateFile({
            filename: 'logs/%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            zippedArchive: true,
            maxSize: '5m',
            maxFiles: '14d',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `${timestamp} [${level}]: ${message}`;
                })
            )
        })
    ]
});

export default logger;