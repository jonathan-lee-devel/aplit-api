import {User} from '../../models/User';
import {Property, PropertyModel} from '../../models/properties/Property';
import {PropertyDto} from '../../dto/properties/PropertyDto';
import {StatusContainerDto} from '../../dto/StatusContainerDto';
import {Logger} from '../../generic/Logger';
import {Mailer} from '../../generic/Mailer';

/**
 * Maker-function for the function to create properties.
 *
 * @param {Logger} logger used when creating properties
 * @param {Mailer} mailer used to send emails
 * @param {Function} generateId used to generate IDs
 * @param {Function} createPropertyInvitation used to create property invitation
 * @return {Function} function to create properties
 */
export const makeCreateProperty = (
    logger: Logger,
    mailer: Mailer,
    generateId: Function,
    createPropertyInvitation: Function,
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
  ): Promise<StatusContainerDto<PropertyDto>> {
    const id = await generateId(logger);
    for (const tenantEmail of tenantEmails) {
      const propertyInvitation = await createPropertyInvitation(
          id,
          tenantEmail,
          createdBy.email,
      );
      mailer.sendMail(tenantEmail, 'Split Invitation',
          // eslint-disable-next-line max-len
          `<h4>${createdBy.firstName} ${createdBy.lastName} has invited you to Split</h4>
                        <h5>Please click the following link to accept: <a href="http://${process.env.BACK_END_URL}/property/invitation/${propertyInvitation.data.id}">Accept Invitation</a></h5>`);
    }
    const property: Property = {
      id,
      title,
      tenantEmails: tenantEmails,
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
