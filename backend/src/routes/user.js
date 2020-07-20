'use strict'

import express from 'express'
import boom from '@hapi/boom'

import {asyncMiddleware} from '../utils'
import db from '../database/controllers'
import {checkJwt, checkJwtRole} from '../middlewares/auth'


const router = express.Router()

router.get('/profile', checkJwt, asyncMiddleware(async (req, res) => {
  const data = await db.User.find(req.user.id)
    .catch(err => {
      throw boom.boomify(err, {statusCode: 500})
    })
  res.json({data})
}))

router.get('/profile/:id', checkJwt, checkJwtRole('admin'), asyncMiddleware(async (req, res) => {
  const data = await db.User.find(req.params.id)
    .catch(() => {
      throw boom.notFound('User was not found.')
    })
  res.json({data})
}))

export default router
