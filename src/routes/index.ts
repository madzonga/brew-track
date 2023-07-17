import { Express, Request, Response } from 'express';
import { Config } from '../config';
import { getAllBreweries, getBrewery, getBreweryWeather } from '../helpers/open-brewery-get-calls';

class Routes {

    constructor(private config: Config) {
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
                let result = await getAllBreweries({config: this.config, req, res });
                return res.status(200).json(result);
            } catch (error: any) {
                return res.status(400).json({
                    error: true,
                    message: 'Custom error message goes here',
                    data: res
                });
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
