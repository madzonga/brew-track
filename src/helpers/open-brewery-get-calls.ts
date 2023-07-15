// import { Subsidiaries } from './microservice-get-calls';
import axios from 'axios';
import { Config } from '../config';
import { Request } from 'express';
import { Logger } from '../types/types';

export const getAllBreweries = async (params: {
    config: Config;
    logger: Logger;
    req: Request;
  }) => {
    const { config, logger, req } = params;
  
    logger.info(
      JSON.stringify({
        requestId: req.query.reqId,
        info: `Getting a list of all breweries.`,
      })
    );
    console.log(config.OPEN_BREWERY_URL);
    console.log("config.OPEN_BREWERY_URL");
    const result = await axios.get(
      config.OPEN_BREWERY_URL + `/breweries`,
      {
        timeout: config.REQUEST_TIMEOUT as number
      }
    );
  
    return result.data;
  };
  

  export const getBrewery = async (params: {
    config: Config;
    logger: Logger;
    req: Request;
    brewery_id: string;
  }) => {
    const { config, logger, req, brewery_id } = params;
  
    logger.info(
      JSON.stringify({
        requestId: req.query.reqId,
        info: `Getting a brewery of id = ${brewery_id}.`,
      })
    );
  
    const result = await axios.get(
      config.OPEN_BREWERY_URL + `/breweries/${brewery_id}`,
      {
        timeout: config.REQUEST_TIMEOUT as number
      }
    );
  
    return result.data;
  };