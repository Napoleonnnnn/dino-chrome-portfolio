import { useRef } from 'react';
import { ThemeProvider } from 'next-themes';
import { Navigation } from '../components/Navigation';
import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { ContactSection } from '../components/sections/ContactSection';
import { Footer } from '../components/sections/Footer';
import { FloatingAssets } from '../components/3d/FloatingAssets';
import { StarsBackground } from '../components/StarsBackground';
import { DynamicFavicon } from '../components/DynamicFavicon';

const Index = () => {
  const mainRef = useRef<HTMLElement>(null);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <DynamicFavicon />
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Stars/dots background */}
        <StarsBackground />
        
        {/* Floating 3D Assets - background decoration */}
        <FloatingAssets />
        
        <Navigation scrollContainerRef={mainRef} />
        
        {/* Snap Container - Smooth Scroll */}
        <main ref={mainRef} className="snap-container relative z-10">
          <section className="snap-section h-screen-safe">
            <HeroSection />
          </section>
          <section className="snap-section min-h-screen-safe">
            <ProjectsSection />
          </section>
          <section className="snap-section min-h-screen-safe">
            <AboutSection />
          </section>
          <section className="snap-section min-h-screen-safe">
            <ServicesSection />
          </section>
          <section className="snap-section min-h-screen-safe">
            <ContactSection />
          </section>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;