'use strict'

import boom from '@hapi/boom'
import expressJwt from 'express-jwt'
import { jwtSecret } from '../../config'

export const checkJwt = expressJwt({ secret: jwtSecret })

export const checkNoJwt = (req, res, next) => {
  if (req.headers.authorization)
    throw boom.conflict('You can\'t access this resource with a authorization header token set.')
  next()
}

export const checkJwtRole = neededRole => (req, res, next) => {
  if (req.user && req.user.role === neededRole)
    return next()
  throw boom.forbidden(`You need the "${neededRole}" role to access this resource.`)
}
