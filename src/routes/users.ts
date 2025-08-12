import { Router } from 'express';
import { prisma } from '../index.js';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';

const r = Router();

r.get('/', async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(users);
});

r.post('/', async (req, res) => {
  const { name, email, role='member', phone, password } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: 'name and email required' });
  const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
  const user = await prisma.user.create({ data: { name, email, role, phone, passwordHash } });
  res.status(201).json(user);
});

r.get('/:id/qr', async (req, res) => {
  const { id } = req.params;
  const dataUrl = await QRCode.toDataURL(id, { errorCorrectionLevel: 'M' });
  res.json({ id, qr: dataUrl });
});

r.post('/:id/face', async (req, res) => {
  const { id } = req.params;
  const { faceId } = req.body || {};
  if (!faceId) return res.status(400).json({ error: 'faceId required' });
  const fp = await prisma.faceProfile.upsert({
    where: { faceId },
    update: { userId: id },
    create: { userId: id, faceId }
  });
  res.json(fp);
});

export default r;