'use client'

import { useEffect } from 'react'

export function AdsterraNative({ className = "" }: { className?: string }) {
    useEffect(() => {
        const script = document.createElement('script')
        script.async = true
        script.dataset.cfasync = 'false'
        script.src = "//pl25354561.profitablecpmrate.com/9fa17e65afd06a9c8b61c435fc6b42cb/invoke.js"

        const container = document.createElement('div')
        container.id = "container-9fa17e65afd06a9c8b61c435fc6b42cb"

        document.body.appendChild(script)
        document.body.appendChild(container)

        return () => {
            document.body.removeChild(script)
            if (container.parentNode) {
                document.body.removeChild(container)
            }
        }
    }, [])

    return (
        <div
            id="container-9fa17e65afd06a9c8b61c435fc6b42cb"
            className={`my-8 px-4 py-6 bg-background/50 backdrop-blur-sm rounded-lg ${className}`}
        />
    )
}
