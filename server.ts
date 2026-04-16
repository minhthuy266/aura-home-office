import express from 'express';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const isProd = process.env.NODE_ENV === 'production';

let vite: any;
if (!isProd) {
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  // Production
  app.use(express.static(resolve(__dirname, 'dist')));
}

app.all(/.*/, (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/wp-json')) {
    return next();
  }
  
  if (isProd) {
    res.sendFile(resolve(__dirname, 'dist/index.html'));
  } else {
    try {
      let html = fs.readFileSync(resolve(__dirname, 'index.html'), 'utf-8');
      html = vite.transformIndexHtml(req.originalUrl, html);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      res.status(500).end(e.message);
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
