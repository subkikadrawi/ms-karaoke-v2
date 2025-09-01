// eslint-disable-next-line n/no-unpublished-import
import {knex} from 'knex';
import {dbKaraokeDev} from './DatabasesConfig';

const ojkUploadDbConnection = knex({
  client: 'mysql2',
  connection: {
    user: dbKaraokeDev.username,
    host: dbKaraokeDev.host,
    port: dbKaraokeDev.port,
    database: dbKaraokeDev.db,
    password: dbKaraokeDev.password,
  },
  pool: {
    min: 2, // Jumlah koneksi minimum dalam pool
    max: 1000, // Jumlah koneksi maksimum dalam pool
    acquireTimeoutMillis: 60000, // Waktu tunggu untuk mengambil koneksi dari pool (dalam milidetik)
    createTimeoutMillis: 3000, // Waktu tunggu untuk membuat koneksi baru (dalam milidetik)
    idleTimeoutMillis: 10000, // Waktu tunggu sebelum koneksi idle (tidak digunakan) dihancurkan (dalam milidetik)
  },
});

export {ojkUploadDbConnection};
