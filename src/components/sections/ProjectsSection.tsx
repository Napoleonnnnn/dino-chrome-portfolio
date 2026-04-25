import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Innovillage Project Submission',
    category: 'Web & AI',
    description: 'Developed a web-based application for the Innovillage 2023 competition, reaching the top 180 finalists.',
    year: '2023',
    link: '#',
  },
  {
    id: 2,
    title: 'Network Admin Scripts',
    category: 'Networking & Automation',
    description: 'A collection of scripts for network automation, created as part of the BNSP Junior Network Administrator certification.',
    year: '2024',
    link: '#',
  },
  {
    id: 3,
    title: 'Personal Portfolio',
    category: 'Web Development',
    description: 'This very website, built with React, Three.js, and Framer Motion to showcase my front-end skills.',
    year: '2024',
    link: '#',
  },
  {
    id: 4,
    title: 'Machine Learning API',
    category: 'AI & Backend',
    description: 'A simple API to serve a pre-trained machine learning model for classification tasks.',
    year: '2023',
    link: '#',
  },
];

export function ProjectsSection() {
  return (
    <section id="work" aria-label="Selected projects" className="min-h-screen-safe relative z-10 flex flex-col justify-center py-16 sm:py-20 md:py-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12"
        >
          <p className="text-mono text-muted-foreground mb-3 sm:mb-4 tracking-widest uppercase">
            Selected Work
          </p>
          <h2 className="heading-lg max-w-2xl">
            Projects I've worked on recently
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {projects.map((project, index) => (
            <motion.a
              key={project.id}
              href={project.link}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="group block"
            >
              <div className="card-elevated flex flex-col h-full">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                    <span className="text-mono text-muted-foreground">
                      {project.category}
                    </span>
                    <span className="text-muted-foreground/30">•</span>
                    <span className="text-mono text-muted-foreground">
                      {project.year}
                    </span>
                  </div>
                  <h3 className="heading-md mb-2 group-hover:text-muted-foreground transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
                <div className="mt-4 sm:mt-6 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View Project <ArrowUpRight size={16} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
