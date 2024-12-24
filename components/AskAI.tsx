'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { BotMessageSquare, Loader2, ExternalLink, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { GPT } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { SponsorDialog } from './SponsorDialog'

interface GPTWithReason extends GPT {
    aiReason?: string;
    confidence?: number;
    score?: number;
}

export function AskAI() {
    const [isOpen, setIsOpen] = useState(false)
    const [userQuery, setUserQuery] = useState('')
    const [recommendations, setRecommendations] = useState<GPTWithReason[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [hasSearched, setHasSearched] = useState(false)
    const [showSponsorDialog, setShowSponsorDialog] = useState(false)
    const [isAIFallback, setIsAIFallback] = useState(false)

    const handleSearch = async () => {
        setHasSearched(true);
        setIsAIFallback(false);
        if (!userQuery || userQuery.length < 3 || userQuery.length > 200) {
            setRecommendations([]);
            setError("Please enter a query between 3 and 200 characters.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/ask-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: userQuery }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }

            const data = await response.json();
            if (data.error) {
                setError(data.error);
                setRecommendations([]);
            } else {
                if (data.isAIFallback) {
                    setIsAIFallback(true);
                    setShowSponsorDialog(true);
                }
                setRecommendations(data.recommendations);
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            setError("Failed to get recommendations. Please try again.");
            setRecommendations([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.slice(0, 200);
        setUserQuery(newValue);
        setHasSearched(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full px-4 py-2 text-sm">
                        <BotMessageSquare className="mr-2 h-4 w-4" /> Ask AI
                    </Button>
                </DialogTrigger>
                <DialogContent
                    className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col p-4 sm:p-6"
                >
                    <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">Ask AI for GPT Recommendations</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 sm:space-y-4 mb-3 sm:mb-4">
                        <div className="relative">
                            <Input
                                value={userQuery}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Describe what you want to achieve..."
                                className="w-full text-base sm:text-lg py-4 sm:py-6 pr-12 sm:pr-16"
                            />
                            <span className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-muted-foreground bg-background px-1.5 sm:px-2 rounded-full">
                                {userQuery.length}/200
                            </span>
                        </div>
                        <Button
                            onClick={handleSearch}
                            className="w-full py-2 sm:py-6 text-sm sm:text-base"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                    Searching...
                                </>
                            ) : (
                                'Search'
                            )}
                        </Button>
                    </div>
                    {error && (
                        <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-destructive/10 text-destructive rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    <div className="flex-1 overflow-y-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center p-4 sm:p-8 space-y-3 sm:space-y-4">
                                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
                                <p className="text-xs sm:text-sm text-muted-foreground">Analyzing your request...</p>
                            </div>
                        )}
                        {!isLoading && recommendations.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <AnimatePresence>
                                    {isAIFallback && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.5 }}
                                            className="mb-3 sm:mb-4 p-3 sm:p-4 bg-muted rounded-lg text-xs sm:text-sm text-center"
                                        >
                                            Due to high traffic, we&apos;re providing relevant results based on our search algorithm.
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="grid grid-cols-1 gap-3 sm:gap-4 p-1 sm:p-2"
                                >
                                    {recommendations
                                        .slice()
                                        .sort((a, b) => {
                                            if (isAIFallback) {
                                                return (b.score ?? 0) - (a.score ?? 0);
                                            } else {
                                                return (b.confidence ?? 0) - (a.confidence ?? 0);
                                            }
                                        })
                                        .map((gpt, index) => (
                                            <motion.div
                                                key={gpt.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 + 0.3 }}
                                                className="bg-card p-3 sm:p-4 rounded-lg border border-border hover:border-primary transition-colors"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <Link
                                                        href={`/gpt/${gpt.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:text-primary/80 font-semibold text-sm sm:text-base flex items-center gap-1.5 sm:gap-2"
                                                    >
                                                        {gpt.name}
                                                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    </Link>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-primary text-primary" />
                                                        <span className="text-xs sm:text-sm text-muted-foreground">
                                                            {Math.round((isAIFallback ? gpt.score ?? 0 : gpt.confidence ?? 0) * 100)}% {isAIFallback ? 'relevance' : 'match'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                                                    {gpt.shortDescription}
                                                </p>
                                                {gpt.aiReason && (
                                                    <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-muted/50 rounded-md">
                                                        <p className="text-xs sm:text-sm">
                                                            <span className="font-medium">Why this helps:</span> {gpt.aiReason}
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                                                    {gpt.tags.slice(0, 3).map((tag, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="secondary"
                                                            className="text-[10px] sm:text-xs"
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        ))}
                                </motion.div>
                            </motion.div>
                        )}
                        {!isLoading && hasSearched && userQuery.length >= 3 && recommendations.length === 0 && error === null && (
                            <div className="text-center p-8 text-muted-foreground">
                                No GPTs found matching your request. Try describing your goal differently or browse our categories.
                            </div>
                        )}
                        {!isLoading && hasSearched && userQuery.length > 0 && userQuery.length < 3 && error === null && (
                            <div className="text-center p-8 text-muted-foreground">
                                Type at least 3 characters to search...
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
            <SponsorDialog
                isOpen={showSponsorDialog}
                onClose={() => setShowSponsorDialog(false)}
            />
        </>
    )
}

