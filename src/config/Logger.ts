import logger from 'npmlog';
import {Logger} from '../generic/Logger';

logger.prefixStyle = {
  bold: true,
};

export const loggerConfig = (): Logger => {
  return new Logger(logger);
};
