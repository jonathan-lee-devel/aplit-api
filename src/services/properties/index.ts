import {makeGetProperty} from './get-property';
import {makeCreateProperty} from './create-property';
import {makeDeleteProperty} from './delete-property';
import {loggerConfig} from '../../config/Logger';
import {transporterConfig} from '../../config/Mail';
import {generateId} from '../id';

const logger = loggerConfig();
const transporter = transporterConfig();

export const getProperty = makeGetProperty();

export const createProperty = makeCreateProperty(
    logger,
    transporter,
    generateId,
);

export const deleteProperty = makeDeleteProperty(
    logger,
);
