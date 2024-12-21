import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ThumbsUp, MessageSquare, CornerDownRight, ChevronDown, ChevronUp, Trash, Crown } from 'lucide-react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Avatar } from './Avatar'
import { Comment as CommentType, Reply } from '@/lib/types'
import { Markdown } from './Markdown'
import { Badge } from "@/components/ui/badge"

type CommentProps = {
  comment: CommentType
  onReply: (commentId: string, replyText: string, quotedReplyId?: string, quotedText?: string) => void
  onUpvote: (commentId: string) => void
  onUpvoteReply: (commentId: string, replyId: string) => void
  onDeleteComment: (commentId: string) => void
  onDeleteReply: (commentId: string, replyId: string) => void
  isAdmin: boolean
}

const MAX_COMMENT_LENGTH = 300

export function Comment({ comment, onReply, onUpvote, onUpvoteReply, onDeleteComment, onDeleteReply, isAdmin }: CommentProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [showReplies, setShowReplies] = useState(false)
  const [quotedReply, setQuotedReply] = useState<Reply | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const hasUpvotedComment = () => {
    const upvotedComments = JSON.parse(localStorage.getItem(`upvotedComments_${comment.gptId}`) || '{}')
    return upvotedComments[comment.id] === true
  }

  const hasUpvotedReply = (replyId: string) => {
    const upvotedReplies = JSON.parse(localStorage.getItem(`upvotedReplies_${comment.gptId}`) || '{}')
    return upvotedReplies[`${comment.id}_${replyId}`] === true
  }

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText, quotedReply?.id, quotedReply?.text)
      setReplyText('')
      setIsReplying(false)
      setQuotedReply(null)
    }
  }

  const isLongComment = comment.text.length > MAX_COMMENT_LENGTH

  return (
    <div className="bg-card/40 p-4 rounded-lg">
      <div className="flex items-start space-x-4">
        <Avatar />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            {comment.isFounder ? (
              <Badge variant="secondary" className="bg-gradient-to-tr from-[#ff2c95] to-[#4169e1] text-white py-0.5 text-xs">
                <Crown className="w-3 h-3 mr-1" />
                GPTz.directory Founder
              </Badge>
            )
              : <h4 className="font-semibold truncate">{comment.author}</h4>
            }
            <span className="text-sm text-muted-foreground whitespace-nowrap ml-2">
              {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
            </span>
          </div>
          <div className="mt-1 prose prose-sm dark:prose-invert max-w-none break-words">
            <Markdown content={isExpanded || !isLongComment
              ? comment.text
              : `${comment.text.slice(0, MAX_COMMENT_LENGTH)}...`}
            />
          </div>
          {isLongComment && (
            <Button
              variant="link"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 p-0 h-auto font-normal"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Read more
                </>
              )}
            </Button>
          )}
          <div className="mt-2 flex items-center space-x-4">
            <Button
              variant={hasUpvotedComment() ? "default" : "outline"}
              size="sm"
              className={hasUpvotedComment() ? 'bg-primary text-primary-foreground' : ''}
              onClick={() => onUpvote(comment.id)}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              {comment.upvotes} {comment.upvotes === 1 ? 'Upvote' : 'Upvotes'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
              onClick={() => setIsReplying(!isReplying)}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Reply</span>
            </Button>
            {comment.replies && comment.replies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1"
                onClick={() => setShowReplies(!showReplies)}
              >
                <CornerDownRight className="w-4 h-4" />
                <span>
                  {showReplies ? 'Hide' : 'Show'} {comment.replies.length}{' '}
                  {comment.replies.length === 1 ? 'reply' : 'replies'}
                </span>
              </Button>
            )}
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 text-destructive"
                onClick={() => onDeleteComment(comment.id)}
              >
                <Trash className="w-4 h-4" />
                <span>Delete</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      {isReplying && (
        <div className="mt-4 ml-12">
          {quotedReply && (
            <div className="bg-muted p-2 rounded mb-2 text-sm">
              <p className="font-semibold">{quotedReply.author}:</p>
              <div className="break-words">
                <Markdown content={quotedReply.text} />
              </div>
            </div>
          )}
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply... (Markdown supported)"
            className="mb-2 min-h-[100px]"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsReplying(false)}>Cancel</Button>
            <Button onClick={handleReply}>Reply</Button>
          </div>
        </div>
      )}
      {showReplies && comment.replies && (
        <div className="mt-4 space-y-4 ml-12">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="bg-card/60 p-3 rounded-lg">
              <div className="flex items-start space-x-3">
                <Avatar />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold truncate">{reply.author}</h5>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(reply.date), { addSuffix: true })}
                    </span>
                  </div>
                  {reply.quotedText && (
                    <div className="bg-muted p-2 rounded my-2 text-sm">
                      <div className="break-words">
                        <Markdown content={reply.quotedText} />
                      </div>
                    </div>
                  )}
                  <div className="mt-1 prose prose-sm dark:prose-invert max-w-none break-words">
                    <Markdown content={reply.text} />
                  </div>
                  <div className="mt-2 flex items-center space-x-4">
                    <Button
                      variant={hasUpvotedReply(reply.id) ? "default" : "outline"}
                      size="sm"
                      className={hasUpvotedReply(reply.id) ? 'bg-primary text-primary-foreground' : ''}
                      onClick={() => onUpvoteReply(comment.id, reply.id)}
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      {reply.upvotes} {reply.upvotes === 1 ? 'Upvote' : 'Upvotes'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-1"
                      onClick={() => {
                        setQuotedReply(reply)
                        setIsReplying(true)
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Quote</span>
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1 text-destructive"
                        onClick={() => onDeleteReply(comment.id, reply.id)}
                      >
                        <Trash className="w-4 h-4" />
                        <span>Delete</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

