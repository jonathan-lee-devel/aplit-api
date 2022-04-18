import {User} from '../../models/User';
import {Property} from '../../models/properties/Property';
import {GetPropertyIsAdminFunction} from './index';
import {Model} from 'mongoose';

/**
 * Maker-function for get property.
 *
 * @param {Model<Property>} PropertyModel
 * @return {Function} function to get property
 */
export const makeGetPropertyIsAdmin = (
    PropertyModel: Model<Property>,
): GetPropertyIsAdminFunction => {
  /**
     * Function to get property.
     *
     * @param {User} user user which is attempting to get property
     * @param {string} id of the property to get
     */
  return async function getPropertyIsAdmin(
      user: User, id: string,
  ): Promise<boolean> {
    const property = await PropertyModel.findOne({id: id},
        {
          _id: 0,
          __v: 0,
        });

    // @ts-ignore
    return user._id.toString() === property.admin.toString();
  };
};
