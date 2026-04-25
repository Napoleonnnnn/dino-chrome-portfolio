import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';

// Dummy data — will be replaced with API fetch from CMS later
const journeyData = [
  {
    id: '1',
    date: '2024',
    title: 'Started AI Engineering Journey',
    description: 'Began exploring the world of Artificial Intelligence and Machine Learning. Built my first classification model and deployed it as an API.',
    imageUrl: null,
    location: 'Self-learning',
  },
  {
    id: '2',
    date: '2024',
    title: 'BNSP Junior Network Administrator',
    description: 'Earned the BNSP certification for Junior Network Administrator. Created automation scripts for network configuration and management.',
    imageUrl: null,
    location: 'BNSP Certification',
  },
  {
    id: '3',
    date: '2023',
    title: 'Innovillage 2023 — Top 180 Finalist',
    description: 'Developed a web-based application for the Innovillage competition and reached the top 180 finalists nationwide. A great experience in teamwork and product development.',
    imageUrl: null,
    location: 'National Competition',
  },
  {
    id: '4',
    date: '2023',
    title: 'Discovered Web Development',
    description: 'Fell in love with building for the web. Started learning HTML, CSS, JavaScript, and React. Built my first interactive projects.',
    imageUrl: null,
    location: 'Self-learning',
  },
  {
    id: '5',
    date: '2022',
    title: 'The Beginning',
    description: 'Started my journey into the world of programming. Wrote my first lines of code and realized this is what I want to do.',
    imageUrl: null,
    location: 'University',
  },
];

interface JourneyEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl: string | null;
  location?: string;
}

function TimelineCard({ entry, index }: { entry: JourneyEntry; index: number }) {
  const isLeft = index % 2 === 0;

  return (
    <div className="relative flex items-start md:items-center w-full mb-8 sm:mb-12 md:mb-0">
      {/* Desktop layout — alternating left/right */}
      <div className={`hidden md:flex w-full items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Card side */}
        <div className="w-[calc(50%-2rem)]">
          <motion.div
            initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card-elevated group"
          >
            {/* Image */}
            {entry.imageUrl && (
              <div className="mb-4 rounded-xl overflow-hidden aspect-video bg-secondary">
                <img
                  src={entry.imageUrl}
                  alt={entry.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            )}

            {/* Meta */}
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center gap-1.5 text-mono text-muted-foreground">
                <Calendar size={14} />
                {entry.date}
              </span>
              {entry.location && (
                <>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="flex items-center gap-1.5 text-mono text-muted-foreground">
                    <MapPin size={14} />
                    {entry.location}
                  </span>
                </>
              )}
            </div>

            <h3 className="heading-md mb-2">{entry.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {entry.description}
            </p>
          </motion.div>
        </div>

        {/* Center dot on the timeline */}
        <div className="flex-shrink-0 w-16 flex items-center justify-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="w-4 h-4 rounded-full bg-foreground border-4 border-background shadow-sm"
          />
        </div>

        {/* Empty side (for alignment) */}
        <div className="w-[calc(50%-2rem)]">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className={`text-mono text-muted-foreground text-lg ${isLeft ? 'text-left' : 'text-right'}`}
          >
            {entry.date}
          </motion.div>
        </div>
      </div>

      {/* Mobile layout — single column with line on the left */}
      <div className="flex md:hidden w-full">
        {/* Left line + dot */}
        <div className="flex-shrink-0 w-8 sm:w-10 flex flex-col items-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-foreground border-[3px] border-background shadow-sm mt-1"
          />
        </div>

        {/* Card */}
        <div className="flex-grow min-w-0 pb-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4 }}
            className="card-elevated"
          >
            {/* Image */}
            {entry.imageUrl && (
              <div className="mb-3 rounded-lg overflow-hidden aspect-video bg-secondary">
                <img
                  src={entry.imageUrl}
                  alt={entry.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="flex items-center gap-1 text-mono text-muted-foreground text-xs">
                <Calendar size={12} />
                {entry.date}
              </span>
              {entry.location && (
                <>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="flex items-center gap-1 text-mono text-muted-foreground text-xs">
                    <MapPin size={12} />
                    {entry.location}
                  </span>
                </>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-semibold mb-1.5">{entry.title}</h3>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              {entry.description}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function JourneySection() {
  return (
    <section id="journey" aria-label="My Journey" className="min-h-screen-safe relative z-10 flex flex-col justify-center py-16 sm:py-20 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 text-center"
        >
          <p className="text-mono text-muted-foreground mb-3 sm:mb-4 tracking-widest uppercase">
            My Journey
          </p>
          <h2 className="heading-lg max-w-2xl mx-auto">
            Where I've been so far
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical line — desktop (center) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

          {/* Vertical line — mobile (left side) */}
          <div className="md:hidden absolute left-[15px] sm:left-[19px] top-0 bottom-0 w-px bg-border" />

          {/* Journey entries */}
          <div className="md:space-y-16">
            {journeyData.map((entry, index) => (
              <TimelineCard key={entry.id} entry={entry} index={index} />
            ))}
          </div>

          {/* End dot */}
          <div className="flex justify-center md:justify-center mt-4 md:mt-8 relative z-10">
            <div className="md:absolute md:left-1/2 md:-translate-x-1/2 ml-[9px] sm:ml-[13px] md:ml-0">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="w-3 h-3 rounded-full bg-muted-foreground/40"
              />
            </div>
          </div>

          {/* "To be continued" label */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-mono text-muted-foreground/50 mt-6 text-xs sm:text-sm"
          >
            to be continued...
          </motion.p>
        </div>
      </div>
    </section>
  );
}
