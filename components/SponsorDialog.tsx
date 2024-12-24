'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Heart } from 'lucide-react'
import { motion } from "framer-motion"

interface SponsorDialogProps {
    isOpen: boolean
    onClose: () => void
}

export function SponsorDialog({ isOpen, onClose }: SponsorDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] w-[95%] mx-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl text-center font-semibold">
                        Our AI System Needs Your Support!
                    </DialogTitle>
                </DialogHeader>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center space-y-6 py-2 sm:py-4"
                >
                    <p className="text-muted-foreground text-sm sm:text-base px-2 sm:px-4">
                        Our AI system is experiencing high traffic. Help us maintain and improve our services by becoming a sponsor!
                    </p>
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full max-w-sm mx-auto hover:scale-105 transition-transform"
                        asChild
                    >
                        <a
                            href="https://github.com/sponsors/hemanth0525"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-2 sm:py-3"
                        >
                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#69d4ff]" />
                            <span className="text-sm sm:text-base">Become a Sponsor</span>
                        </a>
                    </Button>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}
