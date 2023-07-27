import { Config } from './config';
import { swaggerRoute } from './lib/swagger';
import express, { Express } from 'express';

import { Routes } from './routes';
import helmet from 'helmet';
const cors = require('cors');

import http from 'http';

/**
 *  Load configuration
 */
const config = new Config();

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
// Load the swagger docs to https://[host]/api-doc
app.use('/api-doc', swaggerRoute); //DO NOT CHANGE THIS ROUTE

// Use the CORS middleware
app.use(cors());

/**
 * Load routes from 'routes/index.ts' and provide logger
 */
const routePrv = new Routes(config);
routePrv.routes(app);

if (config.ENV !== 'test') {
    http.createServer(app).listen(config.PORT, () => {
        console.info(`Server listening on http://localhost:${config.PORT}`);
    });
}
/**
 * Cleanup and exit
 */
process.on('SIGINT', () => {
    console.info('Shutting down');
    process.exit();
});
