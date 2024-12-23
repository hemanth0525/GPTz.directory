import Script from 'next/script';
import Image from 'next/image';

export function AdCard() {
    return (
        <div className="bg-card/40 text-card-foreground p-6 rounded-lg glass-effect backdrop-blur-sm h-full">
            <Script strategy="lazyOnload" src="https://udbaa.com/bnr.php?section=General&pub=623378&format=300x250&ga=g" />
            <noscript><a href="https://yllix.com/publishers/623378" target="_blank"><Image width={300} height={250} src="//ylx-aff.advertica-cdn.com/pub/300x250.png" className="border-none m-0 p-0 align-baseline" alt="ylliX - Online Advertising Network" /></a></noscript>
        </div>
    )
}

