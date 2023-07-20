import { Express, Request, Response } from "express";
import { Config } from "../config";
import {
    getAllBreweries,
    getBrewery,
    getBreweryWeather,
} from "../helpers/open-brewery-get-calls";
import { Pool } from "mysql";
import { Database } from "../lib/database";
import { getAllBreweriesFromDb } from "../handlers";
import { saveUserDataToDatabase } from "../helpers/user-data-post-calls";

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
        app.get("/get-all-breweries", async (req: Request, res: Response) => {
            try {
                // const page = Number(req.query.page) || 1;
                const pageSize = Number(req.query.pageSize) || 10;
                const offset = Number(req.query.offset);
                let allBreweries = await getAllBreweries({
                    config: this.config,
                    pool: this.pool,
                    req,
                    res,
                    offset,
                    limit: pageSize,
                });
                return res.status(200).json(allBreweries);
            } catch (error: any) {
                console.log(error);
                try {
                    let allBreweriesFromDb = await getAllBreweriesFromDb({
                        req,
                        id: "1",
                        pool: this.pool,
                    });
                    return res
                        .status(200)
                        .json(JSON.parse(allBreweriesFromDb as string));
                } catch (error: any) {
                    return res.status(404).json({
                        error: true,
                        message: `${error.message} for the database`,
                        data: null,
                    });
                }
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
        app.get(
            "/get-brewery/:brewery_id",
            async (req: Request, res: Response) => {
                try {
                    const breweryId = req.params.brewery_id;
                    let result = await getBrewery({
                        config: this.config,
                        req,
                        res,
                        breweryId,
                    });
                    return res.status(200).json(result);
                } catch (error: any) {
                    return res.status(500).json({
                        error: true,
                        message: `Error getting brewery of id ${req.params.brewery_id}`,
                        data: res,
                    });
                }
            }
        );

        app.get(
            "/get-brewery-weather/:lat/:lng",
            async (req: Request, res: Response) => {
                try {
                    const lat = req.params.lat;
                    const lng = req.params.lng;
                    let result = await getBreweryWeather({
                        config: this.config,
                        req,
                        res,
                        lat,
                        lng,
                    });
                    return res.status(200).json(result);
                } catch (error: any) {
                    let errorMessage = "";
                    let statusCode = 500;
                    if (error.response && error.response.data) {
                        const responseData = error.response.data;
                        if (responseData.errors && responseData.errors.key) {
                            errorMessage = responseData.errors.key;
                        }
                    }
                    return res.status(statusCode).json({
                        error: true,
                        message: `${errorMessage} for Weather API.`,
                        data: null,
                    });
                }
            }
        );

        /**
         * Endpoint to submit user data.
         * @swagger
         * /submit-user-data:
         *   post:
         *     summary: Submit user data.
         *     description: Submits user data for further processing.
         *     requestBody:
         *       description: Request body containing user data.
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/User' // Replace with the correct schema reference for the User data.
         *     responses:
         *       200:
         *         description: Successful response.
         *       400:
         *         description: Bad request.
         *       500:
         *         description: Internal server error.
         */
        app.post('/submit-user-data', async (req: Request, res: Response) => {
          try {
            res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            const userData = req.body;
            await saveUserDataToDatabase(userData, this.pool);
        
            return res.status(200).json({
              success: true,
              message: 'User data submitted successfully.',
              data: userData,
            });
          } catch (error: any) {
            console.log(error);
            return res.status(500).json({
              success: false,
              message: 'Internal server error.',
              data: null,
            });
          }
        });
        
    }
}
export { Routes };
