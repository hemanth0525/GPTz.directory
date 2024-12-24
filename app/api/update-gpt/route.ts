import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { Octokit } from '@octokit/rest'
import WebSocket from 'ws'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

const wsUrl = process.env.WEBSOCKET_URL || 'ws://localhost:8080/ws'
const ws = new WebSocket(wsUrl)

ws.on('open', () => {
    console.log('Connected to WebSocket server')
})

ws.on('error', (error: Error) => {
    console.error('WebSocket error:', error)
})

export async function POST(req: Request) {
    const { id, upvotes } = await req.json()

    try {
        // Read the current gpts_live.json
        const filePath = path.join(process.cwd(), 'public', 'gpts_live.json')
        const fileContent = await fs.readFile(filePath, 'utf-8')
        const gpts = JSON.parse(fileContent)

        // Update the GPT
        if (gpts[id]) {
            gpts[id].upvotes = upvotes
        }

        // Write the updated data back to the file
        await fs.writeFile(filePath, JSON.stringify(gpts, null, 2))

        // Update the file in the GitHub repo
        const content = Buffer.from(JSON.stringify(gpts, null, 2)).toString('base64')
        await octokit.repos.createOrUpdateFileContents({
            owner: process.env.GITHUB_OWNER!,
            repo: process.env.GITHUB_REPO!,
            path: 'public/gpts_live.json',
            message: `Update GPT ${id}`,
            content,
            sha: ((await octokit.repos.getContent({
                owner: process.env.GITHUB_OWNER!,
                repo: process.env.GITHUB_REPO!,
                path: 'public/gpts_live.json',
            })).data as { sha: string }).sha,
        })

        // Send WebSocket message
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ id, upvotes }))
        } else {
            console.error('WebSocket is not open. Current state:', ws.readyState)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating GPT:', error)
        return NextResponse.json({ success: false, error: 'Failed to update GPT' }, { status: 500 })
    }
}

