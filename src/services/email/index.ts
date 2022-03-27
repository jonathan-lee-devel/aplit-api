import {makeSendMail} from './send-mail';
import {makeVerifyEmail} from './verify-email';
import {loggerConfig} from '../../config/Logger';
import {transporterConfig} from '../../config/Mail';
import {SentMessageInfo} from 'nodemailer';
import {makeSendMailCallback} from './callbacks/send-mail-callback';

const logger = loggerConfig();
const transporter = transporterConfig();

export type SendMailCallbackFunction = (
    err: (Error | null),
    info: SentMessageInfo,
) => boolean;
const sendMailCallback = makeSendMailCallback(
    logger,
);

export type SendMailFunction = (
    addressTo: string,
    subject: string,
    html: string,
) => Promise<boolean>;
export const sendMail = makeSendMail(
    logger,
    transporter,
    sendMailCallback,
);

export type VerifyEmailFunction = (
    emailToVerify: string,
) => boolean;
export const verifyEmail = makeVerifyEmail();
