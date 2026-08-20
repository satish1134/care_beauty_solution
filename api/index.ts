import app from '../server';

export default function handler(req: any, res: any) {
  try {
    const matchedPath = req.headers['x-vercel-matched-path'] || req.headers['x-matched-path'] || req.headers['x-rewrite-url'];
    if (matchedPath && typeof matchedPath === 'string') {
      req.url = matchedPath;
    } else if (req.url) {
      const pathOnly = req.url.split('?')[0];
      if (!pathOnly.startsWith('/api')) {
        req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
      }
    }
    return app(req, res);
  } catch (err: any) {
    console.error('[VERCEL HANDLER ERROR]', err);
    return res.status(500).json({
      success: false,
      error: 'Serverless Handler Exception',
      message: err?.message || String(err),
    });
  }
}

