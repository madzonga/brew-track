import { Express, Request, Response } from 'express';
import { Config } from '../config';
import { getAllBreweries, getBrewery, getBreweryWeather } from '../helpers/open-brewery-get-calls';
import { Pool } from 'mysql';
import { Database } from '../lib/database';
import { getAllBreweriesFromDb } from '../handlers';

class Routes {
  pool: Pool;

    constructor(private config: Config) {
      this.pool = new Database(config).pool;
    }

    public routes(app: Express): void {
        /**
         * Endpoint to get all breweries.
         * @swagger
         * /get-all-breweries:
         *   post:
         *     summary: Get all breweries.
         *     description: Retrieves information about all breweries.
         *     requestBody:
         *       description: Request body.
         *       required: true
         *     responses:
         *       200:
         *         description: Successful response.
         *       400:
         *         description: Bad request.
         *       500:
         *         description: Internal server error.
         */
        app.get('/get-all-breweries', async (req: Request, res: Response) => {
            try {
                let allBreweries = await getAllBreweries({config: this.config, pool: this.pool, req, res });
                return res.status(200).json(allBreweries);
            } catch (error: any) {
              console.log(error);
              let allBreweriesFromDb = await getAllBreweriesFromDb({req, id: '1', pool: this.pool})
              console.log(allBreweriesFromDb)
              return res.status(200).json(JSON.parse(allBreweriesFromDb as string));
            }
        
        });

        /**
         * Endpoint to get all breweries.
         * @swagger
         * /get-brewery:
         *   post:
         *     summary: Get all breweries.
         *     description: Retrieves information about all breweries.
         *     requestBody:
         *       description: Request body.
         *       required: true
         *     responses:
         *       200:
         *         description: Successful response.
         *       400:
         *         description: Bad request.
         *       500:
         *         description: Internal server error.
         */
        app.get('/get-brewery/:brewery_id', async (req: Request, res: Response) => {
            try {
              const breweryId = req.params.brewery_id;
              let result = await getBrewery({ config: this.config, req, res, breweryId });
              return res.status(200).json(result);
            } catch (error: any) {
              return res.status(400).json({
                error: true,
                message: `Error getting brewery of id ${req.params.brewery_id}`,
                data: res
              });
            }
        }); 
        
        app.get('/get-brewery-weather/:lat/:lng', async (req: Request, res: Response) => {
            try {
                const lat = req.params.lat;
                const lng = req.params.lng;

                let result = await getBreweryWeather({ config: this.config, req, res, lat, lng });
              return res.status(200).json(result);
            } catch (error: any) {
              return res.status(400).json({
                error: true,
                message: `Error getting brewery of id ${req.params.brewery_id}`,
                data: res
              });
            }
        });  
    }
}
export { Routes };
