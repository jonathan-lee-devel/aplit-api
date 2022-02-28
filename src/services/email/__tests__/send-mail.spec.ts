import {makeSendMail} from '../send-mail';
import {Logger} from '../../../generic/Logger';

jest.mock('nodemailer');
import nodemailer from 'nodemailer';
const sendMailMock = jest.fn();
// nodemailer.createTransport.mockReturnValue({'sendMail': sendMailMock});

beforeEach( () => {
  sendMailMock.mockClear();
  // nodemailer.createTransport.mockClear();
});

describe('send mail', () => {
  it('When make sendMail then sendMail',
      async () => {
        const logger = new Logger();

        const sendMail = makeSendMail(
            logger,
            nodemailer.createTransport({}, {}),
        );

        expect(sendMail).not.toBeNull();
        expect(sendMail).toBeInstanceOf(Function);
      });
});
