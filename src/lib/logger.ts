import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import winston, { createLogger, format, transports } from 'winston';

export class Logger {
    serviceName: string;
    level: string; //Log level, e.g. info, debug, warning
    environment: string; // production, development, testing, etc.
    logger: winston.Logger;

    constructor(serviceName: string, level?: string, environment?: string) {
        this.serviceName = serviceName;
        this.level = level || 'info';
        this.environment = environment || 'development';

        this.logger = createLogger({
            level: this.level,
            format: format.combine(
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                format.errors({ stack: true }),
                format.json()
            ),
            defaultMeta: { service: this.serviceName }
        });

        //Log to command line:
        this.logger.add(
            new transports.Console({
                format: format.combine(format.colorize(), format.simple())
            })
        );
    }

    loggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
        req.query.reqId = uuidv4(); // add request ID for logging
        this.logger.info(`${req.method} ${req.path} requestId: ${req.query.reqId}`);
        next();
    };
}
