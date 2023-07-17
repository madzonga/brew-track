import { Config } from "../config";
import { getBrewerySchema, getBreweryWeatherSchema } from "./validate";
import axios, { AxiosError } from 'axios';
import { Request, Response } from 'express';
import Joi from 'joi';
import { handleAxiosError } from "./error";

const getAllBreweriesSchema = Joi.object({
  config: Joi.object().required(),
  req: Joi.object().required(),
  res: Joi.object().required(),
});

export const getAllBreweries = async (params: {
  config: Config;
  req: Request;
  res: Response;
}) => {
  const { config, req, res } = params;

  const validationResult = getAllBreweriesSchema.validate(params);
  if (validationResult.error) {
    throw new Error(validationResult.error.details[0].message);
  }

  try {
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    const result = await axios.get(config.OPEN_BREWERY_URL + `/breweries`, {
      timeout: config.REQUEST_TIMEOUT as number,
    });
    return result.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

export const getBrewery = async (params: {
  config: Config;
  req: Request;
  res: Response;
  breweryId: string;
}) => {
  const { config, req, res, breweryId } = params;

  const validationResult = getBrewerySchema.validate(params);
  if (validationResult.error) {
    throw new Error(validationResult.error.details[0].message);
  }

  try {
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    const result = await axios.get(config.OPEN_BREWERY_URL + `/breweries/${breweryId}`, {
      timeout: config.REQUEST_TIMEOUT as number,
    });
    return result.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

export const getBreweryWeather = async (params: {
    config: Config;
    req: Request;
    res: Response;
    lat: string;
    lng: string;
}) => {
    const { config, req, res, lat, lng } = params;
    const validationResult = getBreweryWeatherSchema.validate(params);
    if (validationResult.error) {
        throw new Error(validationResult.error.details[0].message);
    }

    try {
        res.set("Access-Control-Allow-Origin", "http://localhost:4200");
        const result = await axios.get(
            config.STORM_GLASS_URL + `/weather/point`,
            {
                params: {
                    lat: lat,
                    lng: lng,
                    params: "airTemperature",
                },
                timeout: config.REQUEST_TIMEOUT as number,
                headers: {
                    Authorization: config.STORM_GLASS_API_KEY,
                },
            }
        );
        return result.data;
    } catch (error) {
        // Handle the error here
        throw error; // Rethrow the error to be handled by the caller
    }
};
