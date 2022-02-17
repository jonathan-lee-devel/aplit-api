import {Transporter} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {User} from '../../models/User';
import {Property, PropertyModel} from '../../models/properties/Property';
import {PropertyDto} from '../../dto/PropertyDto';
import {StatusContainerDto} from '../../dto/StatusContainerDto';
import {Logger} from '../../generic/Logger';

/**
 * Maker-function for the function to create properties.
 *
 * @param {Logger} logger used when creating properties
 * @param {Transporter} transporter used to send emails
 * @param {Function} generateId used to generate IDs
 * @return {Function} function to create properties
 */
export const makeCreateProperty = (
    logger: Logger,
    transporter: Transporter<SMTPTransport.SentMessageInfo>,
    generateId: Function,
) => {
  /**
   * Used to create properties.
   *
   * @param {string} title title or name for the property
   * @param {string[]} tenants e-mail addresses of the tenants
   * @param {User} createdBy user account which created the property
   * @param {User} admin current administrator for the property
   *
   * @return {Function} function to create property
   */
  return async function createProperty(
      title: string,
      tenants: string[],
      createdBy: User,
      admin: User,
  ): Promise<StatusContainerDto<PropertyDto>> {
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
      logger.error(`An error has occurred: ${err.message}`);
      return {
        status: 500,
        data: undefined,
      };
    }

    return {
      status: 201,
      data: property,
    };
  };
};
