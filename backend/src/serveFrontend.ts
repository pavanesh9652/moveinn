import fs from 'fs';
import path from 'path';
import type { Express, Request, Response, NextFunction } from 'express';
import express from 'express';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getFrontendDist(): string | null {
  const dist =
    process.env.FRONTEND_DIST ??
    path.resolve(path.join(__dirname, '..'), '../frontend/dist');

  return fs.existsSync(dist) ? dist : null;
}

function resolveHtmlFile(dist: string, urlPath: string): string | null {
  const normalized = urlPath.replace(/\/$/, '') || '/';

  if (normalized === '/') {
    const indexPath = path.join(dist, 'index.html');
    return fs.existsSync(indexPath) ? indexPath : null;
  }

  const withoutLeadingSlash = normalized.slice(1);

  const candidates = [
    path.join(dist, `${withoutLeadingSlash}.html`),
    path.join(dist, withoutLeadingSlash, 'index.html'),
  ];

  if (normalized.startsWith('/property/')) {
    candidates.unshift(path.join(dist, 'property/[id].html'));
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  const fallback = path.join(dist, 'index.html');
  return fs.existsSync(fallback) ? fallback : null;
}

export function mountFrontend(app: Express) {
  const frontendDist = getFrontendDist();
  if (!frontendDist) {
    return;
  }

  app.use(express.static(frontendDist));

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      next();
      return;
    }

    if (req.path.startsWith('/api') || req.path.startsWith('/images')) {
      next();
      return;
    }

    const htmlFile = resolveHtmlFile(frontendDist, req.path);
    if (htmlFile) {
      res.sendFile(htmlFile);
      return;
    }

    next();
  });
}
