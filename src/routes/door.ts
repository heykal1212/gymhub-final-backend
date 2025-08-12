import { Router } from 'express';
import { prisma } from '../index.js';

const r = Router();

r.post('/event', async (req, res) => {
  const { faceId, deviceId='door1', timestamp } = req.body || {};
  if (!faceId) return res.status(400).json({ error: 'faceId required' });
  const fp = await prisma.faceProfile.findUnique({ where: { faceId } });
  if (!fp) {
    await prisma.accessEvent.create({ data: { faceId, deviceId, result: 'deny' } });
    return res.json({ allow: false });
  }
  await prisma.accessEvent.create({ data: { userId: fp.userId, faceId, deviceId, result: 'allow' } });
  await prisma.attendance.create({ data: { userId: fp.userId, deviceId, checkinAt: timestamp ? new Date(timestamp) : new Date() } });
  res.json({ allow: true, userId: fp.userId });
});

r.get('/authorize', async (req, res) => {
  const { faceId } = req.query as any;
  if (!faceId) return res.status(400).json({ error: 'faceId required' });
  const fp = await prisma.faceProfile.findUnique({ where: { faceId } });
  res.json({ allow: !!fp, userId: fp?.userId || null });
});

export default r;