import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const tiers = await prisma.membershipTier.count();
  if (!tiers) {
    await prisma.membershipTier.createMany({
      data: [
        { name: 'Basic', priceMonth: 800, benefits: ['Gym floor'], tierLevel: 0 },
        { name: 'Plus', priceMonth: 1200, benefits: ['Gym floor','Classes'], tierLevel: 1 },
        { name: 'Pro', priceMonth: 1800, benefits: ['All access','PT discount'], tierLevel: 2 },
      ]
    });
  }

  const adminPass = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: { email: 'owner@gymhub.local' },
    update: { role: Prisma.Role.admin, passwordHash: adminPass, name:'Owner' },
    create: { email: 'owner@gymhub.local', name:'Owner', role: Prisma.Role.admin, passwordHash: adminPass }
  });
  await prisma.user.upsert({
    where: { email: 'staff@gymhub.local' },
    update: { role: Prisma.Role.staff, name:'Front Desk' },
    create: { email: 'staff@gymhub.local', name:'Front Desk', role: Prisma.Role.staff, passwordHash: await bcrypt.hash('Staff123!',10) }
  });
  await prisma.user.upsert({
    where: { email: 'trainer@gymhub.local' },
    update: { role: Prisma.Role.trainer, name:'Coach' },
    create: { email: 'trainer@gymhub.local', name:'Coach', role: Prisma.Role.trainer, passwordHash: await bcrypt.hash('Trainer123!',10) }
  });
  await prisma.user.upsert({
    where: { email: 'member@gymhub.local' },
    update: { role: Prisma.Role.member, name:'Demo Member' },
    create: { email: 'member@gymhub.local', name:'Demo Member', role: Prisma.Role.member, passwordHash: await bcrypt.hash('Member123!',10) }
  });

  console.log('Seed complete');
}

main().then(()=>process.exit(0)).catch(e=>{ console.error(e); process.exit(1); });