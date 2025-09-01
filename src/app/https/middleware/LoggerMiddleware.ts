import {Response, NextFunction} from 'express';
import {
  ELogStage,
  logger,
  init as loggerInit,
} from '../../configs/LoggerConfig';
import {IMainRequest} from '../requests/MainRequest';

const loggerMiddleware = (
  req: IMainRequest,
  res: Response,
  next: NextFunction,
) => {
  const startTime = Date.now();
  loggerInit({loggerPrefix: req.logTemplate});

  logger.info('[times]', ELogStage.start);

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('[times]', ELogStage.end, `${duration}ms`);
    loggerInit({}, true);
    logger.debug(`--- [Request ${req.requestId} End] ---`);
  });

  next();
};

export default loggerMiddleware;
