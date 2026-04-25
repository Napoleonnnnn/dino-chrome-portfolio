import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Journey {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string | null;
  date: string;
  location: string | null;
  coverImage: string | null;
  order: number;
  isPublished: boolean;
}

export default function JourneyManager() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState<Journey | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch Journeys
  const { data: journeys, isLoading } = useQuery<Journey[]>({
    queryKey: ['admin_journeys'],
    queryFn: async () => {
      const res = await fetch('/api/journey?all=true', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch journeys');
      return res.json();
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/journey/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => {
      toast.success('Journey deleted');
      queryClient.invalidateQueries({ queryKey: ['admin_journeys'] });
    },
    onError: (err) => toast.error(err.message)
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this journey?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isCreating || isEditing) {
    return (
      <JourneyForm 
        initialData={isEditing} 
        onClose={() => { setIsEditing(null); setIsCreating(false); }} 
        token={token!}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Journeys</h1>
          <p className="text-muted-foreground text-sm">Manage your timeline entries here.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-foreground text-background px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-foreground/90 transition-colors"
        >
          <Plus size={16} />
          New Journey
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {journeys?.map((journey) => (
                  <tr key={journey.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-mono">
                      {format(new Date(journey.date), 'MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {journey.title}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {journey.location || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${journey.isPublished ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {journey.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setIsEditing(journey)} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(journey.id)} className="p-2 text-red-500/70 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!journeys?.length && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No journeys found. Create one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component for Create/Edit Form
function JourneyForm({ initialData, onClose, token }: { initialData: Journey | null, onClose: () => void, token: string }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    summary: initialData?.summary || '',
    content: initialData?.content || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    location: initialData?.location || '',
    coverImage: initialData?.coverImage || '',
    order: initialData?.order || 0,
    isPublished: initialData?.isPublished ?? true
  });
  
  const [isUploading, setIsUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const url = initialData ? `/api/journey/${initialData.id}` : '/api/journey';
      const method = initialData ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save');
      return result;
    },
    onSuccess: () => {
      toast.success(`Journey ${initialData ? 'updated' : 'created'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['admin_journeys'] });
      onClose();
    },
    onError: (err) => toast.error(err.message)
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: file, // Vercel Blob takes the raw body
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      
      setFormData(prev => ({ ...prev, coverImage: data.url }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{initialData ? 'Edit Journey' : 'Create Journey'}</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-sm font-medium">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card-elevated p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => {
                  const title = e.target.value;
                  // Auto-generate slug if creating new
                  if (!initialData && title) {
                    setFormData(p => ({ ...p, title, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }));
                  } else {
                    setFormData(p => ({ ...p, title }));
                  }
                }}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-md focus:ring-2 focus:ring-foreground/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-md focus:ring-2 focus:ring-foreground/20 outline-none font-mono text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-md focus:ring-2 focus:ring-foreground/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                placeholder="e.g. Jakarta, Remote, etc."
                className="w-full px-3 py-2 bg-secondary border border-border rounded-md focus:ring-2 focus:ring-foreground/20 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Cover Image URL</label>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={formData.coverImage}
                onChange={e => setFormData(p => ({ ...p, coverImage: e.target.value }))}
                placeholder="https://..."
                className="flex-1 px-3 py-2 bg-secondary border border-border rounded-md focus:ring-2 focus:ring-foreground/20 outline-none"
              />
              <span className="text-muted-foreground text-sm">OR</span>
              <label className="cursor-pointer bg-secondary border border-border hover:bg-secondary/70 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors">
                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
              </label>
            </div>
            {formData.coverImage && (
              <div className="mt-3 aspect-video w-48 rounded-md overflow-hidden bg-secondary border border-border">
                <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Summary (for Timeline Card) *</label>
            <textarea
              required
              rows={3}
              value={formData.summary}
              onChange={e => setFormData(p => ({ ...p, summary: e.target.value }))}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-md focus:ring-2 focus:ring-foreground/20 outline-none resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Full Content (Markdown) - Optional</label>
            <textarea
              rows={8}
              value={formData.content}
              onChange={e => setFormData(p => ({ ...p, content: e.target.value }))}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-md focus:ring-2 focus:ring-foreground/20 outline-none resize-y font-mono text-sm"
              placeholder="Write the full story here..."
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={e => setFormData(p => ({ ...p, isPublished: e.target.checked }))}
              className="w-4 h-4 rounded border-border"
            />
            <label htmlFor="isPublished" className="text-sm font-medium cursor-pointer">
              Publish this journey
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-md font-medium text-muted-foreground hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending || isUploading}
            className="px-5 py-2.5 rounded-md font-medium bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            {mutation.isPending && <Loader2 size={16} className="animate-spin" />}
            {initialData ? 'Update Journey' : 'Create Journey'}
          </button>
        </div>
      </form>
    </div>
  );
}
