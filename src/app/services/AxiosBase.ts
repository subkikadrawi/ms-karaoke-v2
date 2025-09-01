import axios from 'axios';
import {logger} from '../configs/LoggerConfig';

const CreateAxiosApiClient = (axiosCreate: any) => {
  const apiClient = axios.create(axiosCreate);

  apiClient.interceptors.request.use(
    config => {
      logger.info('[Axios Request] - Request started', config);
      return config;
    },
    (error: any) => {
      logger.error('[Axios Request Error]', error.message);
      return Promise.reject(error);
    },
  );

  // Post-handler (Response Interceptor)
  apiClient.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      if (error.response) {
        logger.error(
          '[Axios Response Error] - Server error',
          error.response.status,
          error.response.data,
        );
      } else if (error.request) {
        logger.error(
          '[Axios Response Error] - No response received',
          error.request,
        );
      } else {
        logger.error(
          '[Axios Response Error] - Error in setting up the request',
          error.message,
        );
      }

      return Promise.reject({
        status: error.response?.status || 500,
        message: error.message || 'An error occurred',
      });
    },
  );

  return apiClient;
};

export default CreateAxiosApiClient;
