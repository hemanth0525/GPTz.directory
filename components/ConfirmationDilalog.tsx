import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AskAI } from '@/components/AskAI'
import Link from 'next/link'
import Image from 'next/image'

const createEmailBody = (gptData: ConfirmationDialogProps['gptData']) => {
    const username = gptData.email.split('@')[0];
    return `Hello GPTz.directory team,

I would like to request an edit for an existing GPT listing.

GPT Details:
- Name: ${gptData.name}
- URL: ${gptData.url}
- Category: ${gptData.category}
- Tags: ${gptData.tags.join(', ')}
- Short Description: ${gptData.shortDescription}
- Contact Email: ${gptData.email}

Thank you for your assistance.

Best regards,
${username}`
}

interface ConfirmationDialogProps {

    isOpen: boolean;

    onClose: () => void;

    onConfirm: () => void;

    gptData: {

        name: string;

        email: string;

        url: string;

        shortDescription: string;

        category: string;

        tags: string[];

    };

}


export function ConfirmationDialog({ isOpen, onClose, onConfirm, gptData }: ConfirmationDialogProps) {
    const [showEmailOptions, setShowEmailOptions] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const emailProviders = [
        {
            name: 'Gmail',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
            url: `https://mail.google.com/mail/u/0/?ui=1&view=cm&fs=1&to=mail@gptz.directory&su=Edit GPT Listing: ${encodeURIComponent(gptData.name)}&body=${encodeURIComponent(createEmailBody(gptData))}`
        },
        {
            name: 'Outlook',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg',
            url: `https://outlook.live.com/mail/0/deeplink/compose?v=ComposeLight&to=mail@gptz.directory&subject=Edit GPT Listing: ${encodeURIComponent(gptData.name)}&body=${encodeURIComponent(createEmailBody(gptData))}`
        },
        {
            name: 'Yahoo',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Yahoo.png',
            url: `https://compose.mail.yahoo.com/?to=mail@gptz.directory&subject=Edit GPT Listing: ${encodeURIComponent(gptData.name)}&body=${encodeURIComponent(createEmailBody(gptData)).replace(/\n/g, '%0D%0A')}`
        },
    ]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirm Submission</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="mb-4">
                        We have automated many AI/GPT tool entries. Please check if we haven&apos;t already listed yours using our AskAI or search feature on our home page.
                    </p>
                    <div className="flex justify-between mb-4">
                        <Button size='sm' asChild>
                            <Link href="/">Go to Home Page</Link>
                        </Button>
                        <AskAI />
                    </div>
                    <p className="mb-4">
                        If we have already listed your GPT and you need to edit the page, please contact us:
                    </p>
                    {showEmailOptions ? (
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            {emailProviders.map((provider) => (
                                <Button
                                    key={provider.name}
                                    variant="outline"
                                    asChild
                                    className="flex items-center gap-2 h-auto py-2 px-3"
                                >
                                    <a
                                        href={provider.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2"
                                    >
                                        <Image
                                            src={provider.logo}
                                            alt={`${provider.name} logo`}
                                            className="w-6 h-6"
                                            style={{ objectFit: 'contain' }}
                                            width={24}
                                            height={24}
                                        />
                                        <span className="text-sm">{provider.name}</span>
                                    </a>
                                </Button>
                            ))}
                        </div>
                    ) : (
                        <Button onClick={() => setShowEmailOptions(true)} className="mb-4">
                            Contact Us
                        </Button>
                    )}
                    <p className="text-sm text-muted-foreground mb-4">
                        Or email us directly at:{' '}
                        <a href="mailto:mail@gptz.directory" className="text-primary hover:underline">
                            mail@gptz.directory
                        </a>
                    </p>
                </div>
                <DialogFooter>
                    <Button onClick={() => {
                        setIsSubmitting(true);
                        onConfirm();
                    }} disabled={isSubmitting}>
                        {isSubmitting ? "Launching..." : "Confirm Submission"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

