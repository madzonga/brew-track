import { MysqlError, Pool } from 'mysql';
import { Request } from 'express';

export const getAllBreweriesFromDb = (params: {
    req: Request;
    id: string;
    pool: Pool;
  }): Promise<String | MysqlError> => {
    const { req, id, pool } = params;
    console.info(JSON.stringify({ requestId: req.query.reqId, action: `Lookup all-breweries entry from the db: ${id}` }));

    const sqlLookupQuery = `SELECT 
    id, all_breweries, created_at FROM brewery_persistence 
        WHERE id = ?`;

    console.info(JSON.stringify({ requestId: req.query.reqId, query: sqlLookupQuery, params: [id] }));

    return new Promise((resolve, reject) => {
        pool.query(sqlLookupQuery, [id], (error, result) => {
            if (error) return reject(error);
            const record = result[0]['all_breweries'];
            resolve(record);
        });
    });
};