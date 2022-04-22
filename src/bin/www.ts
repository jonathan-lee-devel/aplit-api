#!/usr/bin/env node

/**
 * Module dependencies.
 */
import {app} from '../app';

import https from 'https';
import fs from 'fs';

import debug from 'debug';

debug('express-sandbox:server');
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTPS server.
 */
const options = {
  key: fs
      .readFileSync(
          '/etc/letsencrypt/live/api.split.jonathanlee.io/privkey.pem'),
  cert: fs
      .readFileSync(
          '/etc/letsencrypt/live/api.split.jonathanlee.io/fullchain.pem'),
};
const server = https.createServer(options, app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 *
 * @param {Object} val value to be normalized
 * @return {number | string | boolean} normalized port number
 */
function normalizePort(val: any) {
  const thisPort = parseInt(val, 10);

  if (isNaN(thisPort)) {
    // named pipe
    return val;
  }

  if (thisPort >= 0) {
    // port number
    return thisPort;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 *
 * @param {Object} error error to be handled.
 */
function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const address = server.address();
  const bind =
    typeof address === 'string' ? 'pipe ' + address : 'port ' + address.port;
  debug('Listening on ' + bind);
}
