/* eslint-disable n/no-unpublished-import */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {ojkUploadDbConnection as db} from '../configs/KnexConfig';
import {IRepository} from './IRepository';
import {
  IUserTblQueryParams,
  IUserTblQueryOutput,
  IUserTblUpdatedQuery,
} from '../models/repository_models/UserTblRepositoryModel';
import {Knex} from 'knex';
import KnexRepositoryBase from './KnexRepositoryBase';

const tableName = 'user_tbl';

class UserTblRepository implements IRepository {
  static tableName = tableName;
  private static index(param: IUserTblQueryParams, trx?: Knex.Transaction) {
    const query = KnexRepositoryBase.Init<IUserTblQueryOutput>(
      db,
      tableName,
      trx,
    );

    if (param.q) {
      if (param.q.id) {
        query.andWhere('id', param.q.id);
      }
      if (param.q.login) {
        query.andWhere('login', '=', param.q.login);
      }
    }

    return KnexRepositoryBase.Inqury(query, param);
  }

  static async findAll(
    param: IUserTblQueryParams,
    trx?: Knex.Transaction,
  ): Promise<IUserTblQueryOutput[]> {
    return this.index(param, trx);
  }

  static async findOne(
    param: IUserTblQueryParams,
    trx?: Knex.Transaction,
  ): Promise<IUserTblQueryOutput | undefined> {
    const query = await this.index({...param, limit: 1}, trx);
    return query[0] || undefined;
  }

  static save(
    data: IUserTblQueryOutput,
    trx?: Knex.Transaction,
  ): Promise<number[]> {
    return KnexRepositoryBase.Insert(
      KnexRepositoryBase.Init(db, tableName, trx),
      data,
    );
  }

  static update(
    data: IUserTblUpdatedQuery,
    condition: IUserTblQueryParams,
    trx?: Knex.Transaction,
  ): Promise<number> {
    const query = KnexRepositoryBase.Init<IUserTblUpdatedQuery>(
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

export {UserTblRepository};
