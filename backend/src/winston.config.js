'use strict'

import winston from 'winston'

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/server.combined.log' }),
    new winston.transports.File({ filename: 'logs/server.error.log', level: 'error' }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: winston.format.json()
    })
  ],
  exitOnError: false
})

export const wsLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/ws.log' }),
    new winston.transports.File({ filename: 'logs/ws.error.log', level: 'error' }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: winston.format.json()
    })
  ],
  exitOnError: false
})

export const dbLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/db.log' }),
    new winston.transports.File({ filename: 'logs/db.error.log', level: 'error' }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: winston.format.json()
    })
  ],
  exitOnError: false
})
