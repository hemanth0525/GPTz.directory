import { Logo } from './Logo'
import { Github, Mail, Send } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-t from-background to-muted py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <Logo />
            <p className="mt-2 text-sm text-muted-foreground">Exploring the AI universe, one GPT at a time.</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <a
              href="https://github.com/hemanth0525/gptz.directory"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Github className="w-6 h-6" />
              <span className="md:hidden">GitHub</span>
            </a>
            <a
              href="mailto:mail@gptz.directory"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Mail className="w-6 h-6" />
              <span className="md:hidden">Email</span>
            </a>
            <a
              href="https://t.me/gptz_directory"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Send className="w-6 h-6" />
              <span className="md:hidden">Telegram</span>
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2023 GPTz.directory. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

