'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Megaphone } from 'lucide-react'
import Image from 'next/image'

const emailProviders = [
    {
        name: 'Gmail',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
        url: `https://mail.google.com/mail/u/0/?view=cm&tf=0&to=mail@gptz.directory&su=Advertise%20our%20product&body=${encodeURIComponent(
            'Hello GPTz.directory team,\n\n' +
            'I would like to inquire about advertising opportunities for our product.\n\n' +
            'Product Name:\n' +
            'Website:\n' +
            'Brief Description:\n\n' +
            'Thank you for your time and consideration.\n\n' +
            'Best regards,\n' +
            '[Your Name]'
        )}`
    },
    {
        name: 'Outlook',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg',
        url: `https://outlook.office.com/mail/deeplink/compose?to=mail@gptz.directory&subject=Advertise%20our%20product&body=${encodeURIComponent(
            'Hello GPTz.directory team,\n\n' +
            'I would like to inquire about advertising opportunities for our product.\n\n' +
            'Product Name:\n' +
            'Website:\n' +
            'Brief Description:\n\n' +
            'Thank you for your time and consideration.\n\n' +
            'Best regards,\n' +
            '[Your Name]'
        )}`
    },
    {
        name: 'Yahoo',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Yahoo.png',
        url: `https://compose.mail.yahoo.com/?to=mail@gptz.directory&subject=Advertise%20our%20product&body=${encodeURIComponent(
            'Hello GPTz.directory team,\n\n' +
            'I would like to inquire about advertising opportunities for our product.\n\n' +
            'Product Name:\n' +
            'Website:\n' +
            'Brief Description:\n\n' +
            'Thank you for your time and consideration.\n\n' +
            'Best regards,\n' +
            '[Your Name]'
        ).replace(/\n/g, '%0D%0A')}`
    }
]

export function AdvertiseDialog() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm" className="rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
                    <Megaphone className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Advertise
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-w-[95vw] overflow-y-auto max-h-[90vh] p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">Advertise with GPTz.directory</DialogTitle>
                </DialogHeader>
                <div className="py-3 sm:py-4">
                    <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                        Reach our growing audience of AI enthusiasts and developers. We&apos;ll feature your product in relevant sections, maximizing your visibility to potential customers.
                    </p>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Why advertise with us?</h3>
                    <ul className="list-disc mb-3 sm:mb-4 text-muted-foreground pl-4 sm:pl-5 text-sm sm:text-base">
                        <li className='mb-1'>Targeted audience of AI professionals and enthusiasts</li>
                        <li className='mb-1'>Customized placement for maximum relevance</li>
                        <li>Affordable rates for startups and established companies</li>
                    </ul>
                    <p className="font-semibold mb-2 text-sm sm:text-base">Ready to get started?</p>
                    <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                        Choose your preferred email provider to contact us, or use the direct email link below.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
                        {emailProviders.map((provider) => (
                            <Button
                                key={provider.name}
                                variant="outline"
                                asChild
                                className="flex items-center justify-center gap-2 h-auto py-2 px-3 w-full"
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
                                        className="w-5 h-5 sm:w-6 sm:h-6"
                                        style={{ objectFit: 'contain' }}
                                        width={24}
                                        height={24}
                                    />
                                    <span className="text-xs sm:text-sm">{provider.name}</span>
                                </a>
                            </Button>
                        ))}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Or email us directly at:{' '}
                        <a
                            href="mailto:mail@gptz.directory"
                            className="text-primary hover:underline"
                        >
                            mail@gptz.directory
                        </a>
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

