import { Router } from 'express';
import { prisma } from '../index.js';
const r = Router();

r.get('/', async (_req, res) => {
  const rows = await prisma.invoice.findMany({ orderBy: { dueAt: 'desc' } });
  res.json(rows);
});

r.get('/overdue', async (_req, res) => {
  const now = new Date();
  const rows = await prisma.invoice.findMany({ where: { status: 'pending', dueAt: { lt: now } }, orderBy: { dueAt: 'asc' } });
  res.json(rows);
});

r.post('/', async (req, res) => {
  const { userId, amount, dueAt, reason } = req.body || {};
  if (!userId || typeof amount !== 'number' || !dueAt) return res.status(400).json({ error: 'userId, amount, dueAt required' });
  const row = await prisma.invoice.create({ data: { userId, amount, dueAt: new Date(dueAt), reason, status: 'pending' } });
  res.status(201).json(row);
});

r.post('/:id/pay', async (req, res) => {
  const { id } = req.params;
  const updated = await prisma.invoice.update({ where: { id }, data: { status: 'paid' } });
  res.json(updated);
});

export default r;