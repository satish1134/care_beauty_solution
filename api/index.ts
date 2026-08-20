import app from '../server';

export default function handler(req: any, res: any) {
  try {
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
