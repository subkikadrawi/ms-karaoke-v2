import {Response, NextFunction} from 'express';
import {BaseResource} from '../resources/BaseResource';
import {logger} from '../../configs/LoggerConfig';
import {
  decodeToken,
  generateAccessToken,
  verifyRefreshToken,
} from '../../configs/JwtConfig';
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

  const verify = verifyRefreshToken(token);

  if (!verify.valid) {
    logger.error(`Unauthorized: ${verify.message}`);
    return BaseResource.exec(res, {
      message: `Unauthorized: ${verify.message}`,
      isSuccess: false,
      requestId: req.requestId,
      status: 401,
    });
  }

  const decode = decodeToken(token);

  if (!decode.valid) {
    logger.error(`Unauthorized: ${verify.message}`);
    return BaseResource.exec(res, {
      message: `Unauthorized: ${verify.message}`,
      isSuccess: false,
      requestId: req.requestId,
      status: 401,
    });
  }

  const newAccessToken = generateAccessToken({
    sub: decode.payload.sub,
    username: decode.payload.username,
  });

  req.token = newAccessToken;
  req.refreshToken = token;

  return next();
}
