import { Config } from './config';
import { swaggerRoute } from './lib/swagger';
import express, { Express } from 'express';

import { Logger } from './lib/logger';
import { Routes } from './routes';
import helmet from 'helmet';

import http from 'http';

/**
 *  Load configuration
 */
const config = new Config();

/**
 * Set up logging - Winston based
 * See https://github.com/winstonjs/winston for more information
 */
const logging = new Logger(config.SERVICE_NAME, config.LOG_LEVEL, config.ENV);
const logger = logging.logger;
const loggerMiddleware = logging.loggerMiddleware;

/**
 *  Create express app instance
 */
export const app: Express = express(); //We export 'app' for the Jest framework to be able to import it

/**
 * Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(loggerMiddleware);
// Load the swagger docs to https://[host]/api-doc
app.use('/api-doc', swaggerRoute); //DO NOT CHANGE THIS ROUTE

/**
 * Load routes from 'routes/index.ts' and provide logger
 */
const routePrv = new Routes(logger, config);
routePrv.routes(app);

if (config.ENV !== 'test') {
    http.createServer(app).listen(config.PORT, () => {
        logger.info(`Server listening on http://localhost:${config.PORT}`);
    });
}
/**
 * Cleanup and exit
 */
process.on('SIGINT', () => {
    logger.info('Shutting down');
    process.exit();
});
