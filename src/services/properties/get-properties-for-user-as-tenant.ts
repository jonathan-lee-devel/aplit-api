import {StatusDataContainer} from '../../data/StatusDataContainer';
import {PropertyDto} from '../../data/dto/properties/PropertyDto';
import {User} from '../../models/User';
import {Property} from '../../models/properties/Property';
import {GetPropertiesForUserAsTenantFunction} from './index';
import {Model} from 'mongoose';

/**
 * Maker-function for get property.
 *
 * @return {Function} function to get property
 */
export const makeGetPropertiesForUserAsTenant = (
    PropertyModel: Model<Property>,
): GetPropertiesForUserAsTenantFunction => {
  /**
   * Function to get property.
   *
   * @param {User} user user which is attempting to get property
   * @param {string} id of the property to get
   */
  return async function getPropertiesForUserAsTenant(
      user: User,
  ): Promise<StatusDataContainer<PropertyDto[]>> {
    const propertyRecords = await PropertyModel.find({
      tenantEmails: user.email,
    });

    const properties: PropertyDto[] = [];

    for (const property of propertyRecords) {
      properties.push({
        id: property.id,
        title: property.title,
        createdBy: property.createdBy.email,
        admin: property.admin.email,
        tenantEmails: property.tenantEmails,
      });
    }

    return {
      status: 200,
      data: properties,
    };
  };
};
