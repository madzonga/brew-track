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

        /**
         * Endpoint to get weather data for a brewery.
         * @swagger
         * /get-brewery-weather/{lat}/{lng}:
         *   get:
         *     summary: Get weather data for a brewery.
         *     description: Retrieves weather data for a brewery based on the provided latitude and longitude.
         *     parameters:
         *       - in: path
         *         name: lat
         *         required: true
         *         description: The latitude of the brewery.
         *         schema:
         *           type: number
         *       - in: path
         *         name: lng
         *         required: true
         *         description: The longitude of the brewery.
         *         schema:
         *           type: number
         *     responses:
         *       200:
         *         description: Successful response with weather data.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 temperature:
         *                   type: number
         *                   description: The temperature at the brewery location.
         *                 humidity:
         *                   type: number
         *                   description: The humidity at the brewery location.
         *                 weatherDescription:
         *                   type: string
         *                   description: The description of the weather at the brewery location.
         *       500:
         *         description: Internal server error.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 error:
         *                   type: boolean
         *                   description: Indicates if an error occurred.
         *                   example: true
         *                 message:
         *                   type: string
         *                   description: The error message.
         *                   example: Error fetching weather data for Weather API.
         *                 data:
         *                   type: null
         *                   description: The data associated with the error (set to null in case of errors).
         *                   example: null
         */
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
         *     description: Submits user data to the server for storage.
         *     requestBody:
         *       description: User data to be submitted.
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               firstName:
         *                 type: string
         *                 description: The first name of the user.
         *               lastName:
         *                 type: string
         *                 description: The last name of the user.
         *               email:
         *                 type: string
         *                 format: email
         *                 description: The email address of the user.
         *               age:
         *                 type: number
         *                 description: The age of the user.
         *             required:
         *               - firstName
         *               - lastName
         *               - email
         *               - age
         *     responses:
         *       200:
         *         description: Successful response with submitted user data.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 success:
         *                   type: boolean
         *                   description: Indicates if the user data was submitted successfully.
         *                   example: true
         *                 message:
         *                   type: string
         *                   description: A message indicating the success of the submission.
         *                   example: User data submitted successfully.
         *                 data:
         *                   type: object
         *                   description: The submitted user data.
         *                   properties:
         *                     firstName:
         *                       type: string
         *                       description: The first name of the user.
         *                     lastName:
         *                       type: string
         *                       description: The last name of the user.
         *                     email:
         *                       type: string
         *                       description: The email address of the user.
         *                     age:
         *                       type: number
         *                       description: The age of the user.
         *                   example:
         *                     firstName: John
         *                     lastName: Doe
         *                     email: john.doe@example.com
         *                     age: 30
         *       500:
         *         description: Internal server error.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 success:
         *                   type: boolean
         *                   description: Indicates if an error occurred.
         *                   example: false
         *                 message:
         *                   type: string
         *                   description: The error message.
         *                   example: Internal server error.
         *                 data:
         *                   type: null
         *                   description: The data associated with the error (set to null in case of errors).
         *                   example: null
         */
        app.post("/submit-user-data", async (req: Request, res: Response) => {
            try {
                res.set("Access-Control-Allow-Origin", "http://localhost:4200");
                const userData = req.body;
                await saveUserDataToDatabase(userData, this.pool);

                return res.status(200).json({
                    success: true,
                    message: "User data submitted successfully.",
                    data: userData,
                });
            } catch (error: any) {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error.",
                    data: null,
                });
            }
        });
    }
}
export { Routes };
