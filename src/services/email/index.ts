import {makeSendMail} from './send-mail';
import {makeVerifyEmail} from './verify-email';
import {loggerConfig} from '../../config/Logger';
import {transporterConfig} from '../../config/Mail';

const logger = loggerConfig();
const transporter = transporterConfig();

export const sendMail = makeSendMail(logger, transporter);

export const verifyEmail = makeVerifyEmail();
