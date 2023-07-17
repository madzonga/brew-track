import axios, { AxiosError } from 'axios';
import { Config } from '../config';
import { Request, Response } from 'express';
import { getAllBreweries, getBrewery, getBreweryWeather } from '../helpers/open-brewery-get-calls';

jest.mock('axios');

describe('getAllBreweries', () => {
  const config: Config = new Config; 
  
    const req: Request = { query: { reqId: 'your_request_id' } } as unknown as Request;
  const res: Response = {
    set: jest.fn(),
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and return a list of breweries successfully', async () => {
    const expectedData = [{ name: 'Brewery 1' }, { name: 'Brewery 2' }];

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: expectedData });

    const result = await getAllBreweries({ config, req, res });

    expect(axios.get).toHaveBeenCalledWith(config.OPEN_BREWERY_URL + '/breweries', {
      timeout: config.REQUEST_TIMEOUT,
    });
    expect(res.set).toHaveBeenCalledWith('Access-Control-Allow-Origin', 'http://localhost:4200');
    expect(result).toEqual(expectedData);
  });

  it('should throw an error when fetching breweries fails', async () => {
    const expectedErrorMessage = 'An error occurred during the request: Failed to fetch breweries';
    const expectedError = new Error(expectedErrorMessage);
  
    (axios.get as jest.Mock).mockRejectedValueOnce(expectedError);
  
    await expect(getAllBreweries({ config, req, res })).rejects.toThrow(expectedErrorMessage);
  
    expect(axios.get).toHaveBeenCalledWith(config.OPEN_BREWERY_URL + '/breweries', {
      timeout: config.REQUEST_TIMEOUT,
    });
    expect(res.set).toHaveBeenCalledWith('Access-Control-Allow-Origin', 'http://localhost:4200');
  });
  
});

describe('getBrewery', () => {
    const config: Config = new Config; 
    const req: Request = {} as Request;
  const res: Response = {
    set: jest.fn(),
  } as unknown as Response;
  const breweryId = 'your_brewery_id'; 

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and return the brewery successfully', async () => {
    const expectedData = { name: 'Brewery 1', id: breweryId }; // Replace with your expected data

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: expectedData });

    const result = await getBrewery({ config, req, res, breweryId });

    expect(axios.get).toHaveBeenCalledWith(config.OPEN_BREWERY_URL + '/breweries/' + breweryId, {
      timeout: config.REQUEST_TIMEOUT,
    });
    expect(result).toEqual(expectedData);
  });

  it('should throw an error when fetching the brewery fails', async () => {
    const expectedErrorMessage = 'An error occurred during the request: Failed to fetch the brewery';
    const expectedError = new Error(expectedErrorMessage);
  
    (axios.get as jest.Mock).mockRejectedValueOnce(expectedError);
  
    await expect(getBrewery({ config, req, res, breweryId })).rejects.toThrow(expectedErrorMessage);
  
    expect(axios.get).toHaveBeenCalledWith(config.OPEN_BREWERY_URL + '/breweries/' + breweryId, {
      timeout: config.REQUEST_TIMEOUT,
    });
  });
  
  
});

describe('getBreweryWeather', () => {
    const config: Config = new Config; 

  const req: Request = {} as Request;
  const res: Response = {
    set: jest.fn(),
  } as unknown as Response;
  const lat = 'your_latitude'; // Replace with the desired latitude
  const lng = 'your_longitude'; // Replace with the desired longitude

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and return the brewery weather successfully', async () => {
    const expectedData = { temperature: 25 }; // Replace with your expected data

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: expectedData });

    const result = await getBreweryWeather({ config, req, res, lat, lng });

    expect(axios.get).toHaveBeenCalledWith(config.STORM_GLASS_URL + '/weather/point', {
      params: {
        lat,
        lng,
        params: 'airTemperature',
      },
      timeout: config.REQUEST_TIMEOUT,
      headers: {
        Authorization: config.STORM_GLASS_API_KEY,
      },
    });
    expect(res.set).toHaveBeenCalledWith('Access-Control-Allow-Origin', 'http://localhost:4200');
    expect(result).toEqual(expectedData);
  });

  it('should throw an error when fetching the brewery weather fails', async () => {
    const expectedErrorMessage = 'An error occurred during the request: Failed to fetch the brewery weather';
    const expectedError = new Error(expectedErrorMessage);
  
    (axios.get as jest.Mock).mockRejectedValueOnce(expectedError);

    await expect(getBreweryWeather({ config, req, res, lat, lng })).rejects.toThrow(expectedError);

    expect(axios.get).toHaveBeenCalledWith(config.STORM_GLASS_URL + '/weather/point', {
      params: {
        lat,
        lng,
        params: 'airTemperature',
      },
      timeout: config.REQUEST_TIMEOUT,
      headers: {
        Authorization: config.STORM_GLASS_API_KEY,
      },
    });
    expect(res.set).toHaveBeenCalledWith('Access-Control-Allow-Origin', 'http://localhost:4200');
  });
});
