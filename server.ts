import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Load Snippe API key safely or default to the verified live/sim token
const SNIPPE_SECRET_KEY = process.env.SNIPPE_SECRET_KEY || 'snippe_sec_live_9f8s2d7162bd';

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', snippeConfigured: !!process.env.SNIPPE_SECRET_KEY });
});

// Create Snippe Checkout Session (TEMPORARILY DISABLED FOR CLIENT-SIDE HOSTED REDIRECTS)
// Feel free to restore this block once Snippe account verification is complete.
app.post('/api/create-checkout-session', async (req, res) => {
  return res.status(503).json({ 
    error: 'Backend integration paused', 
    message: 'The Framsirona Store is temporarily configured to utilize direct Snippe Hosted Payment Page redirects rather than API checkout sessions.' 
  });
});

// Verify Snippe Checkout Session (TEMPORARILY DISABLED FOR CLIENT-SIDE HOSTED REDIRECTS)
app.get('/api/verify-checkout-session', async (req, res) => {
  return res.status(503).json({ 
    error: 'Backend session lookup paused', 
    message: 'The Framsirona Store is temporarily configured to utilize client-side verification for direct Snippe Hosted redirects.' 
  });
});

// Setup Vite Dev server or static asset serving in full compliance with framework architecture
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Full-stack express development server active on http://localhost:${PORT}`);
  });
}

start();
