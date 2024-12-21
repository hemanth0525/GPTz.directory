'use client'

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { X } from 'lucide-react'

export function SpaceToaster() {
    const { toasts } = useToast()

    return (
        <ToastProvider>
            {toasts.map(function ({ id, title, description, action, ...props }) {
                return (
                    <Toast
                        key={id}
                        {...props}
                        className="relative group overflow-hidden border-0 bg-black/80 backdrop-blur-xl text-white"
                    >
                        {/* Shooting star animation */}
                        <motion.div
                            className="absolute w-px h-px bg-white"
                            initial={{
                                top: '20%',
                                left: '100%',
                                opacity: 0,
                                height: '1px',
                                width: '20px',
                                rotate: -45,
                                boxShadow: '0 0 4px #fff',
                            }}
                            animate={{
                                left: '-20%',
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatDelay: 3,
                            }}
                        />

                        {/* Purple accent line */}
                        <div className="absolute left-0 top-0 h-full w-[2px] bg-[#8B5CF6]" />

                        <div className="relative z-10 grid gap-1 pl-4">
                            {title && (
                                <ToastTitle className="text-sm font-medium text-[#8B5CF6]">
                                    {title}
                                </ToastTitle>
                            )}
                            {description && (
                                <ToastDescription className="text-xs text-zinc-400">
                                    {description}
                                </ToastDescription>
                            )}
                        </div>
                        {action}
                        <ToastClose className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                            <X className="h-4 w-4 text-zinc-400" />
                            <span className="sr-only">Close</span>
                        </ToastClose>
                    </Toast>
                )
            })}
            <ToastViewport className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-[380px]" />
        </ToastProvider>
    )
}
