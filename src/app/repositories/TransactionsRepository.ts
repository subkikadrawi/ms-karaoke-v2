/* eslint-disable n/no-unpublished-import */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {ojkUploadDbConnection as db} from '../configs/KnexConfig';
import {IRepository} from './IRepository';
import {
  ITransactionsTblQueryParams,
  ITransactionsTblQueryOutput,
  ITransactionsTblUpdatedQuery,
} from '../models/repository_models/TransactionsTblRepositoryModel';
import {Knex} from 'knex';
import KnexRepositoryBase from './KnexRepositoryBase';

const tableName = 'transactions_tbl';

class TransactionsTblRepository implements IRepository {
  static tableName = tableName;
  private static index(
    param: ITransactionsTblQueryParams,
    trx?: Knex.Transaction,
  ) {
    const query = KnexRepositoryBase.Init<ITransactionsTblQueryOutput>(
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
    param: ITransactionsTblQueryParams,
    trx?: Knex.Transaction,
  ): Promise<ITransactionsTblQueryOutput[]> {
    return this.index(param, trx);
  }

  static async findOne(
    param: ITransactionsTblQueryParams,
    trx?: Knex.Transaction,
  ): Promise<ITransactionsTblQueryOutput | undefined> {
    const query = await this.index({...param, limit: 1}, trx);
    return query[0] || undefined;
  }

  static save(
    data: ITransactionsTblQueryOutput,
    trx?: Knex.Transaction,
  ): Promise<number[]> {
    return KnexRepositoryBase.Insert(
      KnexRepositoryBase.Init(db, tableName, trx),
      data,
    );
  }

  static update(
    data: ITransactionsTblUpdatedQuery,
    condition: ITransactionsTblQueryParams,
    trx?: Knex.Transaction,
  ): Promise<number> {
    const query = KnexRepositoryBase.Init<ITransactionsTblUpdatedQuery>(
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

export {TransactionsTblRepository};
