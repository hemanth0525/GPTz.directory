'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, ThumbsUp, Calendar, Edit, Eye } from 'lucide-react'
import { GPT, Comment as CommentType, Reply } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Markdown } from '@/components/Markdown'
import { Textarea } from '@/components/ui/textarea'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Comment } from '@/components/Comment'
import { format } from 'date-fns'
import { useAuth } from '@/contexts/AuthContext'

export default function GPTPage({ params }: { params: { id: string } }) {
  const [gpt, setGpt] = useState<GPT | null>(null)
  const [hasUpvoted, setHasUpvoted] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const { user, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchGPT = async () => {
      try {
        const docRef = doc(db, 'gpts_live', params.id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const gptData = { id: docSnap.id, ...docSnap.data() } as GPT
          gptData.comments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          setGpt(gptData)

          await updateDoc(docRef, {
            views: (gptData.views || 0) + 1
          })
        } else {
          router.push('/404')
        }
      } catch (error) {
        console.error('Error fetching GPT:', error)
        router.push('/404')
      }
    }

    fetchGPT()
    const upvotedGPTs = JSON.parse(localStorage.getItem('upvotedGPTs') || '{}')
    setHasUpvoted(!!upvotedGPTs[params.id])
  }, [params.id, router])

  const handleUpvote = async () => {
    if (!gpt) return

    const upvotedGPTs = JSON.parse(localStorage.getItem('upvotedGPTs') || '{}')
    const gptRef = doc(db, 'gpts_live', params.id)

    if (hasUpvoted) {
      await updateDoc(gptRef, {
        upvotes: gpt.upvotes - 1
      })
      setGpt({ ...gpt, upvotes: gpt.upvotes - 1 })
      delete upvotedGPTs[params.id]
      setHasUpvoted(false)
    } else {
      await updateDoc(gptRef, {
        upvotes: gpt.upvotes + 1
      })
      setGpt({ ...gpt, upvotes: gpt.upvotes + 1 })
      upvotedGPTs[params.id] = true
      setHasUpvoted(true)
    }

    localStorage.setItem('upvotedGPTs', JSON.stringify(upvotedGPTs))
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gpt || !newComment.trim()) return;

    const gptRef = doc(db, 'gpts_live', params.id);
    const gptDoc = await getDoc(gptRef);

    if (gptDoc.exists()) {
      const currentGPT = gptDoc.data() as GPT;
      const newCommentObj: CommentType = {
        id: Date.now().toString(),
        gptId: params.id,
        text: newComment,
        author: user ? user.displayName || 'User' : 'Anonymous',
        isFounder: !!user, // This user is always the founder
        date: new Date().toISOString(),
        upvotes: 0,
        replies: [],
        replyCount: 0
      };

      const updatedComments = [newCommentObj, ...currentGPT.comments];

      try {
        await updateDoc(gptRef, { comments: updatedComments });
        setGpt({ ...currentGPT, comments: updatedComments });
        setNewComment('');
      } catch (error) {
        console.error('Error updating document:', error);
      }
    }
  };

  const handleReply = async (
    commentId: string,
    replyText: string,
    quotedReplyId?: string,
    quotedText?: string
  ) => {
    if (!gpt) return;

    const gptRef = doc(db, 'gpts_live', params.id);
    const gptDoc = await getDoc(gptRef);

    if (gptDoc.exists()) {
      const currentGPT = gptDoc.data() as GPT;
      const updatedComments = currentGPT.comments.map(comment => {
        if (comment.id === commentId) {
          const newReply: Reply = {
            id: Date.now().toString(),
            text: replyText,
            author: user ? user.displayName || 'User' : 'Anonymous',
            date: new Date().toISOString(),
            upvotes: 0,
            ...(quotedReplyId && { quotedReplyId }),
            ...(quotedText && { quotedText })
          };

          const currentReplies = comment.replies || [];
          return {
            ...comment,
            replies: [newReply, ...currentReplies],
            replyCount: (comment.replyCount || 0) + 1
          };
        }
        return comment;
      });

      try {
        await updateDoc(gptRef, { comments: updatedComments });
        setGpt(prev => prev ? { ...prev, comments: updatedComments } : null);
      } catch (error) {
        console.error('Error updating document:', error);
      }
    }
  };

  const hasUserUpvotedComment = (commentId: string) => {
    const upvotedComments = JSON.parse(localStorage.getItem(`upvotedComments_${params.id}`) || '{}')
    return !!upvotedComments[commentId]
  }

  const hasUserUpvotedReply = (commentId: string, replyId: string) => {
    const upvotedReplies = JSON.parse(localStorage.getItem(`upvotedReplies_${params.id}`) || '{}')
    return !!upvotedReplies[`${commentId}_${replyId}`]
  }

  const handleUpvoteComment = async (commentId: string) => {
    if (!gpt) return;

    const gptRef = doc(db, 'gpts_live', params.id);
    const gptDoc = await getDoc(gptRef);
    const upvotedComments = JSON.parse(localStorage.getItem(`upvotedComments_${params.id}`) || '{}')
    const hasUpvoted = hasUserUpvotedComment(commentId)

    if (gptDoc.exists()) {
      const currentGPT = gptDoc.data() as GPT;
      const updatedComments = currentGPT.comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            upvotes: (comment.upvotes || 0) + (hasUpvoted ? -1 : 1)
          };
        }
        return comment;
      });

      try {
        await updateDoc(gptRef, { comments: updatedComments });
        setGpt({ ...currentGPT, comments: updatedComments });

        if (hasUpvoted) {
          delete upvotedComments[commentId]
        } else {
          upvotedComments[commentId] = true
        }
        localStorage.setItem(`upvotedComments_${params.id}`, JSON.stringify(upvotedComments))
      } catch (error) {
        console.error('Error updating document:', error);
      }
    }
  };

  const handleUpvoteReply = async (commentId: string, replyId: string) => {
    if (!gpt) return;

    const gptRef = doc(db, 'gpts_live', params.id);
    const gptDoc = await getDoc(gptRef);
    const upvotedReplies = JSON.parse(localStorage.getItem(`upvotedReplies_${params.id}`) || '{}')
    const replyKey = `${commentId}_${replyId}`
    const hasUpvoted = hasUserUpvotedReply(commentId, replyId)

    if (gptDoc.exists()) {
      const currentGPT = gptDoc.data() as GPT;
      const updatedComments = currentGPT.comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply =>
              reply.id === replyId
                ? { ...reply, upvotes: (reply.upvotes || 0) + (hasUpvoted ? -1 : 1) }
                : reply
            )
          };
        }
        return comment;
      });

      try {
        await updateDoc(gptRef, { comments: updatedComments });
        setGpt({ ...currentGPT, comments: updatedComments });

        if (hasUpvoted) {
          delete upvotedReplies[replyKey]
        } else {
          upvotedReplies[replyKey] = true
        }
        localStorage.setItem(`upvotedReplies_${params.id}`, JSON.stringify(upvotedReplies))
      } catch (error) {
        console.error('Error updating document:', error);
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!gpt || !isAdmin) return;

    const gptRef = doc(db, 'gpts_live', params.id);
    const gptDoc = await getDoc(gptRef);

    if (gptDoc.exists()) {
      const currentGPT = gptDoc.data() as GPT;
      const updatedComments = currentGPT.comments.filter(comment => comment.id !== commentId);

      try {
        await updateDoc(gptRef, { comments: updatedComments });
        setGpt({ ...currentGPT, comments: updatedComments });
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const handleDeleteReply = async (commentId: string, replyId: string) => {
    if (!gpt || !isAdmin) return;

    const gptRef = doc(db, 'gpts_live', params.id);
    const gptDoc = await getDoc(gptRef);

    if (gptDoc.exists()) {
      const currentGPT = gptDoc.data() as GPT;
      const updatedComments = currentGPT.comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.filter(reply => reply.id !== replyId),
            replyCount: comment.replyCount - 1
          };
        }
        return comment;
      });

      try {
        await updateDoc(gptRef, { comments: updatedComments });
        setGpt({ ...currentGPT, comments: updatedComments });
      } catch (error) {
        console.error('Error deleting reply:', error);
      }
    }
  };

  if (!gpt) return null

  return (
    <div className="min-h-screen space-bg p-4 sm:p-6 md:p-8 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Link href="/">
          <Button variant="ghost" className="mb-4 sm:mb-6 md:mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Galaxy
          </Button>
        </Link>
        <div className="bg-card text-card-foreground p-4 sm:p-6 md:p-8 rounded-lg glass-effect">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 glow-text">{gpt.name}</h1>
          <p className="text-lg sm:text-xl mb-3 sm:mb-4 text-muted-foreground">{gpt.shortDescription}</p>
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
            {gpt.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-sm">{tag}</Badge>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-4 sm:mb-6">
            <Button
              variant="outline"
              onClick={handleUpvote}
              className={`${hasUpvoted ? 'bg-primary text-primary-foreground' : ''} text-sm sm:text-base`}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              {gpt.upvotes} {gpt.upvotes === 1 ? 'Upvote' : 'Upvotes'}
            </Button>
            <div className="flex items-center text-sm sm:text-base">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-accent mr-1" />
              <span className="hidden sm:inline">Launched on </span>
              <span>{format(new Date(gpt.launchDate), 'MMM do, yyyy')}</span>
            </div>
            {isAdmin && (
              <>
                <div className="flex items-center text-sm sm:text-base">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-accent mr-1" />
                  <span>{gpt.views || 0} views</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/gpt/${params.id}/edit`)}
                  className="text-sm sm:text-base"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              </>
            )}
          </div>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">About this GPT</h2>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <Markdown content={gpt.longDescription} />
            </div>
          </div>
          <div className="flex gap-4 mb-6 sm:mb-8">
            <Button className="w-full sm:w-auto rounded-full px-4 sm:px-6 py-2 text-base sm:text-lg hover-glow" asChild>
              <a href={`${gpt.url}?ref=gptz.directory`} target="_blank" rel="noopener noreferrer">
                Try {gpt.name}
              </a>
            </Button>
          </div>
          <div className="mt-6 sm:mt-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Discussion</h2>
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <div className="mb-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment with Markdown..."
                  className="mb-2 font-mono min-h-[100px] sm:min-h-[150px]"
                />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Markdown supported</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className="w-full sm:w-auto"
                  >
                    {isPreviewMode ? 'Edit' : 'Preview'}
                  </Button>
                </div>
              </div>
              {isPreviewMode && (
                <div className="my-3 sm:my-4 p-3 sm:p-4 border rounded-md bg-muted overflow-auto max-h-[200px] sm:max-h-[300px]">
                  <Markdown content={newComment || '*Preview will appear here*'} />
                </div>
              )}
              <Button type="submit" className="w-full sm:w-auto">Post Comment</Button>
            </form>
            <div className="space-y-3 sm:space-y-4">
              {gpt.comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={{ ...comment, gptId: params.id }}
                  onReply={(commentId, replyText, quotedReplyId, quotedText) =>
                    handleReply(commentId, replyText, quotedReplyId, quotedText)}
                  onUpvote={handleUpvoteComment}
                  onUpvoteReply={handleUpvoteReply}
                  onDeleteComment={handleDeleteComment}
                  onDeleteReply={handleDeleteReply}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

