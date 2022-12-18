import express from 'express'
import http from 'http'
import WebSocket from 'ws'
import yargs from 'yargs'
import * as zmq from 'zeromq'
const app = express()
const PORT = yargs.argv.http || 8080

const server = http.createServer(app)

let pubSocket
async function initializeSockets () {
  pubSocket = new zmq.Publisher()
  await pubSocket.bind(`tcp://127.0.0.1:${yargs.argv.pub}`)
  const subSocket = new zmq.Subscriber()
  const subPorts = [].concat(yargs.argv.sub)
  for (const port of subPorts) {
    console.log(`Subscribing to ${port}`)
    subSocket.connect(`tcp://127.0.0.1:${port}`)
  }
  subSocket.subscribe('chat')
  for await (const [msg] of subSocket) {
    console.log(`Message from another server: ${msg}`)
    const message = checkIsbinary(msg) ? msg : msg.toString()
    broadcast(message)
  }
}

initializeSockets()
const wss = new WebSocket.Server({ server })

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected')

  ws.on('message', (msg, isBinary) => {
    const message = isBinary ? msg : msg.toString()
    broadcast(message)
    pubSocket.send(`chatPORT:${PORT} ${msg}`)
  })

  ws.on('close', () => {
    console.log('Client disconnected')
  })
})

function broadcast (msg) {
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg)
    }
  }
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/www/index.html')
})

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
function checkIsbinary (str) {
  let isBinary = false
  for (let i = 0; i < str.length; i++) {
    if (str[i] == '0' || str[i] == '1') {
      isBinary = true
    } else {
      isBinary = false
    }
  }
  return isBinary
}
