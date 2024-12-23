import './globals.css'
import { Space_Grotesk } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import CursorTrialEffect from '@/components/CursorTrialEffect'
import { SpaceToaster } from '@/components/ui/space-toaster'
import Script from 'next/script'
import { Suspense } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'
import ScrollToTop from '@/components/ScrollToTop'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })


export const metadata = {
  title: 'GPTz.directory - Explore the AI Universe',
  description: 'Discover a vast galaxy of GPTs for every need in our futuristic directory.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || ''}`} />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || ''}');
        `}
        </Script>
        <script async data-cfasync="false" src="//pl25354561.profitablecpmrate.com/9fa17e65afd06a9c8b61c435fc6b42cb/invoke.js"></script>
        <meta name='admaven-placement' content='Bqdn4rHU8'></meta>
      </head>
      <body className={spaceGrotesk.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen space-bg">
            <Header />
            <main className="flex-grow pt-16">
              <ScrollToTop />
              <Suspense fallback={<LoadingSpinner />}>
                {children}
              </Suspense>
            </main>
            <Footer />
          </div>
        </AuthProvider>
        <SpaceToaster />
        <CursorTrialEffect />
      </body>
    </html>
  )
}

