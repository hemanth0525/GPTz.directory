'use client'

import Link from 'next/link'
import { Logo } from './Logo'
import { Button } from './ui/button'
import { Github, Rocket, Heart, Menu } from 'lucide-react'
import { AskAI } from './AskAI'
import { AdvertiseDialog } from './AdvertiseDialog'
import { useState } from 'react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-[#69d4ff]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <Logo />
        </Link>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="default" size="sm" className="rounded-full px-4 py-2 text-sm">
            <a
              href="https://github.com/hemanth0525/gptz.directory"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              Star us on GitHub
            </a>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full px-4 py-2 text-sm">
            <a
              href="https://github.com/sponsors/hemanth0525"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-[#69d4ff]" />
              Sponsor
            </a>
          </Button>
          <div className="h-6 w-px bg-[#69d4ff]" />
          <nav className="flex items-center gap-2">
            <Button variant="default" size="sm" className="rounded-full px-4 py-2 text-sm">
              <Rocket className="w-4 h-4 mr-2" />
              <Link href="/submit">Submit GPT</Link>
            </Button>
            <AskAI />
            <div className="h-6 w-px bg-[#69d4ff]" />
            <AdvertiseDialog />
          </nav>
        </div>
        <Button variant="ghost" size="sm" className="md:hidden p-2 rounded-full" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-[#69d4ff] py-4">
          <nav className="container mx-auto px-4 flex flex-col gap-2">
            <Button variant="default" size="sm" className="rounded-full px-4 py-2 text-sm w-full">
              <a
                href="https://github.com/hemanth0525/gptz.directory"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Github className="w-4 h-4" />
                Star us on GitHub
              </a>
            </Button>
            <Button variant="outline" size="sm" className="rounded-full px-4 py-2 text-sm w-full">
              <a
                href="https://github.com/sponsors/hemanth0525"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 text-[#69d4ff]" />
                Sponsor
              </a>
            </Button>
            <Button variant="default" size="sm" className="rounded-full px-4 py-2 text-sm w-full">
              <Rocket className="w-4 h-4 mr-2" />
              <Link href="/submit">Submit GPT</Link>
            </Button>
            <AskAI />
            <AdvertiseDialog />
          </nav>
        </div>
      )}
    </header>
  )
}

