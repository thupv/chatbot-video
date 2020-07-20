'use strict'

export const PRODUCTION_MODE = process.env.NODE_ENV === 'production'
export const TEST_MODE = process.env.NODE_ENV === 'test'
export const apiPrefix = '/api'
export const serverPort = parseInt(process.env.PORT, 10) || 5000
export const mongoDatabaseURI = process.env.MONGO_URI || 'mongodb://localhost:27017/myappdb'
export const serveClient = process.env.SERVE_CLIENT === 'true' || true
export const jwtSecret = process.env.SECRET || 'app-secret'
