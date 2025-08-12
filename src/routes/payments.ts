import { Router } from 'express';
import { prisma } from '../index.js';
const r = Router();

r.get('/', async (_req, res) => {
  const rows = await prisma.payment.findMany({ orderBy: { timestamp: 'desc' } });
  res.json(rows);
});

r.post('/cash', async (req, res) => {
  const { userId, amount, currency='ETB', staffId } = req.body || {};
  if (!userId || typeof amount !== 'number') return res.status(400).json({ error: 'userId and amount required' });
  const row = await prisma.payment.create({ data: { userId, amount, currency, method: 'cash', status: 'paid', staffId } });
  res.status(201).json(row);
});

export default r;