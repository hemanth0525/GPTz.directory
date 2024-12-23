'use client'

import { useEffect, useRef } from 'react'

export function AdCard() {
    const adContainerRef = useRef<HTMLDivElement>(null)
    const adId = `container-${Math.random().toString(36).substr(2, 9)}`

    useEffect(() => {
        const script = document.createElement('script')
        script.async = true
        script.dataset.cfasync = 'false'
        script.src = "//pl25354561.profitablecpmrate.com/9fa17e65afd06a9c8b61c435fc6b42cb/invoke.js"

        if (adContainerRef.current) {
            adContainerRef.current.appendChild(script)
        }

        return () => {
            if (adContainerRef.current) {
                const script = adContainerRef.current.querySelector('script')
                if (script) {
                    script.remove()
                }
            }
        }
    }, [])

    return (
        <div
            ref={adContainerRef}
            id={adId}
            className="bg-card/40 text-card-foreground p-6 rounded-lg h-full glass-effect backdrop-blur-sm"
        />
    )
}
