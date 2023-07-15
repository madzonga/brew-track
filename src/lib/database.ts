import { Config } from '../config';
import { Logger } from '../types/types';
import mysql, { Pool } from 'mysql';

export class Database {
    public pool: Pool;

    constructor(private logger: Logger, private config: Config) {
        this.pool = mysql.createPool({
            host: config.DB_HOST,
            user: config.DB_USER,
            password: config.DB_PASS,
            database: config.DB_NAME,
            port: Number(config.DB_PORT)
        });

        this.pool.getConnection((err, connection) => {
            if (err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    logger.error('Database connection lost');
                }

                if (err.code === 'ER_CON_COUNT_ERROR') {
                    logger.error('Database has too many connections');
                }

                if (err.code === 'ECONNREFUSED') {
                    logger.error('Database connection was refused');
                }

                if (err.code === 'ETIMEDOUT') {
                    logger.error('Database connection timed out');
                }
                throw err;
            }
            if (connection) {
                connection.release();
            }
            return;
        });

        this.pool.on('release', (connection) => {
            logger.debug('Connection %d released', connection.threadId);
        });
    }
}
