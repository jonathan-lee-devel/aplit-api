import nodemailer, {Transporter} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const transporterConfig =
    (): Transporter<SMTPTransport.SentMessageInfo> => {
      return transporter;
    };
