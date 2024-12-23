'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search } from 'lucide-react'
import { GPT } from '@/lib/types'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Input } from './ui/input'
import { FilterDropdown } from './FilterDropdown'
import { GPTCardGrid } from './GPTCardGrid'
import LoadingSpinner from './LoadingSpinner'

export default function GPTGrid() {
  const [gpts, setGpts] = useState<GPT[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All'])
  const [selectedTags, setSelectedTags] = useState<string[]>(['All'])
  const [sortBy, setSortBy] = useState<'upvotes' | 'launchDate'>('upvotes')
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [gptCount, setGptCount] = useState('300+')

  useEffect(() => {
    fetchGPTs()
  }, [])

  const fetchGPTs = async () => {
    setIsLoading(true)
    try {
      const q = collection(db, 'gpts_live')
      const querySnapshot = await getDocs(q)
      const gptsData: GPT[] = []
      const categoriesSet = new Set<string>(['All'])

      querySnapshot.forEach((doc) => {
        const gpt = { id: doc.id, ...doc.data() } as GPT
        gptsData.push(gpt)
        if (gpt.category && typeof gpt.category === 'string') {
          categoriesSet.add(gpt.category)
        }
      })

      const roundedCount = `${Math.floor(gptsData.length / 50) * 50}+`
      setGptCount(roundedCount)

      setGpts(gptsData)
      setCategories(Array.from(categoriesSet))
    } catch (error) {
      console.error("Error fetching GPTs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategories(prev => {
      const newCategories = category === 'All'
        ? ['All']
        : prev.includes(category)
          ? prev.filter(c => c !== category)
          : [...prev.filter(c => c !== 'All'), category]
      return newCategories.length === 0 ? ['All'] : newCategories
    })
  }

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => {
      const newTags = tag === 'All'
        ? ['All']
        : prev.includes(tag)
          ? prev.filter(t => t !== tag)
          : [...prev.filter(t => t !== 'All'), tag]
      return newTags.length === 0 ? ['All'] : newTags
    })
  }

  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>(['All'])
    gpts.forEach(gpt => {
      if (selectedCategories.includes('All') || selectedCategories.includes(gpt.category)) {
        gpt.tags.forEach(tag => tagsSet.add(tag))
      }
    })
    return Array.from(tagsSet)
  }, [gpts, selectedCategories])

  const filteredGPTs = useMemo(() => {
    return gpts.filter(gpt =>
      (selectedCategories.includes('All') || (gpt.category && selectedCategories.includes(gpt.category))) &&
      (selectedTags.includes('All') || gpt.tags.some(tag => selectedTags.includes(tag))) &&
      (gpt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gpt.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [gpts, selectedCategories, selectedTags, searchQuery])

  const sortedGPTs = useMemo(() => {
    return [...filteredGPTs].sort((a, b) =>
      sortBy === 'upvotes'
        ? b.upvotes - a.upvotes
        : new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime()
    )
  }, [filteredGPTs, sortBy])

  const enhancedGPTs = useMemo(() => {
    const result = [...sortedGPTs]
    for (let i = 6; i < result.length; i += Math.floor(Math.random() * 3 + 6)) {
      result.splice(i, 0, { id: `ad-${i}`, isAd: true, name: '', shortDescription: '', longDescription: '', url: '', category: '', tags: [], upvotes: 0, launchDate: new Date().toISOString(), comments: [] } as GPT)
    }
    return result
  }, [sortedGPTs])

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <LoadingSpinner text='Loading GPTs...' />
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center mb-4">
          <div className="relative">
            <Search id='explore' className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={`Search in ${gptCount} GPTs...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[300px]"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <FilterDropdown
            items={categories}
            selectedItems={selectedCategories}
            onItemSelect={handleCategorySelect}
            label="Categories"
          />
          <FilterDropdown
            items={availableTags}
            selectedItems={selectedTags}
            onItemSelect={handleTagSelect}
            label="Tags"
          />
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <Badge variant="secondary" className="text-sm">
          {filteredGPTs.length} {filteredGPTs.length === 1 ? 'result' : 'results'}
        </Badge>
        <div className="space-x-2">
          <Button
            variant={sortBy === 'upvotes' ? 'default' : 'outline'}
            onClick={() => setSortBy('upvotes')}
          >
            Sort by Upvotes
          </Button>
          <Button
            variant={sortBy === 'launchDate' ? 'default' : 'outline'}
            onClick={() => setSortBy('launchDate')}
          >
            Sort by Launch Date
          </Button>
        </div>
      </div>
      {filteredGPTs.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-2xl font-bold mb-4">No GPTs Found</h3>
          <p className="text-muted-foreground mb-8">We couldn&apos;t find any GPTs matching your search criteria.</p>
          <Button onClick={() => {
            setSelectedCategories(['All']);
            setSelectedTags(['All']);
            setSearchQuery('');
            document.getElementById('gpt-grid')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <GPTCardGrid gpts={enhancedGPTs} />
      )}
    </div>
  )
}
