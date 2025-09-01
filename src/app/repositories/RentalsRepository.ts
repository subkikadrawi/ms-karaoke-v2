/* eslint-disable n/no-unpublished-import */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {ojkUploadDbConnection as db} from '../configs/KnexConfig';
import {IRepository} from './IRepository';
import {
  IRentalsTblQueryParams,
  IRentalsTblQueryOutput,
  IRentalsTblUpdatedQuery,
} from '../models/repository_models/RentalsTblRepositoryModel';
import {Knex} from 'knex';
import KnexRepositoryBase from './KnexRepositoryBase';
import moment from 'moment';

const tableName = 'rentals_tbl';

class RentalsTblRepository implements IRepository {
  static tableName = tableName;
  private static index(param: IRentalsTblQueryParams, trx?: Knex.Transaction) {
    const query = KnexRepositoryBase.Init<IRentalsTblQueryOutput>(
      db,
      tableName,
      trx,
    );

    if (param.q) {
      if (param.q.id) {
        query.andWhere('id', param.q.id);
      }
      if (param.q.user_id) {
        query.andWhere('user_id', '=', param.q.user_id);
      }
      if (param.q.status) {
        query.andWhere('status', '=', param.q.status);
      }
      if (param.q.payment_status) {
        query.andWhere('payment_status', '=', param.q.payment_status);
      }
      if (param.q.has_transaction) {
        query.andWhere('has_transaction', '=', param.q.has_transaction);
      }
      if (param.q.isBetweenStartAndEndTime) {
        const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
        // query between
        query.andWhereRaw('? BETWEEN start_time AND end_time', [currentTime]);
      }
    }

    return KnexRepositoryBase.Inqury(query, param);
  }

  static async findAll(
    param: IRentalsTblQueryParams,
    trx?: Knex.Transaction,
  ): Promise<IRentalsTblQueryOutput[]> {
    return this.index(param, trx);
  }

  static async findOne(
    param: IRentalsTblQueryParams,
    trx?: Knex.Transaction,
  ): Promise<IRentalsTblQueryOutput | undefined> {
    const query = await this.index({...param, limit: 1}, trx);
    return query[0] || undefined;
  }

  static save(
    data: IRentalsTblQueryOutput,
    trx?: Knex.Transaction,
  ): Promise<number[]> {
    return KnexRepositoryBase.Insert(
      KnexRepositoryBase.Init(db, tableName, trx),
      data,
    );
  }

  static update(
    data: IRentalsTblUpdatedQuery,
    condition: IRentalsTblQueryParams,
    trx?: Knex.Transaction,
  ): Promise<number> {
    const query = KnexRepositoryBase.Init<IRentalsTblUpdatedQuery>(
      db,
      tableName,
      trx,
    );

    if (condition.q) {
      if (condition.q.id) {
        query.where('id', condition.q.id);
      }
    }
    return KnexRepositoryBase.Update(query, data);
  }
}

export {RentalsTblRepository};
