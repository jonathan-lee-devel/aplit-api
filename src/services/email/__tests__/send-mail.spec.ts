import {makeSendMail} from '../send-mail';
import {jest} from '@jest/globals';

jest.mock('nodemailer');
import nodemailer from 'nodemailer';

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
            nodemailer.createTransport({}, {}),
        );

        expect(sendMail).not.toBeNull();
        expect(sendMail).toBeInstanceOf(Function);
      });
  it('When sendMail Then transporter sendMail',
      async () => {
        const mockSendMail = jest.fn(() => true);
        const transporter = {
          sendMail: mockSendMail,
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

        expect(mockSendMail).toBeCalledTimes(1);
      });
});
