'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { GPT } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function EditGPTPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { loading, isAdmin } = useAuth()
    const [gpt, setGpt] = useState<GPT | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)


    useEffect(() => {
        const fetchGPT = async () => {
            const docRef = doc(db, 'gpts_live', params.id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setGpt({ id: docSnap.id, ...docSnap.data() } as GPT)
            }
            setIsLoading(false)
        }

        if (!loading && !isAdmin) {
            router.push('/admin/login')
        } else if (!loading && isAdmin) {
            fetchGPT()
        }
    }, [loading, isAdmin, router, params.id])
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!gpt) return

        setIsSaving(true)
        const gptRef = doc(db, 'gpts_live', params.id)

        try {
            await updateDoc(gptRef, {
                name: gpt.name,
                shortDescription: gpt.shortDescription,
                longDescription: gpt.longDescription,
                url: gpt.url,
                tags: gpt.tags,
                launchDate: gpt.launchDate,
            })
            router.push(`/gpt/${params.id}`)
        } catch (error) {
            console.error('Error updating GPT:', error)
            alert('Failed to update GPT. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    if (loading || isLoading) {
        return (
            <LoadingSpinner />
        )
    }

    if (!isAdmin) {
        return null
    }

    if (!gpt) {
        router.push('/404')
        return null
    }

    return (
        <div className="min-h-screen space-bg p-8">
            <div className="max-w-4xl mx-auto">
                <Link href={`/gpt/${params.id}`}>
                    <Button variant="ghost" className="mb-8">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to GPT
                    </Button>
                </Link>
                <div className="bg-card text-card-foreground p-8 rounded-lg glass-effect">
                    <h1 className="text-3xl font-bold mb-6">Edit GPT: {gpt.name}</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={gpt.name}
                                onChange={(e) => setGpt({ ...gpt, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="shortDescription">Short Description</Label>
                            <Input
                                id="shortDescription"
                                value={gpt.shortDescription}
                                onChange={(e) => setGpt({ ...gpt, shortDescription: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="longDescription">Long Description</Label>
                            <Textarea
                                id="longDescription"
                                value={gpt.longDescription}
                                onChange={(e) => setGpt({ ...gpt, longDescription: e.target.value })}
                                rows={10}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="url">URL</Label>
                            <Input
                                id="url"
                                type="url"
                                value={gpt.url}
                                onChange={(e) => setGpt({ ...gpt, url: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Input
                                id="tags"
                                value={gpt.tags.join(', ')}
                                onChange={(e) => setGpt({ ...gpt, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="launchDate">Launch Date</Label>
                            <Input
                                id="launchDate"
                                type="date"
                                value={gpt.launchDate.split('T')[0]}
                                onChange={(e) => setGpt({ ...gpt, launchDate: new Date(e.target.value).toISOString() })}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

