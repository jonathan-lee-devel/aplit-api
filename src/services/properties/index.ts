import {makeGetProperty} from './get-property';
import {makeCreateProperty} from './create-property';
import {makeDeleteProperty} from './delete-property';
import {loggerConfig} from '../../config/Logger';
import {generateId} from '../id';
import {mailerConfig} from '../../config/Mail';
import {makeGeneratePropertyInvitationToken}
  from './invitation/generate-property-invitation-token';
import {PropertyModel} from '../../models/properties/Property';
import {makeCreatePropertyInvitation}
  from './invitation/create-property-invitation';
import {PropertyInvitationTokenModel}
  from '../../models/properties/invitation/PropertyInvitationToken';
import {PropertyInvitationModel}
  from '../../models/properties/invitation/PropertyInvitation';
import {makeSendPropertyInvitation}
  from './invitation/send-property-invitation';

const logger = loggerConfig();
const mailer = mailerConfig();

export const getProperty = makeGetProperty();

export const generatePropertyInvitationToken =
    makeGeneratePropertyInvitationToken(PropertyModel);

export const createPropertyInvitation = makeCreatePropertyInvitation(
    logger,
    generateId,
    generatePropertyInvitationToken,
    PropertyInvitationTokenModel,
    PropertyInvitationModel,
);

export const sendPropertyInvitation = makeSendPropertyInvitation(
    logger,
    mailer,
);

export const createProperty = makeCreateProperty(
    logger,
    mailer,
    generateId,
    PropertyModel,
    createPropertyInvitation,
    sendPropertyInvitation,
);

export const deleteProperty = makeDeleteProperty(
    logger,
);
