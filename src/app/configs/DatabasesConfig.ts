/* eslint-disable node/no-process-env */
require('dotenv').config();

const dbKaraokeDev = {
  host: process.env.DB_HOST,
  host_read: process.env.DB_HOST_READ,
  port: Number(process.env.DB_HOST_PORT),
  db: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
};

export {dbKaraokeDev};
