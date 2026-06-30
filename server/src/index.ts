import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import taskRoutes from './routes/tasks'
import userRoutes from './routes/users'
import paymentRoutes from './routes/payments'
import { handleStripeWebhook } from './webhooks/stripe'
import { handleClerkWebhook } from './webhooks/clerk'

const app = express()
const PORT = process.env.PORT || 3001

// Stripe webhooks need raw body BEFORE the json parser
app.post(
  '/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook,
)

// Clerk webhooks also need raw body for svix signature verification
app.post('/api/webhooks/clerk', express.raw({ type: 'application/json' }), handleClerkWebhook)

// Standard middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }))

// Routes
app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/payments', paymentRoutes)

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export default app
