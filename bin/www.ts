#!/usr/bin/env node
/* eslint-disable import/first */
/* eslint-disable no-console */

/**
 * Module dependencies.
 */

import dotenv from 'dotenv'

dotenv.config()

import debugInit from 'debug'
import * as http from 'http'
import { AddressInfo } from 'net'
import app from '../app'

const debug = debugInit('server:server')

/**
 * Create HTTP server.
 */

const server = http.createServer(app)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): number | boolean | string {
  const port = parseInt(val, 10)

  if (Number.isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: Error & { syscall: string, code: string }) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${String(port)}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(): void {
  const addr: string | AddressInfo | null = server.address()
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${String(addr?.port)}`
  debug(`Listening on ${bind}`)
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
