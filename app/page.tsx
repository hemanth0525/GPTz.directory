'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import GPTGrid from '@/components/GPTGrid'
import { Rocket } from 'lucide-react'
import { WhyWeBuiltIt } from '@/components/WhyWeBuiltIt'
import { Newsletter } from '@/components/Newsletter'
import { FAQ } from '@/components/FAQ'
import { AskAI } from '@/components/AskAI'

export default function Home() {
  const [stars, setStars] = useState<{ top: string; left: string; size: string; delay: string }[]>([])

  useEffect(() => {
    const newStars = Array.from({ length: 200 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      delay: `${Math.random() * 5}s`
    }))
    setStars(newStars)
  }, [])

  return (
    <>
      <main className="min-h-screen space-bg p-4 sm:p-8 relative overflow-hidden">
        {stars.map((star, index) => (
          <div
            key={index}
            className="star"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDelay: star.delay
            }}
          />
        ))}
        <motion.header
          className="text-center mb-8 sm:mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 sm:mb-4 glow-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Explore the AI Universe
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-4 sm:mb-8 text-muted-foreground">
            Discover and share the most powerful GPTs in the galaxy
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
            <Button asChild size="sm" className="rounded-full text-base sm:text-lg w-full sm:w-auto">
              <Link href="/submit">
                <Rocket className="mr-2 h-4 sm:h-5 w-4 sm:w-5" /> Submit Your GPT
              </Link>
            </Button>
            <AskAI />
          </div>
          <div id='gpt-grid' className='h-1'></div>
        </motion.header>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <GPTGrid />
        </motion.div>
      </main>
      <WhyWeBuiltIt />
      <Newsletter />
      <FAQ />
    </>
  )
}

