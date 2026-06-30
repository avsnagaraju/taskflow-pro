# TaskFlow Pro

A full-stack task management SaaS app demonstrating every layer real companies care about.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | Clerk |
| Payments | Stripe Checkout |
| Deploy (FE) | Vercel |
| Deploy (BE) | Railway |

## Features

- **Free tier**: Up to 5 tasks
- **Pro tier ($4.99 one-time)**: Unlimited tasks, priority labels, due dates

## Local Development

### 1. Prerequisites
- Node.js 18+
- PostgreSQL running locally (or use a free Supabase/Neon project)

### 2. Clone & install
```bash
git clone <repo-url>
cd taskflow-pro
npm install
```

### 3. Configure environment variables

```bash
# Server
cp server/.env.example server/.env
# Fill in: DATABASE_URL, CLERK_SECRET_KEY, STRIPE_SECRET_KEY, etc.

# Client
cp client/.env.example client/.env
# Fill in: VITE_CLERK_PUBLISHABLE_KEY
```

### 4. Set up database
```bash
cd server
npm run db:push      # Push schema to DB
npm run db:generate  # Generate Prisma client
```

### 5. Run both services
```bash
# From root
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:3001

## External Services Setup

### Clerk
1. Create account at https://clerk.com
2. Create application → copy publishable key + secret key
3. Add webhook endpoint → `/api/webhooks/clerk` → select `user.created`, `user.deleted`

### Stripe
1. Create account at https://stripe.com
2. Create a product → one-time price of $4.99 → copy price ID
3. Add webhook endpoint → `/api/webhooks/stripe` → select `checkout.session.completed`
4. Use Stripe CLI locally: `stripe listen --forward-to localhost:3001/api/webhooks/stripe`

## Deployment

### Frontend → Vercel
```bash
cd client
vercel --prod
# Add env var: VITE_CLERK_PUBLISHABLE_KEY
```

### Backend → Railway
1. Push repo to GitHub
2. Create Railway project → connect GitHub repo → select `server/` directory
3. Add PostgreSQL plugin
4. Set all env vars from `server/.env.example`

## Architecture

```
Browser
  │
  ├── Clerk (auth) ──── JWT ──► Express middleware
  │
  ├── React UI ────── REST ──► Express routes ──► Prisma ──► PostgreSQL
  │
  └── Stripe JS ─ redirect ──► Stripe Checkout ──► Webhook ──► Mark premium
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health | No | Health check |
| GET | /api/users/me | Yes | Get current user |
| GET | /api/tasks | Yes | List user's tasks |
| POST | /api/tasks | Yes | Create task |
| PATCH | /api/tasks/:id | Yes | Update task |
| DELETE | /api/tasks/:id | Yes | Delete task |
| POST | /api/payments/checkout | Yes | Start Stripe checkout |
| POST | /api/webhooks/stripe | Stripe sig | Payment webhook |
| POST | /api/webhooks/clerk | Svix sig | User sync webhook |
