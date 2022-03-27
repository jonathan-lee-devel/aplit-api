import {Logger} from '../Logger';

describe('Generic Logger tests', () => {
  it('When generic logger Then generic logger',
      async () => {
        const logger = new Logger({});

        expect(logger).not.toBeNull();
        expect(logger).toBeInstanceOf(Logger);
      });

  it('When generic logger info Then underlying logger info',
      async () => {
        let loggedMessage;
        const innerLogger = {
          info: (_: string, message: string) => {
            loggedMessage = message;
          },
        };
        const logger = new Logger(innerLogger);

        const messageToLog = 'message';
        logger.info(messageToLog);

        expect(loggedMessage).toStrictEqual(messageToLog);
      });
  it('When generic logger warn Then underlying logger warn',
      async () => {
        let loggedMessage;
        const innerLogger = {
          warn: (_: string, message: string) => {
            loggedMessage = message;
          },
        };
        const logger = new Logger(innerLogger);

        const messageToLog = 'message';
        logger.warn(messageToLog);

        expect(loggedMessage).toStrictEqual(messageToLog);
      });
  it('When generic logger error Then underlying logger error',
      async () => {
        let loggedMessage;
        const innerLogger = {
          error: (_: string, message: string) => {
            loggedMessage = message;
          },
        };
        const logger = new Logger(innerLogger);

        const messageToLog = 'message';
        logger.error(messageToLog);

        expect(loggedMessage).toStrictEqual(messageToLog);
      });
});
