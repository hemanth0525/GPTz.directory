import { Logo } from './Logo'
import { Github, Mail, Send } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-t from-background to-muted py-6 sm:py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          <div className="w-full md:w-auto text-center md:text-left">
            <Logo />
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-[300px] mx-auto md:mx-0">
              Exploring the AI universe, one GPT at a time.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
            <a
              href="https://github.com/hemanth0525/gptz.directory"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 p-2"
            >
              <Github className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-sm sm:text-base sm:hidden">GitHub</span>
            </a>
            <a
              href="mailto:mail@gptz.directory"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 p-2"
            >
              <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-sm sm:text-base sm:hidden">Email</span>
            </a>
            <a
              href="https://t.me/gptz_directory"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 p-2"
            >
              <Send className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-sm sm:text-base sm:hidden">Telegram</span>
            </a>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">&copy; 2023 GPTz.directory. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

