'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { categories, tags as allTags } from '@/lib/gpts'
import { toast } from '@/hooks/use-toast'
import { Markdown } from '@/components/Markdown'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Badge } from '@/components/ui/badge'
import { X, Eye, Edit2 } from 'lucide-react'
import { generateUniqueId } from '@/lib/utils'
import { ConfirmationDialog } from '@/components/ConfirmationDilalog'

export default function SubmitGPT() {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [longDescription, setLongDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [email, setEmail] = useState('')
  const [url, setUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmation(true)
  }

  const submitGPT = async () => {
    setIsSubmitting(true)
    try {
      const id = await generateUniqueId(name)
      const submission = {
        id,
        name,
        email,
        url,
        shortDescription,
        longDescription,
        category,
        tags,
        status: 'pending',
        submittedAt: new Date().toISOString()
      }

      await addDoc(collection(db, 'gpts_review'), submission)

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: 'New GPT Submission',
          body: `A new GPT has been submitted:\n\nName: ${name}\nSubmitted by: ${email}\nURL: ${url}\nCategory: ${category}\nTags: ${tags.join(', ')}\n\nPlease review it in the admin dashboard: https://gptz.directory/admin`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send email notification')
      }

      toast({
        title: "Success!",
        description: "Your GPT has been submitted for review.",
      })
      router.push('/')
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to submit GPT. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
      setShowConfirmation(false)
    }
  }

  const addTag = (tag: string) => {
    if (tags.length < 4 && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={submitGPT}
        gptData={{
          name,
          email,
          url,
          shortDescription,
          category,
          tags
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-card text-card-foreground p-8 rounded-lg shadow-lg glass-effect"
      >
        <h1 className="text-4xl font-bold mb-8 text-center glow-text">Launch Your GPT</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium">GPT Name *</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-muted text-foreground"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">Your Email *</label>
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
            <label htmlFor="url" className="block mb-2 text-sm font-medium">GPT URL *</label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full bg-muted text-foreground"
            />
          </div>
          <div>
            <label htmlFor="shortDescription" className="block mb-2 text-sm font-medium">Short Description *</label>
            <Input
              id="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              required
              maxLength={100}
              className="w-full bg-muted text-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">{shortDescription.length}/100 characters</p>
          </div>
          <div>
            <label htmlFor="longDescription" className="block mb-2 text-sm font-medium">
              Detailed Description * (Markdown supported)
            </label>
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-muted-foreground">{longDescription.length}/1000 characters</p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                  >
                    {isPreviewMode ? <Edit2 className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {isPreviewMode ? 'Edit' : 'Preview'}
                  </Button>
                </div>
              </div>
              {isPreviewMode ? (
                <div className="w-full h-[200px] bg-muted rounded-md p-4 overflow-y-auto">
                  <Markdown content={longDescription || '*Detailed description preview will appear here*'} />
                </div>
              ) : (
                <Textarea
                  id="longDescription"
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  required
                  maxLength={1000}
                  className="w-full bg-muted text-foreground min-h-[200px]"
                  rows={8}
                />
              )}
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block mb-2 text-sm font-medium">Category *</label>
            <Select onValueChange={setCategory} required>
              <SelectTrigger className="w-full bg-muted text-foreground">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="tags" className="block mb-2 text-sm font-medium">Tags * (max 4)</label>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Type a custom tag and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = e.currentTarget.value.trim();
                    if (value && tags.length < 4 && !tags.includes(value)) {
                      addTag(value);
                      e.currentTarget.value = '';
                    }
                  }
                }}
                className="flex-1 bg-muted text-foreground"
              />
              <div className="">
                <Select onValueChange={addTag}>
                  <SelectTrigger className="w-full bg-muted text-foreground">
                    <SelectValue placeholder="Select tags" />
                  </SelectTrigger>
                  <SelectContent>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-2 py-1">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="ml-2">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <Button
            type="submit"
            className="w-full rounded-full px-6 py-3 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Launch into the GPT Universe'}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
