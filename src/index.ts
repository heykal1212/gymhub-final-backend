import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from './middleware/auth.js';

import auth from './routes/auth.js';
import users from './routes/users.js';
import tiers from './routes/tiers.js';
import attendance from './routes/attendance.js';
import metrics from './routes/metrics.js';
import prs from './routes/prs.js';
import exercises from './routes/exercises.js';
import payments from './routes/payments.js';
import invoices from './routes/invoices.js';
import reports from './routes/reports.js';
import door from './routes/door.js';

export const prisma = new PrismaClient();
const app = express();

app.use(helmet());
app.use(cors({ origin: (process.env.FRONTEND_URL||'*').split(',') }));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 60_000, max: 300 }));

app.get('/', (_req, res) => res.json({ ok: true, service: 'GymHub API', time: new Date() }));

app.use('/auth', auth);

app.use('/users', authMiddleware(), users);
app.use('/tiers', authMiddleware(['admin','staff']), tiers);
app.use('/attendance', authMiddleware(['admin','staff','trainer']), attendance);
app.use('/metrics', authMiddleware(['admin','staff','trainer','member']), metrics);
app.use('/prs', authMiddleware(['admin','staff','trainer','member']), prs);
app.use('/exercises', authMiddleware(['admin','staff','trainer']), exercises);
app.use('/payments', authMiddleware(['admin','staff']), payments);
app.use('/invoices', authMiddleware(['admin','staff']), invoices);
app.use('/reports', authMiddleware(['admin','staff']), reports);
app.use('/door', door);

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`GymHub API listening on ${port}`));