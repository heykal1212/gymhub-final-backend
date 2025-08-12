import { Router } from 'express';
import { prisma } from '../index.js';
const r = Router();

r.get('/attendance/summary', async (_req, res) => {
  const items = await prisma.attendance.findMany();
  const byHour: Record<string, number> = {};
  for (const a of items) {
    const h = new Date(a.checkinAt).getHours();
    byHour[h] = (byHour[h]||0)+1;
  }
  res.json(Object.entries(byHour).map(([hour,count])=>({ hour:Number(hour), count })));
});

r.get('/members/count', async (_req, res) => {
  const n = await prisma.user.count();
  res.json({ count: n });
});

r.get('/revenue/monthly', async (_req, res) => {
  const payments = await prisma.payment.findMany();
  const key = (d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  const map: Record<string, number> = {};
  for (const p of payments) {
    const k = key(new Date(p.timestamp));
    map[k] = (map[k]||0) + p.amount;
  }
  res.json(Object.entries(map).map(([month,amount])=>({ month, amount })));
});

export default r;