import { Router } from 'express';
import { prisma } from '../index.js';
const r = Router();
r.get('/', async (_req, res) => {
  const rows = await prisma.membershipTier.findMany({ orderBy: { tierLevel: 'asc' } });
  res.json(rows);
});
r.post('/', async (req, res) => {
  const { name, priceMonth, benefits=[], tierLevel=0 } = req.body || {};
  if (!name || typeof priceMonth !== 'number') return res.status(400).json({ error: 'name and priceMonth required' });
  const row = await prisma.membershipTier.create({ data: { name, priceMonth, benefits, tierLevel } });
  res.status(201).json(row);
});
export default r;