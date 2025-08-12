import { Router } from 'express';
import { prisma } from '../index.js';
const r = Router();

r.get('/', async (_req, res) => {
  const items = await prisma.attendance.findMany({ orderBy: { checkinAt: 'desc' } });
  res.json(items);
});

r.post('/checkin', async (req, res) => {
  const { userId, deviceId='door1' } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const entry = await prisma.attendance.create({ data: { userId, deviceId } });
  res.status(201).json(entry);
});

r.post('/checkout', async (req, res) => {
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const open = await prisma.attendance.findFirst({ where: { userId, checkoutAt: null }, orderBy: { checkinAt: 'desc' } });
  if (!open) return res.status(404).json({ error: 'No open session' });
  const updated = await prisma.attendance.update({ where: { id: open.id }, data: { checkoutAt: new Date() } });
  res.json(updated);
});

export default r;