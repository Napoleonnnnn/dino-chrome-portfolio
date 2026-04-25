import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma/index.js';
import { handleCors, requireAuth } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  switch (req.method) {
    case 'GET':
      return getProjectConfigs(res);
    case 'POST':
      return upsertProjectConfig(req, res);
    case 'DELETE':
      return deleteProjectConfig(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

/**
 * GET /api/projects
 * Public — returns all project configurations.
 */
async function getProjectConfigs(res: VercelResponse) {
  const configs = await prisma.projectConfig.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return res.status(200).json(configs);
}

/**
 * POST /api/projects
 * Auth required — create or update a project configuration.
 */
async function upsertProjectConfig(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req, res)) return;

  const { githubRepoName, customTitle, customDesc, category, isVisible, displayOrder } = req.body || {};

  if (!githubRepoName) {
    return res.status(400).json({ error: 'githubRepoName is required' });
  }

  const config = await prisma.projectConfig.upsert({
    where: { githubRepoName },
    update: {
      customTitle: customTitle ?? undefined,
      customDesc: customDesc ?? undefined,
      category: category ?? undefined,
      isVisible: isVisible ?? undefined,
      displayOrder: displayOrder ?? undefined,
    },
    create: {
      githubRepoName,
      customTitle: customTitle || null,
      customDesc: customDesc || null,
      category: category || null,
      isVisible: isVisible ?? true,
      displayOrder: displayOrder ?? 0,
    },
  });

  return res.status(200).json(config);
}

/**
 * DELETE /api/projects?id=xxx
 * Auth required — delete a project configuration.
 */
async function deleteProjectConfig(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req, res)) return;

  const id = req.query.id as string;
  if (!id) {
    return res.status(400).json({ error: 'id query parameter is required' });
  }

  try {
    await prisma.projectConfig.delete({ where: { id } });
    return res.status(200).json({ success: true });
  } catch {
    return res.status(404).json({ error: 'Project config not found' });
  }
}
