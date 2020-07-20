'use strict'

import createYoutubeSearchChatBot from "../bot/YoutubeSearchChatBot";

const socketio = require('socket.io');
import {formatLog, formatError, generateMessage} from '../utils'
import {TEST_MODE} from '../../config'
import {wsLogger} from '../winston.config'
import messageHandler from './messageHandler'

export const errorHandler = ws => err => {
  const errStr = formatError(err)
  ws.send(JSON.stringify(errStr))
  if (!TEST_MODE) wsLogger.error(errStr)
}

const createWsServer = httpServer => {
  const io = socketio(httpServer)
  io.on('connection', (socket) => {
    console.log('New user connected!');
    let user = {
      name: ''
    }
    let bot;
    socket.on('join', (options, callback) => {
      user.name = options.username;
      bot = createYoutubeSearchChatBot(user);
      bot.talk().then((msg) => {
        socket.emit('message', generateMessage('Bot', msg));
      })
      callback();
    });

    socket.on('sendMessage', (message, callback) => {
      const msg = {
        messages: [message]
      }
      socket.emit('message', generateMessage(user.name, msg));
      bot.talk(message).then((msg) => {
        socket.emit('message', generateMessage('Bot', msg));
      });
      callback();
    });

    socket.on('disconnect', () => {

    });
  });
}

export default createWsServer
