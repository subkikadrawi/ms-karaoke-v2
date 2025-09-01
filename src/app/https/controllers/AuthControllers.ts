import {generateAccessToken} from '../../configs/JwtConfig';
import {ELogStage, logger} from '../../configs/LoggerConfig';
import {
  EHttpResponseStatus,
  EHttpResponseStatusDesc,
} from '../../enums/HttpResponseEnum';
import {IBaseResourceModel} from '../../models/resource_models/IBaseResourceModel';
import {UserTblRepository} from '../../repositories/UserRepository';
import {encryptSha256WithPrivateKey} from '../../utils/HashUtils';
import {IAuthLoginRequestBody} from '../requests/IAuthLoginRequest';
import {IMainRequest} from '../requests/MainRequest';
import {BaseResource} from '../resources/BaseResource';
import {Response} from 'express';

const login = async (
  req: IMainRequest<IAuthLoginRequestBody>,
  res: Response,
) => {
  logger.info(ELogStage.start);
  const {username, password} = req.body;

  // Your authentication logic here
  const requestPassEncrypt = encryptSha256WithPrivateKey(password);

  const user = await UserTblRepository.findOne({
    q: {login: username},
  });

  if (!user) {
    logger.error(
      `${EHttpResponseStatusDesc.Unauthorized}: user ${username} not found!`,
    );

    logger.info(ELogStage.end);
    return BaseResource.exec(res, {
      message: `${EHttpResponseStatusDesc.Unauthorized}: user ${username} not found!`,
      isSuccess: false,
      requestId: req.requestId,
      status: EHttpResponseStatus.Unauthorized,
    });
  }

  if (user.password_hash && requestPassEncrypt !== user.password_hash) {
    logger.error(`${EHttpResponseStatusDesc.Unauthorized} wrong password!`);
    logger.info(ELogStage.end);

    return BaseResource.exec(res, {
      message: `${EHttpResponseStatusDesc.Unauthorized} wrong password!`,
      isSuccess: false,
      requestId: req.requestId,
      status: EHttpResponseStatus.Unauthorized,
    });
  }

  // generate access token
  const accessToken = generateAccessToken({
    sub: user.id.toString(),
    login: user.login,
  });

  const fullname = `${user.first_name} ${user.last_name}`;

  const response: IBaseResourceModel = {
    data: {
      user: {
        id: user.id,
        login: user.login,
        fullname: fullname
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        email: user.email,
      },
      token: accessToken,
    },
    isSuccess: true,
    message: '200 OK',
    status: 200,
  };

  logger.info(ELogStage.end);
  return BaseResource.exec(res, response);
};

export {login};
