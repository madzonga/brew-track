import * as swaggerUi from 'swagger-ui-express';
import { Config } from '../config';
import express from 'express';
import swaggerJsdoc, { Options } from 'swagger-jsdoc';
export const swaggerRoute = express.Router();
const config = new Config();

const swaggerOptions: Options = {
    swaggerDefinition: {
        info: {
            title: 'brew-track-api',
            version: process.env.npm_package_version || '0.0.1',
            contact: {
                name: 'Glenn Madzonga'
            },
            servers: [`http://localhost:${config.PORT}`]
        }
    },
    apis: ['src/routes/**/*.ts']
};

export const swaggerDoc = swaggerJsdoc(swaggerOptions);

swaggerRoute.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
