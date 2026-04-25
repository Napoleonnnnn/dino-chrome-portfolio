import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import { handleCors, requireAuth } from './_lib/auth';

export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!requireAuth(req, res)) return;

  const filename = req.query.filename as string;
  if (!filename) {
    return res.status(400).json({ error: 'filename query parameter is required' });
  }

  // Validate file type
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  if (!allowedExtensions.includes(ext)) {
    return res.status(400).json({
      error: `Invalid file type: ${ext}. Allowed: ${allowedExtensions.join(', ')}`,
    });
  }

  try {
    // Upload to Vercel Blob
    const blob = await put(`journey/${Date.now()}-${filename}`, req, {
      access: 'public',
    });

    return res.status(200).json({
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    console.error('Upload error:', error);
    return res.status(500).json({ error: message });
  }
}
