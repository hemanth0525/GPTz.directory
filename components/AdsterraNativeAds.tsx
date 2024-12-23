import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function AdsterraNativeAds() {
    const adRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const script = document.createElement('script')
        script.async = true
        script.setAttribute('data-cfasync', 'false')
        script.type = 'text/javascript'
        script.src = '//pl25354561.profitablecpmrate.com/9fa17e65afd06a9c8b61c435fc6b42cb/invoke.js'

        const currentRef = adRef.current
        if (currentRef && !currentRef.querySelector('script')) {
            currentRef.appendChild(script)
        }

        return () => {
            if (currentRef) {
                const existingScript = currentRef.querySelector('script')
                if (existingScript) {
                    existingScript.remove()
                }
            }
        }
    }, [])

    return (
        <motion.div
            className="my-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div ref={adRef} className="adsterra-native-ads">
                <div id="container-4b5a10c6f4f7a4f7b3a9f1a2f3c4d5e6"></div>
            </div>
        </motion.div>
    )
}

