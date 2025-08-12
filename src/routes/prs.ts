import { Router } from 'express';
import { prisma } from '../index.js';
const r = Router();

r.get('/leaderboard/:exerciseId', async (req, res) => {
  const { exerciseId } = req.params;
  const rows = await prisma.pR.findMany({ where: { exerciseId }, orderBy: { value: 'desc' }, take: 20, include: { user: true } });
  res.json(rows.map(x=>({ user:x.user.name, value:x.value, unit:x.unit, date:x.date })));
});

r.post('/', async (req, res) => {
  const { userId, exerciseId, value, unit } = req.body || {};
  if (!userId || !exerciseId || typeof value !== 'number' || !unit) return res.status(400).json({ error: 'userId, exerciseId, value, unit required' });
  const row = await prisma.pR.create({ data: { userId, exerciseId, value, unit } });
  res.status(201).json(row);
});

export default r;