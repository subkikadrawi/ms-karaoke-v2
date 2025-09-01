// middlewares/requestId.ts
import {Response, NextFunction} from 'express';
import {v4 as uid} from 'uuid';
import {IMainRequest} from '../requests/MainRequest';

const mainMiddleware = (
  req: IMainRequest,
  res: Response,
  next: NextFunction,
) => {
  const id = uid();
  req.requestId = id;

  req.logTemplate = `[${id}] - [${req.path}]`;

  res.setHeader('X-Pjd-Request-ID', id);

  next();
};

export default mainMiddleware;
