import {makeGetProperty} from './get-property';
import {makeCreateProperty} from './create-property';
import {makeDeleteProperty} from './delete-property';
import {loggerConfig} from '../../config/Logger';
import {generateId} from '../id';
import {makeGeneratePropertyInvitationToken}
  from './invitation/generate-property-invitation-token';
import {PropertyModel} from '../../models/properties/Property';
import {makeCreatePropertyInvitation}
  from './invitation/create-property-invitation';
import {PropertyInvitationToken, PropertyInvitationTokenModel}
  from '../../models/properties/invitation/PropertyInvitationToken';
import {PropertyInvitation, PropertyInvitationModel}
  from '../../models/properties/invitation/PropertyInvitation';
import {makeSendPropertyInvitation}
  from './invitation/send-property-invitation';
import {makeInviteToProperty} from './invitation/invite-to-property';
import {User} from '../../models/User';
import {StatusDataContainer} from '../../data/StatusDataContainer';
import {PropertyDto} from '../../data/dto/properties/PropertyDto';
import {PropertyInvitationStatus} from
  './enum/invitation/property-invitation-status';
import {makeConfirmPropertyInvitation} from
  './invitation/confirm-property-invitation';
import {makeGetPropertyIdFromInvitationToken} from
  './invitation/get-property-id-from-invitation-token';
import {sendMail} from '../email';
import {makeGetPropertiesForUserAsAdmin} from
  './get-properties-for-user-as-admin';
import {makeGetPropertiesForUserAsTenant} from
  './get-properties-for-user-as-tenant';
import {makeGetPropertyIsAdmin} from './get-property-is-admin';

const logger = loggerConfig();

export type GetPropertyFunction = (
    user: User,
    id: string
) => Promise<StatusDataContainer<PropertyDto>>;
export const getProperty = makeGetProperty(PropertyModel);

export type GetPropertyIsAdminFunction = (
    user: User,
    id: string,
) => Promise<boolean>;
export const getPropertyIsAdmin = makeGetPropertyIsAdmin(PropertyModel);

export type GeneratePropertyInvitationTokenFunction = (
    tokenSize: number,
    expiryTimeDays: number,
    propertyId: string,
) => Promise<PropertyInvitationToken>;
export const generatePropertyInvitationToken =
    makeGeneratePropertyInvitationToken(PropertyModel);


export type CreatePropertyInvitationFunction = (
    propertyId: string,
    inviteeEmail: string,
    inviterEmail: string,
) => Promise<StatusDataContainer<PropertyInvitation>>;
const createPropertyInvitation = makeCreatePropertyInvitation(
    logger,
    generateId,
    generatePropertyInvitationToken,
    PropertyInvitationTokenModel,
    PropertyInvitationModel,
);

export type SendPropertyInvitationFunction = (
    propertyInvitationTokenValue: string,
    inviterEmail: string,
    inviteeEmail: string,
) => void;
const sendPropertyInvitation = makeSendPropertyInvitation(
    logger,
    sendMail,
);

export type InviteToPropertyFunction = (
    propertyId: string,
    inviterEmail: string,
    inviteeEmail: string)
    => void;
export const inviteToProperty = makeInviteToProperty(
    logger,
    createPropertyInvitation,
    sendPropertyInvitation,
);

export type CreatePropertyFunction = (
    title: string,
    tenantEmails: string[],
    createdBy: User,
    admin: User,
) => Promise<StatusDataContainer<PropertyDto>>;
export const createProperty = makeCreateProperty(
    logger,
    generateId,
    PropertyModel,
    inviteToProperty,
);

export type DeletePropertyFunction = (
    user: User,
    id: string,
) => Promise<StatusDataContainer<PropertyDto>>;
export const deleteProperty = makeDeleteProperty(
    logger,
);

export type ConfirmPropertyInvitationFunction = (
    tokenValue: string,
) => Promise<PropertyInvitationStatus>;
export const confirmPropertyInvitation = makeConfirmPropertyInvitation(
    logger,
    PropertyInvitationTokenModel,
    PropertyInvitationModel,
);

export type GetPropertyIdFromInvitationTokenFunction = (
    tokenValue: string,
) => Promise<string>;
export const getPropertyIdFromInvitationToken =
    makeGetPropertyIdFromInvitationToken(
        logger,
        PropertyInvitationTokenModel,
        PropertyInvitationModel,
    );

export type GetPropertiesForUserAsAdminFunction = (
    user: User
) => Promise<StatusDataContainer<PropertyDto[]>>;
export const getPropertiesForUserAsAdmin =
    makeGetPropertiesForUserAsAdmin(PropertyModel);

export type GetPropertiesForUserAsTenantFunction = (
    user: User,
) => Promise<StatusDataContainer<PropertyDto[]>>;
export const getPropertiesForUserAsTenant =
    makeGetPropertiesForUserAsTenant(PropertyModel);
