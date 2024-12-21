import { ReadmeManager } from '@/lib/types'

export async function updateReadmeWithGPT(gptName: string, gptId: string, category: string, manager: ReadmeManager) {
    try {
        const githubResponse = await fetch('/api/update-readme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: manager.content.join('\n'),
                gptName,
                gptId,
                category,
            }),
        });

        if (!githubResponse.ok) {
            throw new Error('Failed to update README on GitHub');
        }

        const githubUpdateResult = await githubResponse.json();
        if (!githubUpdateResult.success) {
            throw new Error(githubUpdateResult.error || 'Unknown error updating README on GitHub');
        }

        return {
            success: true,
            roundedCount: manager.roundedCount,
        }
    } catch (error) {
        console.error('Error updating README:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

