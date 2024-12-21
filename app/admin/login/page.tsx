'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { toast } from '@/hooks/use-toast'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/admin')
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen space-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card text-card-foreground p-8 rounded-lg shadow-lg glass-effect"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-8 glow-text">Admin Access</h1>
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-muted text-foreground"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-muted text-foreground"
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-full px-6 py-3 text-lg hover-glow"
            disabled={isLoading}
          >
            {isLoading ? 'Accessing...' : 'Access Control Center'}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}

