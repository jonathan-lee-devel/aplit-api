import {Transporter} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import npmlog from 'npmlog';
import {User} from '../../models/User';
import {Property, PropertyModel} from '../../models/properties/Property';
import {generateId} from '../id/id-generate';
import {PropertyDto} from '../../dto/PropertyDto';
import {StatusContainerDto} from '../../dto/StatusContainerDto';
import {getLoggingPrefix} from "../../config/Logger";

export const createProperty = async (
    logger: npmlog.Logger,
    transporter: Transporter<SMTPTransport.SentMessageInfo>,
    title: string,
    tenants: string[],
    createdBy: User,
    admin: User,
): Promise<StatusContainerDto<PropertyDto>> => {
  const id = await generateId(logger);
  const property: Property = {
    id,
    title,
    tenants,
    createdBy,
    admin,
  };

  try {
    await new PropertyModel(property).save();
  } catch (err) {
    logger.error(getLoggingPrefix(), 'An error has occurred: %j', err.message);
    return {
      status: 500,
      data: undefined,
    };
  }

  return {
    status: 200,
    data: property,
  };
};
