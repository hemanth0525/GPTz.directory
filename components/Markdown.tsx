'use client'

import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface CodeProps {
    inline?: boolean
    className?: string
    children?: React.ReactNode
}

interface MarkdownProps {
    content: string
    className?: string
}

export function Markdown({ content, className }: MarkdownProps) {
    return (
        <ReactMarkdown
            components={{
                h1: ({ className, ...props }) => (
                    <>
                        <h1
                            className={cn(
                                "scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-4",
                                className
                            )}
                            {...props}
                        />
                        <Separator className="mb-8" />
                    </>
                ),
                h2: ({ className, ...props }) => (
                    <h2
                        className={cn(
                            "scroll-m-20 text-3xl font-semibold tracking-tight mb-4 mt-8",
                            className
                        )}
                        {...props}
                    />
                ),
                h3: ({ className, ...props }) => (
                    <h3
                        className={cn(
                            "scroll-m-20 text-2xl font-semibold tracking-tight mb-4 mt-6",
                            className
                        )}
                        {...props}
                    />
                ),
                p: ({ className, ...props }) => (
                    <p
                        className={cn(
                            "leading-7 [&:not(:first-child)]:mt-6",
                            className
                        )}
                        {...props}
                    />
                ),
                ul: ({ className, ...props }) => (
                    <ul
                        className={cn(
                            "my-6 ml-6 list-disc [&>li]:mt-2",
                            className
                        )}
                        {...props}
                    />
                ),
                ol: ({ className, ...props }) => (
                    <ol
                        className={cn(
                            "my-6 ml-6 list-decimal [&>li]:mt-2",
                            className
                        )}
                        {...props}
                    />
                ),
                li: ({ className, ...props }) => (
                    <li
                        className={cn(
                            "leading-7",
                            className
                        )}
                        {...props}
                    />
                ),
                a: ({ className, ...props }) => (
                    <a
                        className={cn(
                            "font-medium underline underline-offset-4 hover:text-primary",
                            className
                        )}
                        {...props}
                    />
                ),
                blockquote: ({ className, ...props }) => (
                    <blockquote
                        className={cn(
                            "mt-6 border-l-2 border-primary pl-6 italic",
                            className
                        )}
                        {...props}
                    />
                ),
                img: ({ src, alt }) => (
                    <Card className="overflow-hidden my-6">
                        <Image
                            src={src || ''}
                            alt={alt || ''}
                            width={800}
                            height={400}
                            className="w-full h-auto object-cover"
                        />
                    </Card>
                ),
                code: ({ inline, className, children }: CodeProps) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                        <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code className={cn("bg-muted px-[0.3rem] py-[0.2rem] rounded text-sm font-mono", className)}>
                            {children}
                        </code>
                    )
                },
                pre: ({ className, ...props }) => (
                    <pre
                        className={cn(
                            "overflow-x-auto rounded-lg border bg-black p-4 my-6",
                            className
                        )}
                        {...props}
                    />
                ),
            }}
            className={cn("space-y-6", className)}
        >
            {content}
        </ReactMarkdown>
    )
}

