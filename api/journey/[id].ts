import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma.js';
import { handleCors, requireAuth } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  const { id } = req.query;
  const journeyId = Array.isArray(id) ? id[0] : id;

  if (!journeyId) {
    return res.status(400).json({ error: 'Journey ID or slug is required' });
  }

  switch (req.method) {
    case 'GET':
      return getJourney(journeyId, res);
    case 'PUT':
      return updateJourney(journeyId, req, res);
    case 'DELETE':
      return deleteJourney(journeyId, req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

/**
 * GET /api/journey/[id]
 * Public — fetch a single journey by ID or slug.
 * Includes gallery images.
 */
async function getJourney(idOrSlug: string, res: VercelResponse) {
  // Try by ID first, then by slug
  let journey = await prisma.journey.findUnique({
    where: { id: idOrSlug },
    include: {
      images: { orderBy: { order: 'asc' } },
    },
  });

  if (!journey) {
    journey = await prisma.journey.findUnique({
      where: { slug: idOrSlug },
      include: {
        images: { orderBy: { order: 'asc' } },
      },
    });
  }

  if (!journey) {
    return res.status(404).json({ error: 'Journey not found' });
  }

  return res.status(200).json(journey);
}

/**
 * PUT /api/journey/[id]
 * Auth required — update a journey entry.
 * Also supports adding/removing images via `images` array.
 */
async function updateJourney(id: string, req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req, res)) return;

  const { title, slug, summary, content, date, location, coverImage, order, isPublished, images } = req.body || {};

  // Build update data — only include fields that are provided
  const updateData: Record<string, unknown> = {};
  if (title !== undefined) updateData.title = title;
  if (slug !== undefined) updateData.slug = slug;
  if (summary !== undefined) updateData.summary = summary;
  if (content !== undefined) updateData.content = content;
  if (date !== undefined) updateData.date = new Date(date);
  if (location !== undefined) updateData.location = location;
  if (coverImage !== undefined) updateData.coverImage = coverImage;
  if (order !== undefined) updateData.order = order;
  if (isPublished !== undefined) updateData.isPublished = isPublished;

  try {
    const journey = await prisma.journey.update({
      where: { id },
      data: updateData,
      include: { images: { orderBy: { order: 'asc' } } },
    });

    // If images array is provided, sync them
    if (Array.isArray(images)) {
      // Delete existing images
      await prisma.journeyImage.deleteMany({ where: { journeyId: id } });

      // Create new images
      if (images.length > 0) {
        await prisma.journeyImage.createMany({
          data: images.map((img: { imageUrl: string; caption?: string; order?: number }, i: number) => ({
            journeyId: id,
            imageUrl: img.imageUrl,
            caption: img.caption || null,
            order: img.order ?? i,
          })),
        });
      }

      // Re-fetch with updated images
      const updated = await prisma.journey.findUnique({
        where: { id },
        include: { images: { orderBy: { order: 'asc' } } },
      });
      return res.status(200).json(updated);
    }

    return res.status(200).json(journey);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.includes('Record to update not found')) {
      return res.status(404).json({ error: 'Journey not found' });
    }
    return res.status(500).json({ error: message });
  }
}

/**
 * DELETE /api/journey/[id]
 * Auth required — delete a journey and its images.
 */
async function deleteJourney(id: string, req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req, res)) return;

  try {
    await prisma.journey.delete({ where: { id } });
    return res.status(200).json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.includes('Record to delete does not exist')) {
      return res.status(404).json({ error: 'Journey not found' });
    }
    return res.status(500).json({ error: message });
  }
}
