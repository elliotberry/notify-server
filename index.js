import http from 'http'
import { StringDecoder } from 'string_decoder'
import { exec } from 'node:child_process'

async function notify(msg) {
    // Command to turn on the relay
    exec(`termux-notification --content '${msg}'`)
}

// Create an instance of the HTTP server
const server = http.createServer(async (req, res) => {
    if (req.method === 'POST') {
        // Collect the data sent in the POST request
        const decoder = new StringDecoder('utf-8')
        let buffer = ''

        req.on('data', (data) => {
            buffer += decoder.write(data)
        })

        req.on('end', () => {
            buffer += decoder.end()

            // Try to parse the payload as JSON, log as string if it fails
            try {
                const payload = JSON.parse(buffer)
                notify('Received payload:', payload)
            } catch (err) {
                notify('Received payload (raw):', buffer)
            }

            // Send a response to acknowledge the webhook
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(
                JSON.stringify({ message: 'Webhook received and processed' })
            )
        })
    } else {
        // Respond to non-POST requests
        res.writeHead(405)
        res.end()
    }
})

// Start the server on port 3000
const PORT = 3000
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})

// Call the main function
;(async function main() {
    console.log('Server is running...')
})()
