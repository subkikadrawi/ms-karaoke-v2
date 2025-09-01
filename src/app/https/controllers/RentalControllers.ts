/* eslint-disable n/no-unsupported-features/node-builtins */
import {ELogStage, logger} from '../../configs/LoggerConfig';
import {
  EHttpResponseStatus,
  EHttpResponseStatusDesc,
} from '../../enums/HttpResponseEnum';
import {IBaseResourceModel} from '../../models/resource_models/IBaseResourceModel';
import {IMainRequest} from '../requests/MainRequest';
import {BaseResource} from '../resources/BaseResource';
import {Response} from 'express';
import {getUserId} from '../middleware/AuthMiddleware';
import {RentalsTblRepository} from '../../repositories/RentalsRepository';
import {IAddRentalRequest} from '../requests/IRentalRequestRequest';
import moment from 'moment';
import {UserTblRepository} from '../../repositories/UserRepository';
import {RentalItemsTblRepository} from '../../repositories/RentalItemsRepository';

const addRental = async (
  req: IMainRequest<IAddRentalRequest>,
  res: Response,
) => {
  logger.info(ELogStage.start);
  const rental_item_id = req.body.rental_item_id ?? '';
  const customer_name = req.body.customer_name ?? '';
  const start_time = req.body.start_time ?? '';
  const end_time = req.body.end_time ?? '';
  const status = req.body.status ?? '';

  // get user id from token
  const user_id = getUserId(req);
  if (user_id === 0) {
    logger.error('user id is 0 - user not found');
    return BaseResource.exec(res, {
      isSuccess: false,
      message: `${EHttpResponseStatusDesc.BadRequest} - user id is 0 - user not found`,
      status: EHttpResponseStatus.BadRequest,
    });
  }

  // get user
  const user = await UserTblRepository.findOne({q: {id: user_id}});
  if (!user) {
    logger.error('user not found');
    return BaseResource.exec(res, {
      isSuccess: false,
      message: `${EHttpResponseStatusDesc.BadRequest} - user not found`,
      status: EHttpResponseStatus.BadRequest,
    });
  }

  // get rental item
  const rentalItem = await RentalItemsTblRepository.findOne({
    q: {id: rental_item_id},
  });
  if (!rentalItem) {
    logger.error('rental item not found');
    return BaseResource.exec(res, {
      isSuccess: false,
      message: `${EHttpResponseStatusDesc.BadRequest} - rental item not found`,
      status: EHttpResponseStatus.BadRequest,
    });
  }

  const countTime = moment(end_time).diff(moment(start_time), 'hours');
  const total_price = countTime * rentalItem.price_per_hour;

  // create new rental
  const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    await RentalsTblRepository.save({
      rental_item_id,
      customer_name,
      start_time,
      end_time,
      status,
      user_id: user.id,
      branch_id: user.branch_id,
      total_price,
      payment_status: 'unpaid',
      has_transaction: false,
      created_at: currentDateTime,
    });
  } catch (error) {
    logger.error('Error saving rental:', error);
    return BaseResource.exec(res, {
      isSuccess: false,
      message: `${EHttpResponseStatusDesc.InternalServerError} - failed to add rental`,
      status: EHttpResponseStatus.InternalServerError,
    });
  }

  const response: IBaseResourceModel = {
    isSuccess: true,
    message: 'success add rental',
    status: 200,
  };

  logger.info(ELogStage.end);
  return BaseResource.exec(res, response);
};

export {addRental};
