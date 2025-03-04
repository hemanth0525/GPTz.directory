import { Metadata } from 'next'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

type Props = {
    params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const gptDoc = await getDoc(doc(db, 'gpts_live', params.id))
    const gpt = gptDoc.data()

    if (!gpt) {
        return {
            title: 'GPT Not Found | GPTz.directory',
            description: 'The requested GPT tool could not be found on GPTz.directory.'
        }
    }

    return {
        title: `${gpt.name} | GPTz.directory`,
        description: gpt.shortDescription || 'Explore the latest GPT tools on GPTz.directory.',
        keywords: gpt.keywords?.join(', ') || 'AI, GPT, tools, AI tools, GPTz.directory',
        openGraph: {
            title: gpt.name,
            description: gpt.shortDescription || 'Explore the latest GPT tools on GPTz.directory.',
            url: `https://gptz.directory/gpt/${params.id}`
        },
    }
}


export default function GPTLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}