import {makeSendMail} from './send-mail';
import {makeVerifyEmail} from './verify-email';
import {loggerConfig} from '../../config/Logger';
import {transporterConfig} from '../../config/Mail';

const logger = loggerConfig();
const transporter = transporterConfig();

export type SendMailFunction = (
    addressTo: string,
    subject: string,
    html: string,
) => Promise<boolean>;
export const sendMail = makeSendMail(
    logger,
    transporter,
);

export type VerifyEmailFunction = (
    emailToVerify: string,
) => boolean;
export const verifyEmail = makeVerifyEmail();
