import {makeGetProperty} from './get-property';
import {makeCreateProperty} from './create-property';
import {makeDeleteProperty} from './delete-property';
import {loggerConfig} from '../../config/Logger';
import {generateId} from '../id';
import {mailerConfig} from '../../config/Mail';
import {makeGeneratePropertyInvitationToken}
  from './invitation/generate-property-invitation-token';
import {PropertyModel} from '../../models/properties/Property';

const logger = loggerConfig();
const mailer = mailerConfig();

export const getProperty = makeGetProperty();

export const generatePropertyInvitationToken =
    makeGeneratePropertyInvitationToken(PropertyModel);

export const createProperty = makeCreateProperty(
    logger,
    mailer,
    generateId,
    PropertyModel,
    async () => {},
);

export const deleteProperty = makeDeleteProperty(
    logger,
);
