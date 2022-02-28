import mongoose from 'mongoose';
const {connect} = mongoose;
import {Logger} from '../generic/Logger';

export const databaseConfig = (logger: Logger) => {
  connect(process.env.DATABASE_URL)
      .then((_) => {
        logger.info(
            `Connected to database: ${process.env.DATABASE_URL}`,
        );
      })
      .catch((err) => {
        logger.error(
            // eslint-disable-next-line max-len
            `Could not connect to database: ${process.env.DATABASE_URL} -> ${err.message}`,
        );
      });
};
