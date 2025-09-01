import {Response, NextFunction} from 'express';
import {BaseResource} from '../resources/BaseResource';
import {logger} from '../../configs/LoggerConfig';
import {decodeToken, verifyAccessToken} from '../../configs/JwtConfig';
import {IMainRequest} from '../requests/MainRequest';

const authMiddleware = (
  req: IMainRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return BaseResource.exec(res, {
      data: null,
      isSuccess: false,
      message: 'Unauthorized: No token provided',
      status: 401,
    });
  }

  const token = authHeader.split(' ')[1];

  const verify = verifyAccessToken(token);

  if (!verify.valid) {
    logger.error(`Unauthorized: ${verify.message}`);
    return BaseResource.exec(res, {
      message: `Unauthorized: ${verify.message}`,
      isSuccess: false,
      requestId: req.requestId,
      status: 401,
    });
  }

  req.token = token;
  req.userId = Number(verify.payload?.sub || '0');

  return next();
};

const getToken = (req: IMainRequest): string | null => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  return token;
};

const getUserId = (req: IMainRequest): number => {
  // get user id from token
  const token = getToken(req);
  const valueToken = decodeToken(token ?? '');
  const user_id = Number(valueToken.payload.sub);
  return user_id || 0;
};

export {getToken, getUserId, authMiddleware};
