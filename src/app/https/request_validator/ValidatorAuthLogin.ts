import {Response, NextFunction} from 'express';
import {BaseResource} from '../resources/BaseResource';
import {ELogStage, logger} from '../../configs/LoggerConfig';
import {IMainRequest} from '../requests/MainRequest';
import {EHttpResponseStatusDesc} from '../../enums/HttpResponseEnum';
import {IAuthLoginRequestBody} from '../requests/IAuthLoginRequest';

const validatorAuthLogin = (
  req: IMainRequest<IAuthLoginRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  const requestBody = req.body;

  logger.info('[validatorAuthLogin]', ELogStage.start);
  logger.info('[validatorAuthLogin]', '[requestBody]', requestBody);

  if (!requestBody) {
    logger.error(`${EHttpResponseStatusDesc.BadRequest}: body not found!`);
    logger.info('[validatorAuthLogin]', ELogStage.end);

    return BaseResource.exec(res, {
      message: `${EHttpResponseStatusDesc.BadRequest}: body not found!`,
      isSuccess: false,
      requestId: req.requestId,
      status: 401,
    });
  }

  if (!requestBody.username) {
    logger.error(`${EHttpResponseStatusDesc.BadRequest}: username not found`);
    logger.info('[validatorAuthLogin]', ELogStage.end);

    return BaseResource.exec(res, {
      message: `${EHttpResponseStatusDesc.BadRequest}: username not found`,
      isSuccess: false,
      requestId: req.requestId,
      status: 401,
    });
  }

  if (!requestBody.password) {
    logger.error(`${EHttpResponseStatusDesc.BadRequest}: password not found`);
    logger.info('[validatorAuthLogin]', ELogStage.end);

    return BaseResource.exec(res, {
      message: `${EHttpResponseStatusDesc.BadRequest}: password not found`,
      isSuccess: false,
      requestId: req.requestId,
      status: 401,
    });
  }

  // if (!requestBody.captchaToken) {
  //   logger.error(
  //     `${EHttpResponseStatusDesc.BadRequest}: .captchaToken not found`,
  //   );
  //   logger.info('[validatorAuthLogin]', ELogStage.end);

  //   return BaseResource.exec(res, {
  //     message: `${EHttpResponseStatusDesc.BadRequest}: .captchaToken not found`,
  //     isSuccess: false,
  //     requestId: req.requestId,
  //     status: 401,
  //   });
  // }

  logger.info('[validatorAuthLogin]', ELogStage.end);

  return next();
};

export default validatorAuthLogin;
