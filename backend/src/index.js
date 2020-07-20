'use strict'

import path from 'path'
import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'
import routes from './routes'
import { errorHandler, formatLog } from './utils'
import { apiPrefix, serverPort, serveClient } from '../config'
import { logger } from './winston.config'
import startWebSocketServer from './websocket'
import connectDb from './database'
const morgan = require('morgan')

const app = express()

app.use(morgan('combined', {
  stream: { write: message => logger.info(message) }
}))

app.use(compression())
app.use(helmet())
// app.use(cors())
app.use(bodyParser.json())

if (serveClient) app.use('/', express.static(path.resolve(__dirname, '../dist')))
else app.get('*', (req, res) => res.status(404).send('Client is not served.'))

app.use(apiPrefix, routes)

app.use(errorHandler)

const setup = async () => {
  await connectDb()
  const server = app.listen(serverPort, () => logger.info(formatLog(`The server was started on http://localhost:${serverPort}`)))
  startWebSocketServer(server)
}

setup()
