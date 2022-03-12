import {makeGetProperty} from './get-property';
import {makeCreateProperty} from './create-property';
import {makeDeleteProperty} from './delete-property';
import {makeCreatePropertyInvitation} from './create-property-invitation';
import {loggerConfig} from '../../config/Logger';
import {generateId} from '../id';
import {mailerConfig} from '../../config/Mail';
import {makeConfirmPropertyInvitation} from './confirm-property-invitation';
import {PropertyInvitationModel}
  from '../../models/properties/PropertyInvitation';
import {PropertyModel} from '../../models/properties/Property';

const logger = loggerConfig();
const mailer = mailerConfig();

export const getProperty = makeGetProperty();

export const createPropertyInvitation = makeCreatePropertyInvitation(
    logger,
    generateId,
);

export const confirmPropertyInvitation = makeConfirmPropertyInvitation(
    logger,
    PropertyInvitationModel,
    PropertyModel,
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
