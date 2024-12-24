import { WebSocketServer, WebSocket } from 'ws'
import http from 'http'
import { parse } from 'url'

const server = http.createServer()
const wss = new WebSocketServer({ noServer: true })

type GPTUpdate = {
    id: string
    upvotes: number
}

server.on('upgrade', (request, socket, head) => {
    const { pathname } = parse(request.url!)

    if (pathname === '/ws') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request)
        })
    } else {
        socket.destroy()
    }
})

wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected')

    ws.on('message', (message: string) => {
        console.log('Received:', message)

        try {
            const update: GPTUpdate = JSON.parse(message)
            broadcastUpdate(update)
        } catch (error) {
            console.error('Error parsing message:', error)
        }
    })

    ws.on('close', () => {
        console.log('Client disconnected')
    })
})

function broadcastUpdate(update: GPTUpdate) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(update))
        }
    })
}

const PORT = process.env.WS_PORT || 8080
server.listen(PORT, () => {
    console.log(`WebSocket server is running on port ${PORT}`)
})

export { broadcastUpdate }

