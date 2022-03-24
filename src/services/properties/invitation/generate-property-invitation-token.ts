import {PropertyInvitationToken}
  from '../../../models/properties/invitation/PropertyInvitationToken';
import {randomBytes} from 'crypto';
import {addDays} from 'date-fns';
import {Property} from '../../../models/properties/Property';
import {Model} from 'mongoose';
import {GeneratePropertyInvitationTokenFunction} from '../index';

/**
 * Maker-function to generate property invitation token.
 *
 * @param {Model<Property>} PropertyModel property model
 * @return {GeneratePropertyInvitationTokenFunction} function to generate token
 */
export const makeGeneratePropertyInvitationToken = (
    PropertyModel: Model<Property>,
): GeneratePropertyInvitationTokenFunction => {
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
    const property = await PropertyModel.findOne({id: propertyId});

    return {
      value: randomBytes(tokenSize).toString('hex'),
      expiryDate: addDays(new Date(), expiryTimeDays),
      property: property._id,
    };
  };
};
