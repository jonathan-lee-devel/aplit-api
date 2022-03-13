import {PropertyInvitationToken}
  from '../../../models/properties/invitation/PropertyInvitationToken';
import {randomBytes} from 'crypto';
import {addDays} from 'date-fns';
import {Property} from '../../../models/properties/Property';
import {Model} from 'mongoose';

/**
 * Maker-function to generate property invitation token.
 *
 * @param {Model<Property>} propertyModel property model
 * @return {Function} function to generate property invitation token
 */
export const makeGeneratePropertyInvitationToken = (
    propertyModel: Model<Property>,
) => {
  /**
   * Function to generate property invitation token.
   *
   * @param {number} tokenSize size of the token to generate
   * @param {number} expiryTimeDays number of days before token expires
   * @param {string} propertyId id of the property for the invitation
   * @return {Promise<PropertyInvitationToken>} generated token
   */
  return async function generatePropertyInvitationToken(
      tokenSize: number,
      expiryTimeDays: number,
      propertyId: string,
  ): Promise<PropertyInvitationToken> {
    const property = await propertyModel.findOne({id: propertyId});

    return {
      value: randomBytes(tokenSize).toString('hex'),
      expiryDate: addDays(new Date(), expiryTimeDays),
      property: property._id,
    };
  };
};
