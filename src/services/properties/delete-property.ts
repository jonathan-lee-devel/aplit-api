import {StatusContainerDto} from '../../dto/StatusContainerDto';
import {PropertyDto} from '../../dto/PropertyDto';
import {PropertyModel} from '../../models/properties/Property';
import {Logger} from '../../generic/Logger';

/**
 * Maker-function for the function to delete properties.
 *
 * @param {Logger} logger used when deleting properties
 * @return {Function} function to delete properties
 */
export const makeDeleteProperty = (
    logger: Logger,
) => {
  /**
   * Used to delete properties.
   *
   * @param {string} id of the property to delete
   * @return {Promise<StatusContainerDto<PropertyDto>>} property deleted
   */
  return async function deleteProperty(
      id: string,
  ): Promise<StatusContainerDto<PropertyDto>> {
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
      data: property,
    };
  };
};
