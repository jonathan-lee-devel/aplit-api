import {StatusDataContainer} from '../../data/StatusDataContainer';
import {PropertyDto} from '../../data/dto/properties/PropertyDto';
import {PropertyModel} from '../../models/properties/Property';
import {Logger} from '../../generic/Logger';
import {DeletePropertyFunction} from './index';

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
   * @param {string} id of the property to delete
   * @return {Promise<StatusDataContainer<PropertyDto>>} property deleted
   */
  return async function deleteProperty(
      id: string,
  ): Promise<StatusDataContainer<PropertyDto>> {
    const property = await PropertyModel.findOne({id});
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
