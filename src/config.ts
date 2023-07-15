import dotenv from 'dotenv';
import path from 'path';

/**
 * Load variables from
 * first: environment
 * then: .env
 */

dotenv.config({ path: path.resolve(process.cwd(), 'local.env') });

export class Config {
    public LOG_LEVEL = process.env.LOG_LEVEL || 'info';
    public SERVICE_NAME = process.env.SERVICE_NAME || 'brew-track'; // Identifies the service when logging
    public PORT = process.env.PORT || 8443; // Express server port
    public ENV = process.env.NODE_ENV || 'development'; //Environment type. Typically 'development', 'testing', 'production'
    public DB_HOST = process.env.DB_HOST || 'localhost';
    public DB_NAME = process.env.DB_NAME || 'brew-track-db';
    public DB_USER = process.env.DB_USER || 'brew-track-user';
    public DB_PASS = process.env.DB_PASS || 'brew-track-passwd';
    public DB_PORT = process.env.DB_PORT || 3306;
    public DB_CONNECTIONS = process.env.DB_CONNECTIONS || 1; //number of connections allowed in pool
    public REQUEST_TIMEOUT = process.env.REQUEST_TIMEOUT || 60000; // milliseconds
    public OPEN_BREWERY_URL = process.env.OPEN_BREWERY_URL || 'https://api.openbrewerydb.org/v1';
    public STORMGLASS_API_KEY = process.env.STORMGLASS_API_KEY;

    constructor() {
        // Ensure all required environment variables have been provided.
        this.validate();
    }

    private validate() {
        //List of missing env variables at runtime
        const missingEnvVars: string[] = [];

        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                if (this[key] === undefined) {
                    missingEnvVars.push(key);
                }
            }
        }

        // If there are any missing environment variables, exit the program
        if (missingEnvVars.length) {
            console.log(`Environment variables missing but required: ${missingEnvVars.join(',')}`);
            process.exit(0);
        }
    }
}
