import { NextResponse } from 'next/server'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(request: Request) {

    const OWNER = process.env.GITHUB_OWNER
    const REPO = process.env.GITHUB_REPO
    const TOKEN = process.env.GITHUB_TOKEN

    try {
        const { gptName, gptId, category } = await request.json()

        const getCurrentReadme = await fetch(
            `https://api.github.com/repos/${OWNER}/${REPO}/contents/README.md`,
            {
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            }
        )

        if (!getCurrentReadme.ok) {
            throw new Error('Failed to fetch README from GitHub')
        }

        const currentReadmeData = await getCurrentReadme.json()
        const currentContent = Buffer.from(currentReadmeData.content, 'base64').toString()
        const lines = currentContent.split('\n')

        const manager = {
            totalCount: 0,
            roundedCount: '300+',
            categories: new Set<string>(),
            content: [] as string[]
        }

        const snapshot = await getDocs(collection(db, 'gpts_live'))
        manager.totalCount = snapshot.size + 1
        manager.roundedCount = `${Math.floor(manager.totalCount / 50) * 50}+`

        let currentCategory = ''
        let categorySection = false

        lines.forEach(line => {
            if (line.includes('AI tools and GPTs...')) {
                manager.content.push(line.replace(/\d+\+/, manager.roundedCount))
                return
            }

            if (line.startsWith('## ') && !line.includes('Categories')) {
                currentCategory = line.substring(3)
                manager.categories.add(currentCategory)
                categorySection = true
            }

            if (!manager.categories.has(category) && line.startsWith('## Categories')) {
                manager.categories.add(category)
                const allCategories = Array.from(manager.categories).sort()
                manager.content.push(line)
                manager.content.push('')
                allCategories.forEach(cat => {
                    manager.content.push(`- [${cat}](#${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')})`)
                })
                return
            }

            if (currentCategory === category && categorySection) {
                const gptLink = `- [${gptName}](https://gptz.directory/gpt/${gptId})`
                const existingGPTs = lines.filter(l => l.startsWith('- [') && !l.includes(gptName))
                existingGPTs.push(gptLink)
                existingGPTs.sort()
                manager.content.push(...existingGPTs)
                categorySection = false
                return
            }

            manager.content.push(line)
        })

        const response = await fetch(
            'https://api.github.com/repos/OWNER/REPO/contents/README.md',
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json',
                },
                body: JSON.stringify({
                    message: `Update README.md - Add ${gptName} to ${category}`,
                    content: Buffer.from(manager.content.join('\n')).toString('base64'),
                    sha: currentReadmeData.sha,
                }),
            }
        )

        if (!response.ok) {
            throw new Error('Failed to update README on GitHub')
        }

        return NextResponse.json({ success: true, roundedCount: manager.roundedCount })
    } catch (error) {
        console.error('Error updating README:', error)
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
