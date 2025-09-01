/* eslint-disable @typescript-eslint/no-unused-vars */
import {Response, NextFunction} from 'express';
import {BaseResource} from '../resources/BaseResource';
import {logger} from '../../configs/LoggerConfig';
import {IMainRequest} from '../requests/MainRequest';
import {decryptWithPrivateKey} from '../../utils/HashUtils';
import {whitelistCors} from '../../configs/CorsConfig';
import moment from 'moment';

import {config} from '../../configs/AppConfig';
const STATIC_TOKEN = config.APP_STATIC_TOKEN;

const authStaticMiddleware = (
  req: IMainRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.error('Unauthorized: No token provided');
    return BaseResource.exec(res, {
      message: 'Unauthorized: No token provided',
      isSuccess: false,
      requestId: req.requestId,
      status: 401,
    });
  }

  const token = authHeader.split(' ')[1];

  if (!STATIC_TOKEN) {
    logger.error('Unauthorized: token not set on env.');
    return BaseResource.exec(res, {
      message: 'Unauthorized: token not set on env.',
      isSuccess: false,
      requestId: req.requestId,
      status: 401,
    });
  }

  if (token !== STATIC_TOKEN) {
    logger.error('Unauthorized: invalid token');
    return BaseResource.exec(res, {
      message: 'Unauthorized: invalid token',
      isSuccess: false,
      requestId: req.requestId,
      status: 401,
    });
  }
  return next();
};

export default authStaticMiddleware;
