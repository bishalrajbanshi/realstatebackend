import winston from "winston";
import { transports } from "winston";
import DailyRotateFile from 'winston-daily-rotate-file';

/* LOGGER SETUP */
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()} ${message}`;
        })
    ),
    transports: [
        // Rotate HTTP request logs daily
        new DailyRotateFile({
            filename: 'logs/http_requests-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'info',
            maxFiles: '30d', 
        }),

        // Rotate database logs daily
        new DailyRotateFile({
            filename: 'logs/database-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'info',
            maxFiles: '30d',  
        }),

        // Rotate error logs daily
        new DailyRotateFile({
            filename: 'logs/errors-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',  
            maxFiles: '30d', 
        }),

        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

export { logger };
