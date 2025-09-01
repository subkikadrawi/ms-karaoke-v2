import {Request} from 'express';
import moment from 'moment';

interface IMainRequest<T = any> extends Request {
  uuid?: string;
  requestId?: string;
  logTemplate?: string;
  datetime?: moment.Moment;
  token?: string;
  userId?: number;
  refreshToken?: string;
  body: T;
}

export {IMainRequest};
