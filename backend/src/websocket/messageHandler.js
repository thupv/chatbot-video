'use strict'

import { formatLog } from '../utils'
import { TEST_MODE } from '../../config'
import { wsLogger } from '../winston.config'

const messageHandler = ws => async data => {
  let json
  try {
    json = JSON.parse(data)
  }
  catch (err) {
    throw new Error('Invalid JSON data.')
  }

  // if (!TEST_MODE) wsLogger.info(formatLog(json, 'message'))
  ws.send('{"message":"ok"}')
}

export default messageHandler
