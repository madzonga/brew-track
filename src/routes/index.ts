import { Express, Request, Response } from 'express';
import { Logger } from '../types/types';
import { Config } from '../config';
import { getAllBreweries } from '../helpers/open-brewery-get-calls';

class Routes {

    constructor(private logger: Logger, private config: Config) {
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
                let result = await getAllBreweries({config: this.config, logger: this.logger, req });
                return res.status(200).json(result);
            } catch (error: any) {
                return res.status(400).json({
                    error: true,
                    message: 'Custom error message goes here',
                    data: res
                });
            }
        
        });
    }
}
export { Routes };
