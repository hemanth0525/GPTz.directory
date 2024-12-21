'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Rocket, Stars, Home } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-black flex items-center justify-center p-4 relative overflow-hidden">

            <div className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center space-y-8"
                >
                    <motion.div
                        animate={{
                            y: [0, -15, 0],
                            rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: 'easeInOut',
                        }}
                        className="inline-block"
                    >
                        <Rocket className="w-24 h-24 mx-auto text-primary" />
                    </motion.div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold text-primary">
                            Lost in Space
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-lg mx-auto">
                            Houston, we have a problem! This GPT seems to have drifted into a black hole.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Button
                            asChild
                            size="lg"
                            className="rounded-full px-8 bg-primary/20 backdrop-blur-sm hover:bg-primary/30 group"
                        >
                            <Link href="/">
                                <Home className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                                Return to Galaxy
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="ghost"
                            size="lg"
                            className="rounded-full px-8 hover:bg-primary/20 group"
                        >
                            <Link href="/#explore">
                                <Stars className="mr-2 h-5 w-5 group-hover:animate-spin" />
                                Explore GPTs
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>

            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white"
                    initial={{
                        top: Math.random() * 50 + '%',
                        left: '100%',
                        opacity: 1,
                        height: '2px',
                        width: '40px',
                        rotate: -45,
                        boxShadow: '0 0 4px #fff, 0 0 8px #fff',
                    }}
                    animate={{
                        left: '-10%',
                        top: [null, Math.random() * 100 + '%'],
                        opacity: [1, 1, 0],
                    }}
                    transition={{
                        duration: Math.random() * 2 + 1,
                        delay: Math.random() * 2,
                        repeat: Infinity,
                        repeatDelay: Math.random() * 3 + 2,
                    }}
                />
            ))}
        </div>
    )
}

