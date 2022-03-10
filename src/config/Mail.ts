import nodemailer from 'nodemailer';
import {Mailer} from '../generic/Mailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const mailerConfig = (): Mailer => {
  return new Mailer(transporter);
};
