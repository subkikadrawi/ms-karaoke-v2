import {
  LoggerService,
  ELogStage,
  ELogLevels,
  ILoggerConfig,
} from 'logger-services';
import {config} from './AppConfig';

const defaultConfig: ILoggerConfig = {
  app_debug: config.APP_DEBUG,
};

const logger = new LoggerService(defaultConfig);

const initLogger = (config?: ILoggerConfig, clear?: boolean) => {
  const mergedConfig: ILoggerConfig = {
    ...defaultConfig,
    ...config,
  };

  logger.init(mergedConfig, clear);
};

export {logger, initLogger as init, ELogStage, ELogLevels};
