/* eslint-disable n/no-unpublished-import */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {ojkUploadDbConnection as db} from '../configs/KnexConfig';
import {IRepository} from './IRepository';
import {
  IKaraokePlaylistTblQueryParams,
  IKaraokePlaylistTblQueryOutput,
  IKaraokePlaylistTblUpdatedQuery,
} from '../models/repository_models/KaraokePlaylistTblRepositoryModel';
import {Knex} from 'knex';
import KnexRepositoryBase from './KnexRepositoryBase';
import moment from 'moment';

const year = moment().format('YYYY');
const tableName = `karaoke_playlist_${year}`;

class KaraokePlaylistTblRepository implements IRepository {
  static tableName = tableName;
  private static index(
    param: IKaraokePlaylistTblQueryParams,
    trx?: Knex.Transaction,
  ) {
    const query = KnexRepositoryBase.Init<IKaraokePlaylistTblQueryOutput>(
      db,
      tableName,
      trx,
    );

    if (param.q) {
      if (param.q.id) {
        query.andWhere('id', param.q.id);
      }
      if (param.q.status) {
        query.andWhere('status', '=', param.q.status);
      }
      if (param.q.rental_id) {
        query.andWhere('rental_id', '=', param.q.rental_id);
      }
    }

    return KnexRepositoryBase.Inqury(query, param);
  }

  static async findAll(
    param: IKaraokePlaylistTblQueryParams,
    trx?: Knex.Transaction,
  ): Promise<IKaraokePlaylistTblQueryOutput[]> {
    return this.index(param, trx);
  }

  static async findOne(
    param: IKaraokePlaylistTblQueryParams,
    trx?: Knex.Transaction,
  ): Promise<IKaraokePlaylistTblQueryOutput | undefined> {
    const query = await this.index({...param, limit: 1}, trx);
    return query[0] || undefined;
  }

  static save(
    data: IKaraokePlaylistTblQueryOutput,
    trx?: Knex.Transaction,
  ): Promise<number[]> {
    return KnexRepositoryBase.Insert(
      KnexRepositoryBase.Init(db, tableName, trx),
      data,
    );
  }

  static update(
    data: IKaraokePlaylistTblUpdatedQuery,
    condition: IKaraokePlaylistTblQueryParams,
    trx?: Knex.Transaction,
  ): Promise<number> {
    const query = KnexRepositoryBase.Init<IKaraokePlaylistTblUpdatedQuery>(
      db,
      tableName,
      trx,
    );

    if (condition.q) {
      if (condition.q.id) {
        query.where('id', condition.q.id);
      }
      if (condition.q.status) {
        query.where('status', condition.q.status);
      }
    }
    return KnexRepositoryBase.Update(query, data);
  }
}

export {KaraokePlaylistTblRepository};
