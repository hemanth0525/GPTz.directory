import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function generateUniqueId(name: string): Promise<string> {
  const baseId = slugify(name)
  let id = baseId
  let counter = 1

  const gptsRef = collection(db, 'gpts_live')
  const gptsReviewRef = collection(db, 'gpts_review')

  while (true) {
    const liveQuery = query(gptsRef, where('id', '==', id))
    const reviewQuery = query(gptsReviewRef, where('id', '==', id))

    const [liveSnapshot, reviewSnapshot] = await Promise.all([
      getDocs(liveQuery),
      getDocs(reviewQuery)
    ])

    if (liveSnapshot.empty && reviewSnapshot.empty) {
      return id
    }

    id = `${baseId}-${counter}`
    counter++
  }
}

