import {StatusDataContainer} from '../../data/StatusDataContainer';
import {PropertyDto} from '../../data/dto/properties/PropertyDto';
import {PropertyModel} from '../../models/properties/Property';
import {Logger} from '../../generic/Logger';
import {DeletePropertyFunction} from './index';
import {User} from '../../models/User';

/**
 * Maker-function for the function to delete properties.
 *
 * @param {Logger} logger used when deleting properties
 * @return {Function} function to delete properties
 */
export const makeDeleteProperty = (
    logger: Logger,
): DeletePropertyFunction => {
  /**
   * Used to delete properties.
   *
   * @param {User} user user attempting to delete the property
   * @param {string} id of the property to delete
   * @return {Promise<StatusDataContainer<PropertyDto>>} property deleted
   */
  return async function deleteProperty(
      user: User,
      id: string,
  ): Promise<StatusDataContainer<PropertyDto>> {
    const property = await PropertyModel.findOne({id});
    if (!property) {
      return {
        status: 404,
        data: undefined,
      };
    }
    // Comparison invalid unless both are strings
    // @ts-ignore
    if (String(property.admin) !== String(user.id)) {
      return {
        status: 403,
        data: undefined,
      };
    }
    try {
      await PropertyModel.deleteOne({id});
    } catch (err) {
      logger.error(`An error has occurred: ${err.message}`);
      return {
        status: 500,
        data: undefined,
      };
    }

    return {
      status: 204,
      // No content response has no response body
      data: undefined,
    };
  };
};
