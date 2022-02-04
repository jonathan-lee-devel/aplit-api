import logger from 'npmlog';
import getCallerFile from 'get-caller-file';

logger.prefixStyle = {
  bold: true,
};

export const loggerConfig = (): logger.Logger => {
  return logger;
};

export const getLoggingPrefix = (): string => {
  return getCallerFile().split('/').pop();
};
