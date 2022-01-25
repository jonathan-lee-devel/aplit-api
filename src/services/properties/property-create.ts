import {PropertyCreationStatus} from './enum/property-creation-status';
import {Transporter} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {User} from '../../models/User';
import {PropertyModel} from '../../models/properties/Property';

export const propertyCreate = async (
    transporter: Transporter<SMTPTransport.SentMessageInfo>,
    title: string,
    tenants: string[],
    user: User,
): Promise<PropertyCreationStatus> => {
  const property = {
    title,
    tenants,
    user,
  };

  await new PropertyModel(property).save();

  // TODO surround with try-catch block

  return PropertyCreationStatus.SUCCESS;
};
