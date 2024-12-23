'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GPT } from '@/lib/types'
import { GPTCard } from './GPTCard'
import { AdCard } from './AdCard'
import GPTCardSkeleton from './GPTCardSkeleton'

interface GPTCardGridProps {
    gpts: (GPT & { isAd?: boolean })[]
}

export function GPTCardGrid({ gpts }: GPTCardGridProps) {
    const [columnCount, setColumnCount] = useState(3)
    const [rowHeights, setRowHeights] = useState<{ [key: number]: number }>({})

    useEffect(() => {
        const updateColumnCount = () => {
            if (window.innerWidth < 768) {
                setColumnCount(1)
            } else if (window.innerWidth < 1024) {
                setColumnCount(2)
            } else {
                setColumnCount(3)
            }
        }

        updateColumnCount()
        window.addEventListener('resize', updateColumnCount)
        return () => window.removeEventListener('resize', updateColumnCount)
    }, [])

    const handleHeightChange = useCallback((rowIndex: number, height: number) => {
        setRowHeights(prev => {
            const currentRowMax = Math.max(prev[rowIndex] || 0, height)
            if (currentRowMax === prev[rowIndex]) return prev
            return { ...prev, [rowIndex]: currentRowMax }
        })
    }, [])

    const gridItems = gpts.map((item, index) => {
        if (item.isAd) {
            return (
                <div
                    key={item.id}
                    className="row-span-2 md:col-span-1"
                >
                    <AdCard />
                </div>
            )
        }
        return (
            <LazyGPTCard
                key={item.id}
                gpt={item}
                index={index}
                onHeightChange={(height) => handleHeightChange(Math.floor(index / columnCount), height)}
                rowHeight={rowHeights[Math.floor(index / columnCount)]}
            />
        )
    })

    return (
        <AnimatePresence>
            <motion.div
                className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-max"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {gridItems}
            </motion.div>
        </AnimatePresence>
    )
}

function LazyGPTCard({ gpt, index, onHeightChange, rowHeight }: {
    gpt: GPT
    index: number
    onHeightChange: (height: number) => void
    rowHeight?: number
}) {
    const [isReady, setIsReady] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        setTimeout(() => setIsReady(true), 300)
                    })
                    observer.disconnect()
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        )

        if (cardRef.current) {
            observer.observe(cardRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <div ref={cardRef}>
            <AnimatePresence>
                {!isReady ? (
                    <motion.div
                        key="skeleton"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <GPTCardSkeleton index={index} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="card"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <GPTCard
                            gpt={gpt}
                            onHeightChange={onHeightChange}
                            rowHeight={rowHeight}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

