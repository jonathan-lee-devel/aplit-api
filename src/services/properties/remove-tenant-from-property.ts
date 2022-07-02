import {Logger} from '../../generic/Logger';
import {Model} from 'mongoose';
import {Property} from '../../models/properties/Property';
import {User} from '../../models/User';
import {RemoveTenantFromPropertyFunction} from './index';

export const makeRemoveTenantFromProperty = (
    logger: Logger,
    PropertyModel: Model<Property>,
    UserModel: Model<User>,
): RemoveTenantFromPropertyFunction => {
  return async function removeTenantFromProperty(
      user: User,
      propertyId: string,
      tenantEmailToRemove: string,
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

    const propertyAdmin = await UserModel.findOne({_id: property.admin});

    if (
      user.email !== tenantEmailToRemove &&
        user.email !== propertyAdmin.email
    ) {
      return {
        status: 403,
        data: undefined,
      };
    }

    const tenantEmailIndex =
        property.tenantEmails.indexOf(tenantEmailToRemove, 0);
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
      logger.warn(`Failed to find index of tenantEmailToRemove: ${tenantEmailToRemove} for property with ID: ${propertyId}`);
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
