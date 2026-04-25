import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, MapPin, ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Journey, JourneyImage } from '@/types';

type JourneyWithImages = Journey & {
  images: JourneyImage[];
};

export default function JourneyDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: journey, isLoading, error } = useQuery<JourneyWithImages>({
    queryKey: ['journey', slug],
    queryFn: async () => {
      const res = await fetch(`/api/journey/${slug}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error('Journey not found');
        throw new Error('Failed to fetch journey');
      }
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-mono">Loading transmission...</p>
        </div>
      </div>
    );
  }

  if (error || !journey) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-6xl font-black text-destructive mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-6">Timeline Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          The journey you are looking for seems to have been lost in the digital void.
        </p>
        <Link 
          to="/" 
          className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-all flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Return to Base
        </Link>
      </div>
    );
  }

  // Format date
  const dateObj = new Date(journey.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 w-full">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <Link 
            to="/#journey" 
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 font-medium"
          >
            <ArrowLeft size={18} />
            Back to Timeline
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <header className="mb-12">
          {journey.coverImage ? (
            <div className="w-full aspect-[21/9] md:aspect-[3/1] rounded-2xl overflow-hidden mb-8 shadow-2xl shadow-primary/5 border border-border/50 relative group">
              <img 
                src={journey.coverImage} 
                alt={journey.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none"></div>
            </div>
          ) : (
            <div className="w-full aspect-[21/9] md:aspect-[3/1] rounded-2xl overflow-hidden mb-8 bg-secondary/50 border border-border/50 flex items-center justify-center text-muted-foreground/50">
              <ImageIcon size={48} />
            </div>
          )}

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {journey.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-mono">
              <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
                <Calendar size={14} />
                <span>{formattedDate}</span>
              </div>
              
              {journey.location && (
                <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
                  <MapPin size={14} />
                  <span>{journey.location}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Section (Markdown) */}
        <article className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl prose-img:border prose-img:border-border/50 prose-hr:border-border/50 prose-blockquote:border-l-primary prose-blockquote:bg-secondary/20 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-muted-foreground">
          {journey.content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {journey.content}
            </ReactMarkdown>
          ) : (
            <p className="text-muted-foreground text-center py-12 italic">
              Detailed transmission for this journey is currently unavailable.
            </p>
          )}
        </article>

        {/* Gallery Section if exists */}
        {journey.images && journey.images.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border/40">
            <h3 className="text-2xl font-bold mb-6">Mission Artifacts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {journey.images.map((img) => (
                <div key={img.id} className="group relative rounded-xl overflow-hidden border border-border/50 aspect-square">
                  <img 
                    src={img.imageUrl} 
                    alt={img.caption || 'Journey artifact'} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/90 via-background/60 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-sm font-medium text-foreground">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
