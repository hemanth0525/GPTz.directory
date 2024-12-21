'use client'

import { motion } from 'framer-motion'

export function Logo() {
  return (
    <motion.div
      className="flex items-center space-x-3"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06F7F7" />
            <stop offset="100%" stopColor="#0066FF" />
          </linearGradient>
        </defs>
        <path d="M50 5 L87.5 25 L87.5 75 L50 95 L12.5 75 L12.5 25 Z"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          fill="none"
        />
        <path d="M50 5 L50 95 M12.5 25 L87.5 75 M87.5 25 L12.5 75"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M45 2 Q50 2 55 2" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round" />
        <path d="M82 22 Q87.5 25 93 28" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round" />
        <path d="M82 78 Q87.5 75 93 72" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round" />
        <path d="M45 98 Q50 98 55 98" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round" />
        <path d="M7 28 Q12.5 25 18 22" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round" />
        <path d="M7 72 Q12.5 75 18 78" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#06F7F7] via-[#9333EA] to-[#0066FF]">
        GPTz.directory
      </span>
    </motion.div>
  )
}
