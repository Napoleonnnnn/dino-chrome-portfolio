import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma';
import { handleCors, requireAuth } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  switch (req.method) {
    case 'GET':
      return getJourneys(req, res);
    case 'POST':
      return createJourney(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

/**
 * GET /api/journey
 * Public — returns all published journeys, sorted by order then date.
 * With ?all=true and auth → returns all journeys (including unpublished).
 */
async function getJourneys(req: VercelRequest, res: VercelResponse) {
  const showAll = req.query.all === 'true';

  // If requesting all (admin), require auth
  if (showAll && !requireAuth(req, res)) return;

  const journeys = await prisma.journey.findMany({
    where: showAll ? {} : { isPublished: true },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: [
      { order: 'asc' },
      { date: 'desc' },
    ],
  });

  return res.status(200).json(journeys);
}

/**
 * POST /api/journey
 * Auth required — creates a new journey entry.
 */
async function createJourney(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req, res)) return;

  const { title, slug, summary, content, date, location, coverImage, order, isPublished } = req.body || {};

  if (!title || !slug || !summary || !date) {
    return res.status(400).json({
      error: 'title, slug, summary, and date are required',
    });
  }

  // Check slug uniqueness
  const existing = await prisma.journey.findUnique({ where: { slug } });
  if (existing) {
    return res.status(409).json({ error: `Slug "${slug}" already exists` });
  }

  const journey = await prisma.journey.create({
    data: {
      title,
      slug,
      summary,
      content: content || null,
      date: new Date(date),
      location: location || null,
      coverImage: coverImage || null,
      order: order ?? 0,
      isPublished: isPublished ?? true,
    },
    include: { images: true },
  });

  return res.status(201).json(journey);
}
