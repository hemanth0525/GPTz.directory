import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { ThumbsUp, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { GPT } from '@/lib/types'
import { motion, useSpring, useMotionValue } from 'framer-motion'

function formatDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    const suffix = ['th', 'st', 'nd', 'rd'][day % 10 > 3 ? 0 : ((day % 100 - day % 10) !== 10) ? day % 10 : 0]
    return `${month} ${day}${suffix}, ${year}`
}

interface GPTCardProps {
    gpt: GPT
    onHeightChange: (height: number) => void
    rowHeight?: number
}

export function GPTCard({ gpt, onHeightChange, rowHeight }: GPTCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const upvotes = useMotionValue(gpt.upvotes)
    const springUpvotes = useSpring(upvotes, { stiffness: 100, damping: 30 })

    useEffect(() => {
        if (cardRef.current) {
            onHeightChange(cardRef.current.offsetHeight)
        }
    }, [onHeightChange])

    useEffect(() => {
        upvotes.set(gpt.upvotes)
    }, [gpt.upvotes, upvotes])

    return (
        <Link href={`/gpt/${gpt.id}`} className="block h-full group">
            <div
                ref={cardRef}
                style={{ minHeight: rowHeight ? `${rowHeight}px` : 'auto' }}
                className="bg-card/40 text-card-foreground p-6 rounded-lg transition-all duration-300 h-full flex flex-col glass-effect backdrop-blur-sm hover:bg-card/60"
            >
                <div className="flex-1 min-h-0 flex flex-col">
                    <h3 className="text-2xl font-bold mb-2 glow-text line-clamp-1">{gpt.name}</h3>
                    <div className="mb-4 flex-grow">
                        <p className="text-muted-foreground">{gpt.shortDescription}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {gpt.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border/50">
                    <div className="flex items-center">
                        <ThumbsUp className="w-5 h-5 text-primary mr-1" aria-hidden="true" />
                        <motion.span>{springUpvotes}</motion.span>
                        <span className="sr-only">Upvotes</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-accent mr-1" aria-hidden="true" />
                        <span>{formatDate(new Date(gpt.launchDate))}</span>
                        <span className="sr-only">Launch Date</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

