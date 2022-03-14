import {makeSendMail} from '../send-mail';

const logger = {
  info: () => {},
  warn: () => {},
  error: () => {},
};

describe('send mail', () => {
  it('When make sendMail Then sendMail',
      async () => {
        const sendMail = makeSendMail(
            logger,
            // @ts-ignore
            {},
        );

        expect(sendMail).not.toBeNull();
        expect(sendMail).toBeInstanceOf(Function);
      });
  it('When sendMail Then transporter sendMail',
      async () => {
        let wasTransporterSendMailCalled = false;
        const transporter = {
          sendMail: () => {
            wasTransporterSendMailCalled = true;
          },
        };
        const sendMail = makeSendMail(
            logger,
            // @ts-ignore
            transporter,
        );

        await sendMail(
            'addressTo',
            'subject',
            'text',
        );

        expect(wasTransporterSendMailCalled).toBeTruthy();
      });
});
