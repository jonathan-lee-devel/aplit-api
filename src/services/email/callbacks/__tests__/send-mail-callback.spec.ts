import {makeSendMailCallback} from '../send-mail-callback';
import {Logger} from '../../../../generic/Logger';

const innerLogger = {
  info: () => {},
  warn: () => {},
  error: () => {},
};
const logger = new Logger(innerLogger);

describe('send mail callback', () => {
  it('When make sendMailCallback Then sendMailCallback',
      async () => {
        const sendMailCallback = makeSendMailCallback(logger);

        expect(sendMailCallback).not.toBeNull();
        expect(sendMailCallback).toBeInstanceOf(Function);
      });
  it('When sendMailCallback and error Then log error',
      async () => {
        let loggedMessage;
        const thisInnerLogger = {
          error: (_: string, message: string) => {
            loggedMessage = message;
          },
        };
        const thisLogger = new Logger(thisInnerLogger);
        const sendMailCallback = makeSendMailCallback(thisLogger);

        const errorMessage = 'error';
        sendMailCallback({stack: '', name: '', message: errorMessage}, {});

        expect(loggedMessage).toStrictEqual(errorMessage);
      });
  it('When sendMailCallback and error Then return false',
      async () => {
        const sendMailCallback = makeSendMailCallback(logger);

        const result = sendMailCallback({stack: '', name: '', message: ''}, {});

        expect(result).not.toBeTruthy();
      });
  it('When sendMailCallback and no error Then log info',
      async () => {
        let loggedMessage;
        const thisInnerLogger = {
          info: (_: string, message: string) => {
            loggedMessage = message;
          },
        };
        const thisLogger = new Logger(thisInnerLogger);
        const sendMailCallback = makeSendMailCallback(thisLogger);

        const infoResponse = 'response';

        sendMailCallback(null, {response: infoResponse});

        expect(loggedMessage)
            .toStrictEqual(`E-mail sent with response: ${infoResponse}`);
      });
  it('When sendMailCallback and no error Then return true',
      async () => {
        const sendMailCallback = makeSendMailCallback(logger);

        const result = sendMailCallback(null, {});

        expect(result).toBeTruthy();
      });
});
