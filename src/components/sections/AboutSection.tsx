import { motion } from 'framer-motion';

const stats = [
  { value: '~2.5', label: 'Years of Experience' },
  { value: '6+', label: 'Projects Completed' },
  { value: 'Top 180', label: 'Innovillage 2023 Finalist' },
];

export function AboutSection() {
  return (
    <section id="about" aria-label="About me" className="min-h-screen-safe relative z-10 flex items-center justify-center bg-card/10 backdrop-blur-lg border-y border-border/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            
            transition={{ duration: 0.6 }}
          >
            <p className="text-mono text-muted-foreground mb-3 sm:mb-4 tracking-widest uppercase">
              About Me
            </p>
            <h2 className="heading-lg mb-6 sm:mb-8">
              A developer who cares about craft
            </h2>
            <div className="space-y-4 sm:space-y-6 text-muted-foreground text-base sm:text-lg leading-relaxed">
              <p>
                I'm a creative developer based in the digital realm, passionate about building beautiful and functional web experiences that make a difference.
              </p>
              <p>
                With expertise in modern web technologies and a keen eye for design, I bridge the gap between aesthetics and functionality. Every project is an opportunity to create something meaningful.
              </p>
              <p>
                When I'm not coding, you'll find me exploring new design trends, contributing to open source, or probably playing the Chrome Dino game offline.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 gap-4 sm:gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="card-elevated text-center md:text-left"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-mono">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}