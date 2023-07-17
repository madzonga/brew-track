import { Joi } from "express-validation";

export const getBrewerySchema = Joi.object({
    config: Joi.object().required(),
    req: Joi.object().required(),
    res: Joi.object().required(),
    breweryId: Joi.string().required(),
});

export const getBreweryWeatherSchema = Joi.object({
    config: Joi.object().required(),
    req: Joi.object().required(),
    res: Joi.object().required(),
    lat: Joi.string().required(),
    lng: Joi.string().required(),
});
