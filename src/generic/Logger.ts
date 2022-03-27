import getCallerFile from 'get-caller-file';

/**
 * Generic logger used to allow for different
 * logging libraries to be used without major refactor.
 */
export class Logger {
  private logger: {
    info: (prefix: string, message: string) => void,
    warn: (prefix: string, message: string) => void,
    error: (prefix: string, message: string) => void,
  };

  /**
   * Basic constructor.
   *
   * @param {any} logger used to do actual logging
   */
  constructor(logger: any) {
    this.logger = logger;
  }

  /**
   * Used to log info messages.
   *
   * @param {string} message to be logged
  */
  info(message: string): void {
    this.logger.info(Logger.getLoggingPrefix(), message);
  }

  /**
   * Used to log warning messages.
   *
   * @param {string} message to be logged
  */
  warn(message: string): void {
    this.logger.warn(Logger.getLoggingPrefix(), message);
  }

  /**
   * Used to log error messages.
   *
   * @param {string} message to be logged
  */
  error(message: string): void {
    this.logger.error(Logger.getLoggingPrefix(), message);
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
