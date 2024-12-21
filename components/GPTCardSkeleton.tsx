import { motion } from 'framer-motion'

export default function GPTCardSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card/40 text-card-foreground p-6 rounded-lg h-full glass-effect backdrop-blur-sm"
    >
      <div className="space-y-3">
        <div className="h-8 bg-muted/50 rounded-md animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-muted/40 rounded-md animate-pulse" />
          <div className="h-4 bg-muted/40 rounded-md animate-pulse w-3/4" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-muted/30 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-muted/30 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-5 w-16 bg-muted/40 rounded-md animate-pulse" />
        <div className="h-5 w-24 bg-muted/40 rounded-md animate-pulse" />
      </div>
    </motion.div>
  )
}
