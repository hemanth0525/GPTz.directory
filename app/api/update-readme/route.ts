import { collection, getCountFromServer } from 'firebase/firestore';
import { NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'
import { Base64 } from 'js-base64'
import { db } from '@/lib/firebase'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN || '' })

const owner = process.env.GITHUB_OWNER || ''
const repo = process.env.GITHUB_REPO || ''
const path = 'README.md'

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/ & /g, '--')
        .replace(/ /g, '-')
}

export async function POST(req: Request) {
    try {
        const { gptName, gptId, category } = await req.json()

        const { data: fileData } = await octokit.repos.getContent({
            owner,
            repo,
            path,
        })

        if ('content' in fileData) {
            const content = Base64.decode(fileData.content)

            const lines = content.split('\n')
            const categories: { [key: string]: string[] } = {}
            let currentCategory = ''
            let aiToolsLineIndex = -1

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i]
                if (line.includes('AI tools and GPTS...')) {
                    aiToolsLineIndex = i
                } else if (line.startsWith('## ') && !line.startsWith('## Categories')) {
                    currentCategory = line.substring(3).trim()
                    categories[currentCategory] = []
                } else if (line.startsWith('- [') && currentCategory) {
                    categories[currentCategory].push(line)
                }
            }

            const newEntry = `- [${gptName}](https://gptz.directory/gpt/${gptId})`
            if (!(category in categories)) {
                categories[category] = []
            }
            categories[category].push(newEntry)

            for (const cat in categories) {
                categories[cat].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            }

            const snapshot = await getCountFromServer(collection(db, 'gpts_live'))
            const totalCount = snapshot.data().count + 1

            const roundedCount = Math.floor(totalCount / 50) * 50
            lines[aiToolsLineIndex] = `${roundedCount}+ AI tools and GPTS...`

            let newContent = lines.slice(0, aiToolsLineIndex + 1).join('\n') + '\n\n'

            const sortedCategories = Object.keys(categories).sort()
            newContent += '## Categories\n\n'
            sortedCategories.forEach(cat => {
                const slug = slugify(cat)
                newContent += `- [${cat}](#${slug})\n`
            })
            newContent += '\n'

            sortedCategories.forEach(cat => {
                newContent += `## ${cat} \n\n${categories[cat].join('\n')}\n\n`
            })

            await octokit.repos.createOrUpdateFileContents({
                owner,
                repo,
                path,
                message: `Add ${gptName} to ${category}`,
                content: Base64.encode(newContent),
                sha: fileData.sha,
            })

            return NextResponse.json({ success: true, message: 'README updated successfully' })
        } else {
            throw new Error('Unable to fetch README content')
        }
    } catch (error) {
        console.error('Error updating README:', error)
        return NextResponse.json({ success: false, error: 'Failed to update README' }, { status: 500 })
    }
}

