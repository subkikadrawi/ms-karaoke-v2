/* eslint-disable n/no-unpublished-import */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {ojkUploadDbConnection as db} from '../configs/KnexConfig';
import {IRepository} from './IRepository';
import {
  IRentalItemsTblQueryParams,
  IRentalItemsTblQueryOutput,
  IRentalItemsTblUpdatedQuery,
} from '../models/repository_models/RentalItemsTblRepositoryModel';
import {Knex} from 'knex';
import KnexRepositoryBase from './KnexRepositoryBase';

const tableName = 'rental_items_tbl';

class RentalItemsTblRepository implements IRepository {
  static tableName = tableName;
  private static index(
    param: IRentalItemsTblQueryParams,
    trx?: Knex.Transaction,
  ) {
    const query = KnexRepositoryBase.Init<IRentalItemsTblQueryOutput>(
      db,
      tableName,
      trx,
    );

    if (param.q) {
      if (param.q.id) {
        query.andWhere('id', param.q.id);
      }
    }

    return KnexRepositoryBase.Inqury(query, param);
  }

  static async findAll(
    param: IRentalItemsTblQueryParams,
    trx?: Knex.Transaction,
  ): Promise<IRentalItemsTblQueryOutput[]> {
    return this.index(param, trx);
  }

  static async findOne(
    param: IRentalItemsTblQueryParams,
    trx?: Knex.Transaction,
  ): Promise<IRentalItemsTblQueryOutput | undefined> {
    const query = await this.index({...param, limit: 1}, trx);
    return query[0] || undefined;
  }

  static save(
    data: IRentalItemsTblQueryOutput,
    trx?: Knex.Transaction,
  ): Promise<number[]> {
    return KnexRepositoryBase.Insert(
      KnexRepositoryBase.Init(db, tableName, trx),
      data,
    );
  }

  static update(
    data: IRentalItemsTblUpdatedQuery,
    condition: IRentalItemsTblQueryParams,
    trx?: Knex.Transaction,
  ): Promise<number> {
    const query = KnexRepositoryBase.Init<IRentalItemsTblUpdatedQuery>(
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

export {RentalItemsTblRepository};
