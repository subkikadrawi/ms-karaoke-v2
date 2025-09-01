/* eslint-disable n/no-process-exit */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {Knex} from 'knex';
import {IRepositoryParam} from './IRepository';
import {logger} from '../configs/LoggerConfig';
import {ojkUploadDbConnection as db} from '../configs/KnexConfig';

class KnexRepositoryBase {
  private static db: Knex;
  private static tableName: string;

  static async Check(): Promise<boolean> {
    logger.spinner.start('Checking database connection...');
    try {
      await db.raw('SELECT 1 as checkConnectionKnex');
      logger.spinner.success('✅ [Open]  : Database connection successful!');
      return true;
    } catch (error) {
      logger.spinner.fail(
        `❌ Database connection failed: ${(error as any).message}`,
      );
      logger.error(`❌ Database connection failed: ${(error as any).message}`);
      throw new Error('Database connection failed');
    }
  }

  static async DestroyDbConnection(): Promise<void> {
    logger.spinner.start('Closing database connection...');
    try {
      await db.destroy();
      logger.spinner.success('✂️  [Close] : Previous DB connection closed.');
    } catch (error) {
      logger.spinner.fail(
        `[Close] : Error closing DB connection: ${(error as any).message}`,
      );
      logger.error('[Close] : Error closing DB connection:', error);
    }
  }

  static async Transaction(): Promise<Knex.Transaction> {
    if (!this.db) {
      throw new Error(
        '[KnexRepositoryBase.Transaction] - Database connection is not initialized.',
      );
    }
    return await this.db.transaction();
  }

  static Init<TRecord extends {} = any>(
    db: Knex,
    tableName: string,
    trx?: Knex.Transaction,
  ): Knex.QueryBuilder<TRecord> {
    this.db = db;
    this.tableName = tableName;
    const queryBuilder = db<TRecord>(tableName);

    if (trx) {
      queryBuilder.transacting(trx);
    }

    return queryBuilder;
  }

  static Inqury<TRecord extends {}, TResult>(
    query: Knex.QueryBuilder<TRecord, TResult>,
    param: IRepositoryParam<any>,
    trx?: Knex.Transaction,
  ): Knex.QueryBuilder<TRecord, TResult> {
    const db = this.db;

    if (param.selectedRaw && param.selectedRaw.length > 0) {
      param.selectedRaw.forEach(rawExpression => {
        query.select(db.raw(rawExpression));
      });
    }

    if (param.whereRaw && param.whereRaw.length > 0) {
      param.whereRaw.forEach(rawExpression => {
        query.andWhereRaw(rawExpression);
      });
    }

    if (param.limit) {
      query.limit(param.limit);
    }

    if (param.offset) {
      query.offset(param.offset);
    }

    if (param.groupBy && param.groupBy.length > 0) {
      query.groupBy(...param.groupBy);
    }

    if (param.orderBy) {
      query.orderBy(param.orderBy.column, param.orderBy.direction);
    }

    if (param.orderByRaw) {
      query.orderByRaw(
        `${param.orderByRaw.column} ${param.orderByRaw.direction}`,
      );
    }

    if (param.selectedColumns && param.selectedColumns.length > 0) {
      query.select(...param.selectedColumns);
    }

    if (param.count && param.count.length > 0) {
      param.count.forEach(item => {
        query.count(item?.selected || '*', {as: item.alias});
      });
    }

    if (trx) {
      query.transacting(trx);
    }

    logger.debug(`[Execute ON ${this.tableName}]`, query.toQuery());

    return query;
  }

  static async Insert<TRecord extends {}, TResult>(
    query: Knex.QueryBuilder<TRecord, TResult>,
    data: any,
    trx?: Knex.Transaction,
  ): Promise<any> {
    query.insert(data);

    if (trx) {
      query.transacting(trx);
    }

    logger.debug(`[Insert ON ${this.tableName}]`, query.toQuery());

    return query;
  }

  static async Upsert<TRecord extends {}, TResult>(
    query: Knex.QueryBuilder<TRecord, TResult>,
    data: any,
    primaryKey: string,
    keysUpdated: any[],
    options?: {
      trx?: Knex.Transaction;
    },
  ): Promise<any> {
    query.insert(data).onConflict(primaryKey).merge(keysUpdated);

    if (options?.trx) {
      query.transacting(options.trx);
    }

    // logger.debug(`[Upsert ON ${this.tableName}]`, query.toQuery());
    logger.info(`[Upsert] ON ${this.tableName} total data: ${data.length}`);

    return query;
  }

  static async Update<TRecord extends {}, TResult>(
    query: Knex.QueryBuilder<TRecord, TResult>,
    data: any,
    trx?: Knex.Transaction,
  ): Promise<any> {
    query.update(data);

    if (trx) {
      query.transacting(trx);
    }

    logger.debug(`[Update ON ${this.tableName}]`, query.toQuery());

    return query;
  }

  static async Deleted<TRecord extends {}, TResult>(
    query: Knex.QueryBuilder<TRecord, TResult>,
    data: any,
    trx?: Knex.Transaction,
  ): Promise<any> {
    query.delete(data);

    if (trx) {
      query.transacting(trx);
    }

    logger.debug(`[Deleted ON ${this.tableName}]`, query.toQuery());

    return query;
  }
}

export default KnexRepositoryBase;
