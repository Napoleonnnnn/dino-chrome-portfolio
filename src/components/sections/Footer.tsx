import { Github, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 sm:py-12 border-t border-border relative z-10 bg-background" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="text-center sm:text-left">
            <a href="#" className="text-lg sm:text-xl font-semibold tracking-tight" aria-label="dino.dev — go to top">
              dino<span className="text-muted-foreground">.dev</span>
            </a>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              © {currentYear} All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="https://github.com/NapoleonPro"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
              aria-label="GitHub"
            >
              <Github size={16} className="sm:hidden" />
              <Github size={18} className="hidden sm:block" />
            </a>
            <a
              href="https://www.linkedin.com/in/akbar-permana-9073932a3"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} className="sm:hidden" />
              <Linkedin size={18} className="hidden sm:block" />
            </a>
            <a
              href="#"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={16} className="sm:hidden" />
              <Twitter size={18} className="hidden sm:block" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
