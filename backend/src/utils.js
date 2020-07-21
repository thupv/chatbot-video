'use strict'

import boom from '@hapi/boom'
import { logger } from './winston.config'
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

export const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    next(err)
  })
}

export const errorHandler = (err, req, res, next) => {
  if (!err.isBoom) {
    if (err instanceof SyntaxError && err.status === 400 && err.hasOwnProperty('body'))
      err = boom.badRequest(err)
    else if (err.name === 'UnauthorizedError')
      err = boom.unauthorized(err)
    else {
      err = boom.internal(err)
    }
  }

  const { output: { payload } } = err

  let errorLogged = new Error(`Error ${payload.statusCode} - ${payload.error} - Message :\n${payload.message}`)
  errorLogged.stack = err.stack
  logger.error(formatError(errorLogged, err.data))

  res.status(payload.statusCode).json({
    message: err.message || payload.message,
    data: err.data || undefined
  })

  next()
}

export const checkRequiredParameters = (requiredParameters, parameters) => {
  if (!requiredParameters.every(aRequiredParameter => parameters.hasOwnProperty(aRequiredParameter)))
    throw boom.badRequest(`Missing parameter(s). Required parameters : ${requiredParameters.join(', ')}.`)
}

export const formatLog = (data, event = undefined) => (({
  event,
  log: data,
  date: new Date()
}))

export const formatError = (errObj, data = undefined) => formatLog({ error: errObj.message, stack: errObj.stack, data })

export const generateMessage = (username, data) => {
  return {
    id: uuidv4(),
    username,
    data,
    createdAt: moment().valueOf()
  };
};

export function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
