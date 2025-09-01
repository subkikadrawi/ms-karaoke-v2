/* eslint-disable node/no-process-env */
// eslint-disable-next-line n/no-unpublished-import
import {Knex} from 'knex';
import {dbKaraokeDev} from './src/app/configs/DatabasesConfig';

const config: {[key: string]: Knex.Config} = {
  development: {
    client: 'mysql2',
    connection: {
      host: dbKaraokeDev.host,
      port: dbKaraokeDev.port,
      database: dbKaraokeDev.db,
      user: dbKaraokeDev.username,
      password: dbKaraokeDev.password,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations',
    },
  },
};

// eslint-disable-next-line no-console
console.log('Knex Config:', config.development);

module.exports = config; // <-- Use this for Knex CLI
