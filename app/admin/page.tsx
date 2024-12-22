'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { Check, X, AlertTriangle, Rocket, LogOut } from 'lucide-react'
import { db, gptsCollection, gptsReviewCollection } from '@/lib/firebase'
import { collection, query, where, getDocs, doc, runTransaction, deleteDoc } from 'firebase/firestore'
import { useAuth } from '@/contexts/AuthContext'
import { Markdown } from '@/components/Markdown'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'

async function sendEmail(to: string, subject: string, body: string) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, body }),
    })

    if (!response.ok) {
      throw new Error(`Failed to send email: ${await response.text()}`)
    }
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
}

type Submission = {
  id: string
  name: string
  shortDescription: string
  longDescription: string
  category: string
  tags: string[]
  url: string
  email: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [stars, setStars] = useState<{ top: string; left: string; size: string; delay: string }[]>([])
  const [processingApproveId, setProcessingApproveId] = useState<string | null>(null);
  const [processingRejectId, setProcessingRejectId] = useState<string | null>(null);
  const router = useRouter()
  const { user, loading, logout } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login')
    } else if (user) {
      fetchSubmissions()
    }
  }, [user, loading, router])

  useEffect(() => {
    const newStars = Array.from({ length: 100 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      delay: `${Math.random() * 5}s`
    }))
    setStars(newStars)
  }, [])

  const fetchSubmissions = async () => {
    try {
      const q = query(collection(db, gptsReviewCollection), where('status', '==', 'pending'))
      const querySnapshot = await getDocs(q)
      const submissionsData: Submission[] = []
      querySnapshot.forEach((doc) => {
        submissionsData.push({ id: doc.id, ...doc.data() } as Submission)
      })
      setSubmissions(submissionsData)
    } catch (error) {
      console.error('Error fetching submissions:', error)
      toast({
        title: "Error",
        description: "Failed to fetch submissions. Please try again.",
        variant: "destructive"
      })
    }
  }

  const deleteFromReview = async (submission: Submission) => {
    try {
      const q = query(collection(db, gptsReviewCollection),
        where('id', '==', submission.id));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Document not found in review collection');
      }

      const docToDelete = querySnapshot.docs[0];
      await deleteDoc(doc(db, gptsReviewCollection, docToDelete.id));

      console.log(`Successfully deleted submission ${submission.id} from review collection`);
      return true;
    } catch (error) {
      console.error(`Error deleting from review collection:`, error);
      throw error;
    }
  }

  const handleAction = async (submission: Submission, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        setProcessingApproveId(submission.id);

        await runTransaction(db, async (transaction) => {
          await deleteFromReview(submission);

          const liveDocRef = doc(db, gptsCollection, submission.id);
          transaction.set(liveDocRef, {
            name: submission.name,
            url: submission.url,
            category: submission.category,
            tags: submission.tags,
            shortDescription: submission.shortDescription,
            longDescription: submission.longDescription,
            launchDate: new Date().toISOString(),
            upvotes: 0,
            comments: [],
            email: submission.email,
          });
        });

        const result = await fetch('/api/update-readme', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gptName: submission.name,
            gptId: submission.id,
            category: submission.category,
          }),
        });

        if (!result.ok) {
          throw new Error('Failed to update README');
        }

        const data = await result.json();
        if (!data.success) {
          throw new Error(data.error || 'Unknown error updating README');
        }

        const searchInput = document.querySelector('input[placeholder*="GPTs"]') as HTMLInputElement;
        if (searchInput) {
          const match = searchInput.placeholder.match(/(\d+)\+/);
          if (match) {
            const currentCount = parseInt(match[1]);
            const newCount = Math.floor((currentCount + 1) / 50) * 50;
            searchInput.placeholder = searchInput.placeholder.replace(/\d+\+/, `${newCount}+`);
          }
        }

        await sendEmail(submission.email, 'Your GPT Submission Has Been Approved',
          `Congratulations! Your GPT "${submission.name}" has been approved and is now live on GPTz.directory.
  
  You can view it at: https://gptz.directory/gpt/${submission.id}
  
  Thank you for contributing to our directory!`
        );

        toast({
          title: "GPT Approved",
          description: `${submission.name} has been approved and moved to the live collection.`,
        });
      } else {
        setProcessingRejectId(submission.id);

        await deleteFromReview(submission);

        await sendEmail(submission.email, 'Update on Your GPT Submission',
          `We regret to inform you that your GPT "${submission.name}" has not been approved for inclusion in GPTz.directory at this time.

If you have any questions or would like feedback, please don't hesitate to reach out to us.

Thank you for your interest in contributing to our directory.`
        );

        toast({
          title: "GPT Rejected",
          description: `${submission.name} has been rejected and removed from the review collection.`,
        });
      }

      await fetchSubmissions();
    } catch (error) {
      console.error(`Error ${action}ing submission:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} the GPT: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        variant: "destructive"
      });
    } finally {
      setProcessingApproveId(null);
      setProcessingRejectId(null);
    }
  }

  return (
    <div className="min-h-screen space-bg p-8 relative overflow-hidden">
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
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className='flex'>
          <h1 className="text-4xl font-bold mb-8 text-center glow-text">GPT Control Center</h1>
          <Button variant='outline' className="ml-auto" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        <div className="space-y-6">
          {submissions.map((submission, index) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card text-card-foreground glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Rocket className="w-6 h-6 text-primary mr-2" />
                    <span className="glow-text">{submission.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-muted-foreground">{submission.shortDescription}</p>
                  <p className="mb-4">Category: <span className="text-secondary">{submission.category}</span></p>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Long Description:</h3>
                    <Markdown content={submission.longDescription} />
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {submission.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <p className="mb-4">URL: <a href={submission.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{submission.url}</a></p>
                  <p className="mb-4">Submitted At: {new Date(submission.submittedAt).toLocaleString()}</p>
                  <p className="mb-4">Generated ID: {submission.id}</p>
                  <p className="mb-4">Submitted By: <a href={`mailto:${submission.email}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{submission.email}</a></p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleAction(submission, 'approve')}
                        className="bg-green-600 hover:bg-green-700 rounded-full"
                        disabled={processingApproveId === submission.id}
                      >
                        {processingApproveId === submission.id ? (
                          <div className="flex items-center">
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                            Processing...
                          </div>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" /> Approve
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleAction(submission, 'reject')}
                        className="bg-red-600 hover:bg-red-700 rounded-full"
                        disabled={processingRejectId === submission.id}
                      >
                        {processingRejectId === submission.id ? (
                          <div className="flex items-center">
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                            Processing...
                          </div>
                        ) : (
                          <>
                            <X className="mr-2 h-4 w-4" /> Reject
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center text-yellow-400">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      <span>Pending Review</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

