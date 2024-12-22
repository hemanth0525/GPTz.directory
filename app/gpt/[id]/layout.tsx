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
            title: 'GPT Not Found | GPTz.directory'
        }
    }

    return {
        title: `${gpt.name} - ${gpt.shortDescription} | GPTz.directory`,
    }
}

export default function GPTLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}