interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({ text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-24 h-24 border-8 border-t-primary border-r-transparent border-b-muted border-l-transparent rounded-full animate-spin" />
        </div>
        <div className="absolute top-0 left-0 w-full h-full rotate-45">
          <div className="w-24 h-24 border-8 border-t-transparent border-r-primary/50 border-b-transparent border-l-muted/50 rounded-full animate-pulse" />
        </div>
      </div>
      {text && <p className="mt-4 text-lg text-muted-foreground animate-pulse">{text}</p>}
    </div>
  )
}

