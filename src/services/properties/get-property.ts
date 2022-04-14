import {StatusDataContainer} from '../../data/StatusDataContainer';
import {PropertyDto} from '../../data/dto/properties/PropertyDto';
import {User} from '../../models/User';
import {Property} from '../../models/properties/Property';
import {GetPropertyFunction} from './index';
import {Model} from 'mongoose';

/**
 * Maker-function for get property.
 *
 * @param {Model<Property>} PropertyModel
 * @return {Function} function to get property
 */
export const makeGetProperty = (
    PropertyModel: Model<Property>,
): GetPropertyFunction => {
  /**
   * Function to get property.
   *
   * @param {User} user user which is attempting to get property
   * @param {string} id of the property to get
   */
  return async function getProperty(
      user: User, id: string,
  ): Promise<StatusDataContainer<PropertyDto>> {
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
    }
    return {
      status: 403,
      data: undefined,
    };
  };
};
