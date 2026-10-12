import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;

const ADMIN_EMAIL_NORMALIZED = 'nasirhussain12489@gmail.com';
const SALT = 'rsc_horanda_salt_2026';
const ADMIN_PASSWORD_HASH = crypto
  .createHash('sha256')
  .update(SALT + '9934886605dilD@')
  .digest('hex');

function hashPassword(plain: string): string {
  return crypto
    .createHash('sha256')
    .update(SALT + plain)
    .digest('hex');
}

// Persistent Server-Side JSON Database File
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE_PATH = path.join(DATA_DIR, 'reyaz_store_db.json');

function ensureDbDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readServerDb(): Record<string, unknown> {
  try {
    ensureDbDir();
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading server DB:', err);
  }
  return {};
}

function writeServerDb(nextState: Record<string, unknown>) {
  try {
    ensureDbDir();
    const existing = readServerDb();
    const merged = {
      ...existing,
      ...nextState,
      lastSavedAt: new Date().toISOString(),
    };
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(merged, null, 2), 'utf-8');
    return merged;
  } catch (err) {
    console.error('Error writing server DB:', err);
    return nextState;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // 1. Persistent Database Read & Write APIs
  app.get('/api/db/state', (_req, res) => {
    const data = readServerDb();
    res.json({ success: true, data });
  });

  app.post('/api/db/save', (req, res) => {
    const payload = req.body || {};
    const saved = writeServerDb(payload);
    res.json({ success: true, lastSavedAt: saved.lastSavedAt });
  });

  // 1b. ImgBB Image Upload Endpoint (All product, banner & profile images saved to https://imgbb.com/)
  app.post('/api/upload-imgbb', async (req, res) => {
    try {
      const { imageBase64, name } = req.body || {};
      if (!imageBase64 || typeof imageBase64 !== 'string') {
        return res
          .status(400)
          .json({ success: false, error: 'Missing imageBase64 payload' });
      }

      const apiKey =
        process.env.IMGBB_API_KEY || '9551c6c91a49c0c4b17819b26554d812';
      const cleanedBase64 = imageBase64.replace(
        /^data:image\/[a-zA-Z0-9+.-]+;base64,/,
        ''
      );

      const formBody = new URLSearchParams();
      formBody.append('key', apiKey);
      formBody.append('image', cleanedBase64);
      if (name) {
        formBody.append(
          'name',
          String(name)
            .replace(/[^a-zA-Z0-9_-]/g, '-')
            .slice(0, 60)
        );
      }

      const imgbbRes = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString(),
      });

      const imgbbJson = (await imgbbRes.json()) as {
        success?: boolean;
        data?: {
          url?: string;
          display_url?: string;
          thumb?: { url?: string };
          delete_url?: string;
        };
        error?: { message?: string };
      };

      if (!imgbbRes.ok || !imgbbJson?.success || !imgbbJson?.data?.url) {
        return res.status(502).json({
          success: false,
          error:
            imgbbJson?.error?.message || 'ImgBB upload failed from server',
        });
      }

      return res.json({
        success: true,
        url: imgbbJson.data.display_url || imgbbJson.data.url,
        rawUrl: imgbbJson.data.url,
        thumbUrl: imgbbJson.data.thumb?.url || imgbbJson.data.url,
        deleteUrl: imgbbJson.data.delete_url || null,
      });
    } catch (err) {
      console.error('ImgBB upload error:', err);
      return res
        .status(500)
        .json({ success: false, error: 'Server error uploading to ImgBB' });
    }
  });

  // 2. Server-Side Management Login (Super Admin & Seller Accounts)
  app.post('/api/auth/management-login', (req, res) => {
    const { email, password, role = 'super_admin', sellers = [] } = req.body || {};
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const plainPass = String(password || '');
    const incomingHash = hashPassword(plainPass);

    // Super Admin Verification
    if (
      normalizedEmail === ADMIN_EMAIL_NORMALIZED &&
      incomingHash === ADMIN_PASSWORD_HASH
    ) {
      const sessionToken = crypto.randomBytes(24).toString('hex');
      return res.json({
        success: true,
        account: {
          email: ADMIN_EMAIL_NORMALIZED,
          name: 'Super Admin (Nasir Hussain)',
          role: 'super_admin',
          department: 'All Departments',
          sessionToken,
        },
      });
    }

    // Seller Verification (checks against sellers stored in DB or passed list)
    if (role === 'seller') {
      const dbData = readServerDb();
      const dbSellers = Array.isArray(dbData.sellers)
        ? dbData.sellers
        : Array.isArray(sellers)
        ? sellers
        : [];

      const matchedSeller = dbSellers.find(
        (s: {
          email?: string;
          phone?: string;
          passwordPlainOrHint?: string;
          active?: boolean;
        }) =>
          (String(s.email || '').trim().toLowerCase() === normalizedEmail ||
            String(s.phone || '').trim() === normalizedEmail) &&
          String(s.passwordPlainOrHint || '') === plainPass
      );

      if (matchedSeller) {
        if (matchedSeller.active === false) {
          return res.status(403).json({
            error:
              'This Seller account has been deactivated by the Super Admin.',
          });
        }
        const sessionToken = crypto.randomBytes(24).toString('hex');
        return res.json({
          success: true,
          account: {
            id: matchedSeller.id,
            email: matchedSeller.email,
            name: matchedSeller.name,
            role: 'seller',
            department: matchedSeller.department || 'All Departments',
            sessionToken,
          },
        });
      }

      return res.status(401).json({
        error:
          'Invalid Seller email/phone or password. Seller accounts must be created by the Super Admin.',
      });
    }

    return res.status(401).json({
      error:
        'Invalid Super Admin credentials. Only nasirhussain12489@gmail.com is authorized as Super Admin.',
    });
  });

  // 3. Unified Login Check (If Super Admin logs in from Customer Login, recognize Super Admin; all others log in as Customer)
  app.post('/api/auth/check-super-admin', (req, res) => {
    const { identifier, password } = req.body || {};
    const normalized = String(identifier || '').trim().toLowerCase();
    const incomingHash = hashPassword(String(password || ''));

    if (
      normalized === ADMIN_EMAIL_NORMALIZED &&
      incomingHash === ADMIN_PASSWORD_HASH
    ) {
      return res.json({
        isSuperAdmin: true,
        account: {
          email: ADMIN_EMAIL_NORMALIZED,
          name: 'Super Admin (Nasir Hussain)',
          role: 'super_admin',
        },
      });
    }
    return res.json({ isSuperAdmin: false });
  });

  // 4. Customer Password Hashing endpoint
  app.post('/api/auth/hash-password', (req, res) => {
    const { password } = req.body || {};
    if (!password || typeof password !== 'string' || password.length < 4) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 4 characters.' });
    }
    return res.json({ passwordHash: hashPassword(password) });
  });

  // 5. SEO robots.txt & sitemap.xml (No Try-On URLs)
  app.get('/robots.txt', (_req, res) => {
    res.type('text/plain').send(
      `User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${
        process.env.APP_URL || 'http://localhost:3000'
      }/sitemap.xml\n`
    );
  });

  app.get('/sitemap.xml', (_req, res) => {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><priority>1.0</priority></url>
  <url><loc>${baseUrl}/?page=shop&amp;cat=Men</loc><priority>0.9</priority></url>
  <url><loc>${baseUrl}/?page=shop&amp;cat=Women</loc><priority>0.9</priority></url>
  <url><loc>${baseUrl}/?page=shop&amp;cat=Kids</loc><priority>0.9</priority></url>
  <url><loc>${baseUrl}/?page=contact</loc><priority>0.7</priority></url>
  <url><loc>${baseUrl}/?page=about</loc><priority>0.6</priority></url>
</urlset>`);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `Reyaz Shopping Center server running on http://localhost:${PORT}`
    );
  });
}

startServer();
