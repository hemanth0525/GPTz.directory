'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GPT } from '@/lib/types'
import { GPTCard } from './GPTCard'
import GPTCardSkeleton from './GPTCardSkeleton'

interface GPTCardGridProps {
    gpts: GPT[]
}

export function GPTCardGrid({ gpts }: GPTCardGridProps) {
    const [columnCount, setColumnCount] = useState(3)
    const [gapSize, setGapSize] = useState(32) // 8 * 4 = 32px default gap
    const [rowHeights, setRowHeights] = useState<{ [key: number]: number }>({})

    useEffect(() => {
        const updateLayout = () => {
            if (window.innerWidth < 640) {
                setColumnCount(1)
                setGapSize(16) // Smaller gap for mobile
            } else if (window.innerWidth < 768) {
                setColumnCount(2)
                setGapSize(20)
            } else if (window.innerWidth < 1024) {
                setColumnCount(2)
                setGapSize(24)
            } else if (window.innerWidth < 1280) {
                setColumnCount(3)
                setGapSize(28)
            } else {
                setColumnCount(4)
                setGapSize(32)
            }
        }

        updateLayout()
        const debouncedResize = debounce(updateLayout, 150)
        window.addEventListener('resize', debouncedResize)
        return () => window.removeEventListener('resize', debouncedResize)
    }, [])

    // Add debounce function
    function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number) {
        let timer: NodeJS.Timeout
        return function(this: unknown, ...args: Parameters<T>) {
            clearTimeout(timer)
            timer = setTimeout(() => fn.apply(this, args), ms)
        }
    }

    const handleHeightChange = useCallback((rowIndex: number, height: number) => {
        setRowHeights(prev => {
            const currentRowMax = Math.max(prev[rowIndex] || 0, height)
            if (currentRowMax === prev[rowIndex]) return prev
            return { ...prev, [rowIndex]: currentRowMax }
        })
    }, [])

    const gridItems = gpts.map((item, index) => {
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
                className={`grid gap-${gapSize/4} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-max`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ 
                    gap: `${gapSize}px`,
                    willChange: 'transform',
                    containIntrinsicSize: '0 500px',
                    contain: 'layout style paint'
                }}
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
                        const delay = Math.min(index * 100, 300) // Progressive loading based on index
                        setTimeout(() => setIsReady(true), delay)
                    })
                    observer.disconnect()
                }
            },
            { 
                threshold: 0.1, 
                rootMargin: '200px', // Increased rootMargin for earlier loading
            }
        )

        if (cardRef.current) {
            observer.observe(cardRef.current)
        }

        return () => observer.disconnect()
    }, [index]) // Added index to dependencies

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

