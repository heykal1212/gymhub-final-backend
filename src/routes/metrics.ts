import { Router } from 'express';
import { prisma } from '../index.js';
const r = Router();

r.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const rows = await prisma.bodyMetric.findMany({ where: { userId }, orderBy: { date: 'asc' } });
  res.json(rows);
});

r.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { weightKg, bodyFatPct, chestCm, waistCm, hipCm, neckCm, bicepCm, thighCm } = req.body || {};
  const row = await prisma.bodyMetric.create({ data: { userId, weightKg, bodyFatPct, chestCm, waistCm, hipCm, neckCm, bicepCm, thighCm } });
  res.status(201).json(row);
});

export default r;