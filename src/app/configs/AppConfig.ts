/* eslint-disable node/no-process-env */
require('dotenv').config();

const appConfig = {
  APP_ACCESS_TOKEN_SECRET: process.env.APP_ACCESS_TOKEN_SECRET ?? '',
  APP_STATIC_TOKEN: process.env.APP_STATIC_TOKEN ?? '',
  PASSWORD_SECRET: process.env.PASSWORD_SECRET ?? '',
  APP_PORT: process.env.APP_PORT ?? '',
  APP_ENV: process.env.APP_ENV ?? '',
  APP_DEBUG: process.env.APP_DEBUG === 'true',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ?? '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ?? '',
};

export {appConfig as config};
