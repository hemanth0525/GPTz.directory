import { collection, getCountFromServer } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { Base64 } from 'js-base64';
import { db } from '@/lib/firebase';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN || '' });

const owner = process.env.GITHUB_OWNER || '';
const repo = process.env.GITHUB_REPO || '';
const readmePath = 'README.md';
const jsonPath = 'public/gpts-live.json';

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/ & /g, '--')
        .replace(/ /g, '-');
}

export async function POST(req: Request) {
    try {
        const { gptName, gptId, category, shortDescription, longDescription, url, tags, launchDate, upvotes } = await req.json();

        /** 📝 Fetch and Update README.md */
        const { data: readmeFile } = await octokit.repos.getContent({ owner, repo, path: readmePath });
        if (!('content' in readmeFile)) throw new Error('Unable to fetch README');

        const readmeContent = Base64.decode(readmeFile.content);
        const lines = readmeContent.split('\n');
        const categories: { [key: string]: string[] } = {};
        let currentCategory = '';
        let aiToolsLineIndex = -1;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('AI tools and GPTS...')) {
                aiToolsLineIndex = i;
            } else if (line.startsWith('## ') && !line.startsWith('## Categories')) {
                currentCategory = line.substring(3).trim();
                categories[currentCategory] = [];
            } else if (line.startsWith('- [') && currentCategory) {
                categories[currentCategory].push(line);
            }
        }

        const newEntry = `- [${gptName}](https://gptz.directory/gpt/${gptId})`;
        if (!(category in categories)) {
            categories[category] = [];
        }
        categories[category].push(newEntry);
        for (const cat in categories) {
            categories[cat].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        }

        const snapshot = await getCountFromServer(collection(db, 'gpts_live'));
        const totalCount = snapshot.data().count + 1;
        const roundedCount = Math.floor(totalCount / 50) * 50;
        lines[aiToolsLineIndex] = `${roundedCount}+ AI tools and GPTS...`;

        let newReadmeContent = lines.slice(0, aiToolsLineIndex + 1).join('\n') + '\n\n';
        const sortedCategories = Object.keys(categories).sort();
        newReadmeContent += '## Categories\n\n';
        sortedCategories.forEach(cat => {
            const slug = slugify(cat);
            newReadmeContent += `- [${cat}](#${slug})\n`;
        });
        newReadmeContent += '\n';
        sortedCategories.forEach(cat => {
            newReadmeContent += `## ${cat} \n\n${categories[cat].join('\n')}\n\n`;
        });

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: readmePath,
            message: `Add ${gptName} to ${category}`,
            content: Base64.encode(newReadmeContent),
            sha: readmeFile.sha,
        });

        /** 📝 Fetch and Update gpts-live.json */
        const { data: jsonFile } = await octokit.repos.getContent({ owner, repo, path: jsonPath });
        if (!('content' in jsonFile)) throw new Error('Unable to fetch gpts-live.json');

        const jsonContent = Base64.decode(jsonFile.content);
        const gptsLive = JSON.parse(jsonContent);

        gptsLive[slugify(gptName)] = {
            url,
            launchDate,
            category,
            name: gptName,
            tags,
            shortDescription,
            longDescription,
            upvotes,
            comments: [],
        };

        /** 🔤 Sort Entries Alphabetically */
        const sortedGPTs = Object.fromEntries(
            Object.entries(gptsLive).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        );

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: jsonPath,
            message: `Update gpts-live.json with ${gptName}`,
            content: Base64.encode(JSON.stringify(sortedGPTs, null, 2)),
            sha: jsonFile.sha,
        });

        return NextResponse.json({ success: true, message: 'README and gpts-live.json updated successfully' });
    } catch (error) {
        console.error('Error updating files:', error);
        return NextResponse.json({ success: false, error: 'Failed to update files' }, { status: 500 });
    }
}
