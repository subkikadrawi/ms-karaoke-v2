import jwt from 'jsonwebtoken';
import {config} from './AppConfig';
import {logger} from './LoggerConfig';

export interface IJwtGenerateToken {
  sub: string;
  login: string;
}

function getJwtErrorType(error: unknown): string {
  if (error instanceof jwt.TokenExpiredError) {
    return 'TokenExpiredError';
  }
  if (error instanceof jwt.JsonWebTokenError) {
    return 'JsonWebTokenError';
  }
  if (error instanceof jwt.NotBeforeError) {
    return 'NotBeforeError';
  }
  return 'UnknownError';
}

const generateAccessToken = (payload: IJwtGenerateToken) => {
  logger.info('Generating access token', config.APP_ACCESS_TOKEN_SECRET);
  return jwt.sign(payload, config.APP_ACCESS_TOKEN_SECRET);
};

const verifyAccessToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, config.APP_ACCESS_TOKEN_SECRET);
    return {valid: true, payload: decoded};
  } catch (error) {
    return {
      valid: false,
      errorType: getJwtErrorType(error),
      message: `failed to verify access token - ${(error as Error).message}`,
    };
  }
};

const decodeToken = (
  token: string,
): {
  valid: boolean;
  payload: IJwtGenerateToken;
  message: string;
} => {
  try {
    const decoded: any = jwt.decode(token);
    return {
      valid: true,
      payload: {
        sub: decoded.sub,
        login: decoded.login,
      },
      message: 'decode token success!',
    };
  } catch (error) {
    return {
      valid: false,
      payload: {
        sub: '',
        login: '',
      },
      message: `failed to decode token - ${(error as Error).message}`,
    };
  }
};

export {generateAccessToken, verifyAccessToken, decodeToken};
