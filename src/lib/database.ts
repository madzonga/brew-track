import { Config } from '../config';
import mysql, { Pool } from 'mysql';

export class Database {
    public pool: Pool;

    constructor(private config: Config) {
        this.pool = mysql.createPool({
            host: config.DB_HOST,
            user: config.DB_USER,
            password: config.DB_PASS,
            database: config.DB_NAME,
            port: Number(config.DB_PORT)
        });

        this.initializeDatabase();
    }

    private initializeDatabase(): void {
        try {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    this.handleDatabaseConnectionError(err);
                } else {
                    connection.release();
                }
            });

            this.pool.on('release', (connection) => {
                console.debug('Connection %d released', connection.threadId);
            });
        } catch (error) {
            this.handleDatabaseConnectionError(error);
        }
    }

    private handleDatabaseConnectionError(error: any): void {
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection lost');
        } else if (error.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('Database connection was refused');
        } else if (error.code === 'ETIMEDOUT') {
            console.error('Database connection timed out');
        } else {
            console.error('Unexpected error occurred while connecting to the database', error);
        }
    }
}

