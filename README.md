# GymHub Final Backend (2.0)
Features: JWT auth; Tiers; Attendance; Metrics; PRs; Exercises; Cash payments & invoices; Reports; Face door webhooks.

Env:
PORT=3000
NODE_ENV=production
JWT_SECRET=<long_random>
DATABASE_URL=<postgres ... ?sslmode=require>
FRONTEND_URL=https://<your-frontend>.vercel.app
DOOR_SECRET=<shared_with_device>

Deploy:
1) GitHub → push this repo.
2) Railway → Deploy PostgreSQL → copy DATABASE_URL (+ sslmode=require).
3) Railway → New Service → Deploy from GitHub → add env above.
4) Wait build.
5) Shell:
   npx prisma generate
   npx prisma migrate deploy
   npm run prisma:seed

Seed accounts:
- admin: owner@gymhub.local / Admin123!
- staff: staff@gymhub.local / Staff123!
- trainer: trainer@gymhub.local / Trainer123!
- member: member@gymhub.local / Member123!