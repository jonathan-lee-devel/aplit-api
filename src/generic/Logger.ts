import logger from 'npmlog';
import getCallerFile from 'get-caller-file';

logger.prefixStyle = {
  bold: true,
};

/**
 * Generic logger used to allow for different
 * logging libraries to be used without major refactor.
 */
export class Logger {
  /**
   * Used to log info messages.
   *
   * @param {string} message to be logged
  */
  info(message: string): void {
    logger.info(Logger.getLoggingPrefix(), message);
  }

  /**
   * Used to log warning messages.
   *
   * @param {string} message to be logged
  */
  warn(message: string): void {
    logger.error(Logger.getLoggingPrefix(), message);
  }

  /**
   * Used to log error messages.
   *
   * @param {string} message to be logged
  */
  error(message: string): void {
    logger.error(Logger.getLoggingPrefix(), message);
  }

  /**
   * Helper function used to get logging message prefix.
   * @private used within logger class only
   * @return {string} logging prefix
  */
  private static getLoggingPrefix(): string {
    return getCallerFile().split('/').pop();
  }
}
