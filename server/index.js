import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { sendEmail, CONTACT_RECIPIENT } from './email.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');
const PROJECTS_FILE = process.env.PROJECTS_FILE || path.resolve(__dirname, 'data/projects.json');
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '50kb' }));

async function loadProjects() {
  const raw = await fs.readFile(PROJECTS_FILE, 'utf8');
  const { projects = [] } = JSON.parse(raw);
  const clean = (v) => (typeof v === 'string' ? v.replace(/_/g, ' ') : v);
  return projects.map((p) => ({
    ...p,
    category: clean(p.category),
    typeOfProject: clean(p.typeOfProject),
    typeOfProduct: clean(p.typeOfProduct),
    projectImages: p.projectImages || [],
    projectLanguages: p.projectLanguages || [],
    projectProgress: p.projectProgress || [],
    projectFeaturedText: p.projectFeaturedText || '',
  }));
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/projects', async (_req, res) => {
  try {
    res.json(await loadProjects());
  } catch (error) {
    console.error('Failed to load projects:', error);
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = (await loadProjects()).find((p) => String(p.id) === req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    console.error('Failed to load project:', error);
    res.status(500).json({ error: 'Failed to load project' });
  }
});

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

app.post('/api/send-contact-email', async (req, res) => {
  const { name = '', from, message } = req.body || {};

  if (typeof from !== 'string' || typeof message !== 'string' || !from.trim() || !message.trim()) {
    return res.status(400).json({ success: false, error: 'Email address and message are required' });
  }
  if (typeof name !== 'string' || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from) || from.length > 254 || message.length > 5000) {
    return res.status(400).json({ success: false, error: 'Invalid name, email or message too long' });
  }

  try {
    await sendEmail({
      to: CONTACT_RECIPIENT,
      replyTo: from,
      subject: `New contact form message${name ? ` from ${name.replace(/[\r\n]+/g, ' ')}` : ''}`,
      text: `From: ${name} <${from}>\n\nMessage: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(from)}&gt;</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
            <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
          <p style="color: #777; font-size: 12px;">This message was sent from your website's contact form.</p>
        </div>`,
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to send contact email:', error.message);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

// Serve the built React app; unknown paths fall back to index.html for client-side routing.
app.use(express.static(DIST_DIR));
app.get('*', (_req, res, next) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'), (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => console.log(`Server available on http://localhost:${PORT}`));
