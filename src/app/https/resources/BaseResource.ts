import {Response} from 'express';
import moment from 'moment';
import {IBaseResourceModel} from '../../models/resource_models/IBaseResourceModel';
import {ELogStage, logger} from '../../configs/LoggerConfig';

class BaseResource {
  static exec(res: Response, data: IBaseResourceModel): any {
    logger.info(ELogStage.end);
    return res.status(data.status).json({
      data: data.data,
      isSuccess: data.isSuccess,
      message: data.message,
      status: data.status,
      requestId: data.requestId,
      timestamp: moment().utc().format('YYYY-MM-DDTHH:mm:ssZZ'),
    });
  }
}

export {BaseResource};
