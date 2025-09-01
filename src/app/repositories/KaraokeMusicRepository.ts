/* eslint-disable n/no-unpublished-import */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {ojkUploadDbConnection as db} from '../configs/KnexConfig';
import {IRepository} from './IRepository';
import {
  IKaraokeMusicTblQueryParams,
  IKaraokeMusicTblQueryOutput,
  IKaraokeMusicTblUpdatedQuery,
} from '../models/repository_models/KaraokeMusicTblRepositoryModel';
import {Knex} from 'knex';
import KnexRepositoryBase from './KnexRepositoryBase';

const tableName = 'karaoke_music_tbl';

class KaraokeMusicTblRepository implements IRepository {
  static tableName = tableName;
  private static index(
    param: IKaraokeMusicTblQueryParams,
    trx?: Knex.Transaction,
  ) {
    const query = KnexRepositoryBase.Init<IKaraokeMusicTblQueryOutput>(
      db,
      tableName,
      trx,
    );

    if (param.q) {
      if (param.q.id) {
        query.andWhere('id', param.q.id);
      }
      if (param.q.title) {
        query.andWhere('title', 'like', `%${param.q.title}%`);
      }
      if (
        Number(param.q.categoryId) !== 0 &&
        param.q.categoryId !== undefined
      ) {
        query.andWhere('categoryId', param.q.categoryId);
      }
    }

    return KnexRepositoryBase.Inqury(query, param);
  }

  static async findAll(
    param: IKaraokeMusicTblQueryParams,
    trx?: Knex.Transaction,
  ): Promise<IKaraokeMusicTblQueryOutput[]> {
    return this.index(param, trx);
  }

  static async findOne(
    param: IKaraokeMusicTblQueryParams,
    trx?: Knex.Transaction,
  ): Promise<IKaraokeMusicTblQueryOutput | undefined> {
    const query = await this.index({...param, limit: 1}, trx);
    return query[0] || undefined;
  }

  static save(
    data: IKaraokeMusicTblQueryOutput,
    trx?: Knex.Transaction,
  ): Promise<number[]> {
    return KnexRepositoryBase.Insert(
      KnexRepositoryBase.Init(db, tableName, trx),
      data,
    );
  }

  static update(
    data: IKaraokeMusicTblUpdatedQuery,
    condition: IKaraokeMusicTblQueryParams,
    trx?: Knex.Transaction,
  ): Promise<number> {
    const query = KnexRepositoryBase.Init<IKaraokeMusicTblUpdatedQuery>(
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

export {KaraokeMusicTblRepository};
