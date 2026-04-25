import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Octokit } from 'octokit';
import { handleCors } from '../_lib/auth.js';

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'Napoleonnnnn';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''; // Optional, increases rate limit

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const octokit = new Octokit({
      auth: GITHUB_TOKEN || undefined,
    });

    const { data: repos } = await octokit.rest.repos.listForUser({
      username: GITHUB_USERNAME,
      sort: 'updated',
      per_page: 100,
      type: 'owner',
    });

    // Return simplified repo data
    const simplified = repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      isForked: repo.fork,
      updatedAt: repo.updated_at,
      createdAt: repo.created_at,
      topics: repo.topics || [],
    }));

    // Cache for 5 minutes
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    return res.status(200).json(simplified);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch repos';
    console.error('GitHub API error:', error);
    return res.status(500).json({ error: message });
  }
}
