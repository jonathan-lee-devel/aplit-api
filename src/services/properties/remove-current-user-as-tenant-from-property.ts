import {Logger} from '../../generic/Logger';
import {Model} from 'mongoose';
import {Property} from '../../models/properties/Property';
import {User} from '../../models/User';
import {RemoveCurrentUserAsTenantFromPropertyFunction} from './index';

export const makeRemoveCurrentUserAsTenantFromProperty = (
    logger: Logger,
    PropertyModel: Model<Property>,
): RemoveCurrentUserAsTenantFromPropertyFunction => {
  return async function removeCurrentUserAsTenantFromProperty(
      user: User,
      propertyId: string,
  ) {
    const property = await PropertyModel.findOne({id: propertyId},
        {_id: 0, __v: 0});
    if (!property) {
      logger.warn(`Failed to find property with ID: ${propertyId}`);
      return {
        status: 400,
        data: undefined,
      };
    }

    const tenantEmailIndex =
        property.tenantEmails.indexOf(user.email, 0);
    if (tenantEmailIndex > -1) {
      property.tenantEmails.splice(tenantEmailIndex, 1);

      try {
        await PropertyModel.updateOne({id: propertyId},
            {tenantEmails: property.tenantEmails});
        return {
          status: 204,
          data: undefined,
        };
      } catch (err) {
        logger.error(err);
      }
    } else {
      // eslint-disable-next-line max-len
      logger.warn(`Failed to find index of tenantEmailToRemove: ${user.email} for property with ID: ${propertyId}`);
      return {
        status: 400,
        data: undefined,
      };
    }
    return {
      status: 500,
      data: undefined,
    };
  };
};
