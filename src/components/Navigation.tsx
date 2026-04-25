import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useActiveSection } from '../hooks/useActiveSection';

const navItems = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contact' },
];
const sectionIds = navItems.map(item => item.href.substring(1));

type NavigationProps = {
  scrollContainerRef: React.RefObject<HTMLElement>;
};

export function Navigation({ scrollContainerRef }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  const lastScrollY = useRef(0);
  const mouseAtTop = useRef(true);
  const activeSection = useActiveSection(sectionIds);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const masterLogicHandler = () => {
      const currentScrollY = scrollContainer.scrollTop;
      const inHero = currentScrollY < 100;
      
      // Exception: Always show in hero section
      if (inHero) {
        setIsVisible(true);
        return;
      }
      
      const scrollingUp = currentScrollY < lastScrollY.current;

      // Show if scrolling up OR if mouse is at the top
      if (scrollingUp || mouseAtTop.current) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseAtTop.current = e.clientY < 100;
      masterLogicHandler();
    };

    const handleScroll = () => {
      const currentScrollY = scrollContainer.scrollTop;
      setIsScrolled(currentScrollY > 50);
      masterLogicHandler();
      lastScrollY.current = currentScrollY;
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [scrollContainerRef]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50' 
          : 'bg-transparent'
      } ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{ willChange: 'transform' }}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-12" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="#" className="text-lg sm:text-xl font-semibold tracking-tight" aria-label="dino.dev — go to homepage">
            dino<span className="text-muted-foreground">.dev</span>
          </a>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-8 lg:gap-12">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`text-sm transition-colors duration-300 link-underline ${
                      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            
            {/* CTA Button */}
            <a 
              href="#contact" 
              className="hidden md:block text-sm font-medium px-5 py-2 lg:px-6 lg:py-2.5 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
            >
              Let's Talk
            </a>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-nav-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-xl -mx-4 sm:-mx-6 px-4 sm:px-6"
            >
              <ul className="py-4 sm:py-6 space-y-1">
                {navItems.map((item, index) => (
                  <motion.li 
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-3 sm:py-4 text-base sm:text-lg text-muted-foreground hover:text-foreground transition-colors active:text-foreground"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
                {/* Mobile CTA */}
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  className="pt-2"
                >
                  <a 
                    href="#contact" 
                    onClick={() => setIsOpen(false)}
                    className="block text-center text-sm font-medium px-6 py-3 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
                  >
                    Let's Talk
                  </a>
                </motion.li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
