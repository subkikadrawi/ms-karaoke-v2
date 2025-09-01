/* eslint-disable n/no-process-exit */
import app from './app';
import {config} from './app/configs/AppConfig';
import {logger} from './app/configs/LoggerConfig';
import KnexRepositoryBase from './app/repositories/KnexRepositoryBase';
const port = config.APP_PORT;

process.on('SIGINT', async () => {
  logger.info('💥 [Close] : Shutting down...');
  await KnexRepositoryBase.DestroyDbConnection();
  process.exit(0);
});

app.listen(port, async () => {
  logger.info('⏳ [Open]  : Loading Required Data and File ...');

  await KnexRepositoryBase.Check();

  logger.info(
    `${logger.utils.chalk.yellow('⚡️')} [server]: Running at`,
    logger.utils.chalk.underline(`http://localhost:${port}`),
  );
  logger.info(
    `${logger.utils.chalk.yellow('🛠️')}  [Mode]  : ${logger.utils.chalk.underline(config.APP_ENV)} ${config.APP_DEBUG ? '- DEBUG' : ''}`,
  );
});

export default app;
