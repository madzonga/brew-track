import { AxiosError } from "axios";

export const handleAxiosError = (error: AxiosError) => {
    if (error.response) {
      throw new Error(`Request failed with status code ${error.response.status}`);
    } else if (error.request) {
      throw new Error('Request failed. No response received.');
    } else {
      throw new Error(`An error occurred during the request: ${error.message}`);
    }
};
  