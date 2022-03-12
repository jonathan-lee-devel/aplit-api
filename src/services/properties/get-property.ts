import {StatusContainerDto} from '../../dto/StatusContainerDto';
import {PropertyDto} from '../../dto/properties/PropertyDto';
import {User} from '../../models/User';
import {PropertyModel} from '../../models/properties/Property';

/**
 * Maker-function for get property.
 *
 * @return {Function} function to get property
 */
export const makeGetProperty = () => {
  /**
   * Function to get property.
   *
   * @param {User} user user which is attempting to get property
   * @param {string} id of the property to get
   */
  return async function getProperty(
      user: User, id: string,
  ): Promise<StatusContainerDto<PropertyDto>> {
    const property = await PropertyModel.findOne({id: id},
        {
          _id: 0,
          __v: 0,
        });

    if (!property) {
      return {
        status: 404,
        data: undefined,
      };
    }

    if (property.tenantEmails.includes(user.email) ||
        property.admin.email === user.email) {
      return {
        status: 200,
        data: {
          id: property.id,
          admin: property.admin.email,
          createdBy: property.createdBy.email,
          tenantEmails: property.tenantEmails,
          title: property.title,
        },
      };
    } else {
      return {
        status: 403,
        data: undefined,
      };
    }
  };
};
