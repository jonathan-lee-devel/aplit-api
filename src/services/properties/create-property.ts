import {User} from '../../models/User';
import {Property} from '../../models/properties/Property';
import {PropertyDto} from '../../data/dto/properties/PropertyDto';
import {StatusDataContainer} from '../../data/StatusDataContainer';
import {Logger} from '../../generic/Logger';
import {Mailer} from '../../generic/Mailer';
import {Model} from 'mongoose';

/**
 * Maker-function for the function to create properties.
 *
 * @param {Logger} logger used for logging
 * @param {Mailer} mailer used to send emails
 * @param {Function} generateId used to generate IDs
 * @param {Model<Property>} PropertyModel used to create properties in database
 * @param {Function} createPropertyInvitation used to create property invitation
 * @param {Function} sendPropertyInvitation used to send property invitation
 * @return {Function} function to create properties
 */
export const makeCreateProperty = (
    logger: Logger,
    mailer: Mailer,
    generateId: Function,
    PropertyModel: Model<Property>,
    createPropertyInvitation: Function,
    sendPropertyInvitation: Function,
) => {
  /**
   * Used to create properties.
   *
   * @param {string} title title or name for the property
   * @param {string[]} tenantEmails e-mail addresses of the tenants
   * @param {User} createdBy user account which created the property
   * @param {User} admin current administrator for the property
   *
   * @return {Function} function to create property
   */
  return async function createProperty(
      title: string,
      tenantEmails: string[],
      createdBy: User,
      admin: User,
  ): Promise<StatusDataContainer<PropertyDto>> {
    const id = await generateId(logger);
    const property: Property = {
      id,
      title,
      tenantEmails: tenantEmails,
      createdBy,
      admin,
    };

    try {
      await new PropertyModel(property).save();
      for (const tenantEmail of tenantEmails) {
        const propertyInvitationContainer =
            await createPropertyInvitation(
                property.id,
                createdBy.email,
                tenantEmail,
            );

        if (propertyInvitationContainer.status === 201) {
          sendPropertyInvitation(
              propertyInvitationContainer.data.propertyInvitationToken.value,
              createdBy.email,
              tenantEmail,
          );
        }
      }
    } catch (err) {
      logger.error(`An error has occurred: ${err.message}`);
      return {
        status: 500,
        data: undefined,
      };
    }

    return {
      status: 201,
      data: {
        id: property.id,
        title: property.title,
        tenantEmails: property.tenantEmails,
        createdBy: property.createdBy.email,
        admin: property.admin.email,
      },
    };
  };
};
