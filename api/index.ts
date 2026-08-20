import app from '../server';

export default function handler(req: any, res: any) {
  try {
    if (req.url) {
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

