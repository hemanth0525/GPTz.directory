'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function Newsletter() {
    const [email, setEmail] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await addDoc(collection(db, 'emails'), {
                email,
                subscribedAt: new Date().toISOString()
            })

            toast({
                title: "Subscribed!",
                description: "You've been added to our weekly GPTz digest.",
            })

            setEmail('')
        } catch (error) {
            console.error('Error adding email:', error)
            toast({
                title: "Error",
                description: "Failed to subscribe. Please try again.",
                variant: "destructive"
            })
        }
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-8 sm:py-12 md:py-16 bg-card"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 text-center glow-text">
                    Stay Updated with GPTz Weekly
                </h2>
                <p className="text-sm sm:text-base text-center mb-4 sm:mb-6 md:mb-8 text-muted-foreground max-w-lg mx-auto">
                    Subscribe to our newsletter for the latest GPT discoveries and AI insights.
                </p>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 px-4 sm:px-0">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full"
                    />
                    <Button type="submit" className="w-full sm:w-auto whitespace-nowrap">
                        Subscribe
                    </Button>
                </form>
            </div>
        </motion.section>
    )
}

