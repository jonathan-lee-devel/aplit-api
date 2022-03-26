import {Logger} from '../../../generic/Logger';
import {Model} from 'mongoose';
import {PropertyInvitationToken} from
  '../../../models/properties/invitation/PropertyInvitationToken';
import {PropertyInvitation} from
  '../../../models/properties/invitation/PropertyInvitation';
import {GetPropertyIdFromInvitationTokenFunction} from '../index';

export const makeGetPropertyIdFromInvitationToken = (
    logger: Logger,
    PropertyInvitationTokenModel: Model<PropertyInvitationToken>,
    PropertyInvitationModel: Model<PropertyInvitation>,
): GetPropertyIdFromInvitationTokenFunction => {
  return async function(tokenValue: string) {
    const token =
            await PropertyInvitationTokenModel
                .findOne({value: tokenValue});

    const invitation =
            await PropertyInvitationModel
                .findOne({propertyInvitationToken: token});

    return invitation.propertyId;
  };
};
