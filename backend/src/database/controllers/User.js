'use strict'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import UserModel from '../models/User'
import { TEST_MODE, jwtSecret } from '../../../config'
import { dbLogger } from '../../winston.config'
import { formatLog, formatError } from '../../utils'

export default class User {
  static get Model() {
    return UserModel
  }

  static log(data, format = true) {
    if (!TEST_MODE) dbLogger.info(format ? formatLog(data) : data)
  }

  static async register(username, password) {
    try {
      // Hash the password and create the user
      const hash = await bcrypt.hash(password, 10)
      const doc = await UserModel.create({ username, password: hash })

      this.log(`New user was created. username=${username}, id=${doc.id}`)
      return doc.username
    }
    catch (err) {
      this.log(formatError(err), false)
      throw new Error(`Could not create the user. ${err.message}`)
    }
  }

  static async login(username, password) {
    try {
      const user = await UserModel.findOne({ username }).select('+password')
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) throw new Error('Invalid password')

      const token = jwt.sign({
        id: user._id,
        username: user.username,
        role: user.role
      }, jwtSecret)

      this.log(`User logged in. username=${user.username}, id=${user.id}`)
      return {
        token,
        username: user.username,
        role: user.role
      }
    }
    catch (err) {
      this.log(formatError(err), false)
      throw new Error('Invalid username or password.')
    }
  }

  static async delete(userId) {
    const doc = await UserModel.findByIdAndDelete(userId)
    this.log(`A user was deleted. id=${doc.id}`)
    return doc.id
  }

  static async find(userId) {
    let user = await UserModel.findById(userId)
    user.__v = undefined
    return user
  }
}
