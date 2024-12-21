'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
    {
        question: "What is GPTz.directory?",
        answer: "GPTz.directory is a curated platform showcasing the most innovative and powerful GPTs (Generative Pre-trained Transformers) from across the AI universe. We aim to be the go-to resource for discovering and exploring cutting-edge AI tools and technologies."
    },
    {
        question: "How can I submit my GPT to the directory?",
        answer: "You can submit your GPT by clicking on the 'Submit Your GPT' button on our homepage. Fill out the required information, including your GPT's name, description, category, and link. Our team will review your submission and, if approved, add it to our directory."
    },
    {
        question: "Is GPTz.directory free to use?",
        answer: "Yes, GPTz.directory is completely free to use. You can browse, discover, and upvote GPTs without any cost. We're committed to making AI accessible to everyone."
    },
    {
        question: "How often is the directory updated?",
        answer: "We update our directory regularly as new GPTs are submitted and approved. To stay informed about the latest additions, you can subscribe to our weekly newsletter."
    },
    {
        question: "Can I contribute to GPTz.directory beyond submitting GPTs?",
        answer: "We welcome contributions from the community. You can participate in discussions, provide feedback on GPTs, and share your experiences. If you're interested in contributing more extensively, please reach out to us via email."
    }
]

export function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-16 bg-gradient-to-b from-muted to-background"
        >
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center glow-text">Frequently Asked Questions</h2>
                <div className="max-w-3xl mx-auto">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={false}
                            animate={{ backgroundColor: activeIndex === index ? 'rgba(255,255,255,0.05)' : 'transparent' }}
                            className="mb-4 rounded-lg overflow-hidden"
                        >
                            <button
                                className="flex justify-between items-center w-full p-4 text-left focus:outline-none"
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                            >
                                <span className="font-medium">{faq.question}</span>
                                {activeIndex === index ? (
                                    <ChevronUp className="w-5 h-5" />
                                ) : (
                                    <ChevronDown className="w-5 h-5" />
                                )}
                            </button>
                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <p className="p-4 text-muted-foreground">{faq.answer}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    )
}

