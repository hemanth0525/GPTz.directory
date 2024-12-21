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
            className="py-16 bg-card"
        >
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-4 text-center glow-text">Stay Updated with GPTz Weekly</h2>
                <p className="text-center mb-8 text-muted-foreground">Subscribe to our newsletter for the latest GPT discoveries and AI insights.</p>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-grow"
                    />
                    <Button type="submit">Subscribe</Button>
                </form>
            </div>
        </motion.section>
    )
}

