import {Response, NextFunction} from 'express';
import {BaseResource} from '../resources/BaseResource';
import {logger} from '../../configs/LoggerConfig';
import {IMainRequest} from '../requests/MainRequest';
import {
  EHttpResponseStatus,
  EHttpResponseStatusDesc,
} from '../../enums/HttpResponseEnum';

export function validatorParamYear(
  req: IMainRequest,
  res: Response,
  next: NextFunction,
): void {
  const executeYear = req.params.year || undefined;

  if (!executeYear) {
    logger.error(
      `${EHttpResponseStatusDesc.BadRequest}: execute year not found!`,
    );
    return BaseResource.exec(res, {
      message: `${EHttpResponseStatusDesc.BadRequest}: execute year not found!`,
      isSuccess: false,
      requestId: req.requestId,
      status: EHttpResponseStatus.BadRequest,
    });
  }

  const year = parseInt(executeYear, 10);

  if (isNaN(year)) {
    logger.error(`${EHttpResponseStatusDesc.BadRequest}: Invalid year format!`);
    return BaseResource.exec(res, {
      message: `${EHttpResponseStatusDesc.BadRequest}: Invalid year format!`,
      isSuccess: false,
      requestId: req.requestId,
      status: EHttpResponseStatus.BadRequest,
    });
  }

  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) {
    logger.error(
      `${EHttpResponseStatusDesc.BadRequest}: Year out of valid range!`,
    );
    return BaseResource.exec(res, {
      message: `${EHttpResponseStatusDesc.BadRequest}: Year out of valid range!`,
      isSuccess: false,
      requestId: req.requestId,
      status: EHttpResponseStatus.BadRequest,
    });
  }

  return next();
}
