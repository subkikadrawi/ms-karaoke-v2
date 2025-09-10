import {Response, NextFunction} from 'express';
import {BaseResource} from '../resources/BaseResource';
import {logger} from '../../configs/LoggerConfig';
import {decodeToken, generateAccessToken} from '../../configs/JwtConfig';
import {IMainRequest} from '../requests/MainRequest';

export function refreshTokenMiddleware(
  req: IMainRequest,
  res: Response,
  next: NextFunction,
): void {
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

  const decode = decodeToken(token);

  if (!decode.valid) {
    logger.error(`Unauthorized: ${decode.message}`);
    return BaseResource.exec(res, {
      message: `Unauthorized: ${decode.message}`,
      isSuccess: false,
      requestId: req.requestId,
      status: 401,
    });
  }

  const newAccessToken = generateAccessToken({
    sub: decode.payload.sub,
    login: decode.payload.login,
  });

  req.token = newAccessToken;
  req.refreshToken = token;

  return next();
}
