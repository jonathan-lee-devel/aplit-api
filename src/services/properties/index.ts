import {makeGetProperty} from './get-property';
import {makeCreateProperty} from './create-property';
import {makeDeleteProperty} from './delete-property';
import {loggerConfig} from '../../config/Logger';
import {generateId} from '../id';
import {mailerConfig} from '../../config/Mail';

const logger = loggerConfig();
const mailer = mailerConfig();

export const getProperty = makeGetProperty();

export const createProperty = makeCreateProperty(
    logger,
    mailer,
    generateId,
);

export const deleteProperty = makeDeleteProperty(
    logger,
);
