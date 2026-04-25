import { motion } from 'framer-motion';
import { Mail, MapPin, Send, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { Footer } from './Footer';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thanks for reaching out! I\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" aria-label="Contact" className="min-h-screen-safe relative z-10 flex flex-col justify-between bg-card/10 backdrop-blur-lg border-y border-border/20">
      <div className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              
              transition={{ duration: 0.6 }}
            >
              <p className="text-mono text-muted-foreground mb-3 sm:mb-4 tracking-widest uppercase">
                Get In Touch
              </p>
              <h2 className="heading-lg mb-6 sm:mb-8">
                Let's work together
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 sm:mb-12 max-w-md">
                Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing.
              </p>

              <div className="space-y-4 sm:space-y-6">
                <a 
                  href="mailto:akpp020405@gmail.com" 
                  className="flex items-center gap-3 sm:gap-4 group"
                  aria-label="Send email to akpp020405@gmail.com"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card flex items-center justify-center border border-border group-hover:bg-foreground group-hover:text-background transition-colors flex-shrink-0">
                    <Mail size={16} className="sm:hidden" />
                    <Mail size={18} className="hidden sm:block" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-mono text-xs text-muted-foreground mb-0.5 sm:mb-1">Email</p>
                    <p className="font-medium group-hover:text-muted-foreground transition-colors text-sm sm:text-base truncate">
                      akpp020405@gmail.com
                    </p>
                  </div>
                  <ArrowUpRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </a>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card flex items-center justify-center border border-border flex-shrink-0">
                    <MapPin size={16} className="sm:hidden" />
                    <MapPin size={18} className="hidden sm:block" />
                  </div>
                  <div>
                    <p className="text-mono text-xs text-muted-foreground mb-0.5 sm:mb-1">Location</p>
                    <p className="font-medium text-sm sm:text-base">Remote / Worldwide</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="card-elevated">
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label htmlFor="contact-name" className="block text-mono text-sm text-muted-foreground mb-1.5 sm:mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/20 transition-all text-sm sm:text-base"
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="contact-email" className="block text-mono text-sm text-muted-foreground mb-1.5 sm:mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/20 transition-all text-sm sm:text-base"
                      placeholder="your@email.com"
                      autoComplete="email"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="contact-message" className="block text-mono text-sm text-muted-foreground mb-1.5 sm:mb-2">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/20 transition-all resize-none text-sm sm:text-base"
                      placeholder="Tell me about your project..."
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    Send Message
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}
