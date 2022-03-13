import {makeGetProperty} from './get-property';
import {makeCreateProperty} from './create-property';
import {makeDeleteProperty} from './delete-property';
import {loggerConfig} from '../../config/Logger';
import {generateId} from '../id';
import {mailerConfig} from '../../config/Mail';
import {makeGeneratePropertyInvitationToken}
  from './invitation/generate-property-invitation-token';
import {makeCreatePropertyInvitation}
  from './invitation/create-property-invitation';

const logger = loggerConfig();
const mailer = mailerConfig();

export const getProperty = makeGetProperty();

export const generatePropertyInvitationToken =
    makeGeneratePropertyInvitationToken();

export const createPropertyInvitation = makeCreatePropertyInvitation(
    logger,
    mailer,
    generateId,
    generatePropertyInvitationToken,
);

export const createProperty = makeCreateProperty(
    logger,
    mailer,
    generateId,
    createPropertyInvitation,
);

export const deleteProperty = makeDeleteProperty(
    logger,
);
