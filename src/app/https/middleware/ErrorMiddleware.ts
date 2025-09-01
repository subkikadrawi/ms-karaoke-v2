/* eslint-disable @typescript-eslint/no-unused-vars */
import {Response, NextFunction} from 'express';
import {BaseResource} from '../resources/BaseResource';
import {IMainRequest} from '../requests/MainRequest';
import {logger} from '../../configs/LoggerConfig';

interface IError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: IError,
  req: IMainRequest,
  res: Response,
  _next: NextFunction,
): void => {
  const message = err.message || 'Internal Server Error';
  const statusCode = err?.statusCode || 500;

  logger.error(`[Global-Error] - ${statusCode}`, message);

  return BaseResource.exec(res, {
    requestId: req.requestId,
    isSuccess: false,
    message: message,
    status: statusCode,
  });
};

export default errorHandler;
