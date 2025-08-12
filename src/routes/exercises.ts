import { Router } from 'express';
import { prisma } from '../index.js';
const r = Router();

r.get('/', async (req, res) => {
  const { q, group, equip, level } = req.query as any;
  const rows = await prisma.exercise.findMany({
    where: {
      AND: [
        q ? { name: { contains: q, mode: 'insensitive' } } : {},
        group ? { muscleGroup: { equals: group as string, mode: 'insensitive' } } : {},
        equip ? { equipment: { equals: equip as string, mode: 'insensitive' } } : {},
        level ? { skillLevel: { equals: level as string, mode: 'insensitive' } } : {},
      ]
    },
    orderBy: { name: 'asc' }
  });
  res.json(rows);
});

r.post('/', async (req, res) => {
  const { name, muscleGroup, equipment, skillLevel, mediaUrl, tags=[] } = req.body || {};
  if (!name || !muscleGroup) return res.status(400).json({ error: 'name and muscleGroup required' });
  const row = await prisma.exercise.create({ data: { name, muscleGroup, equipment, skillLevel, mediaUrl, tags } });
  res.status(201).json(row);
});

export default r;