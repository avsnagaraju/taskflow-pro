import { Router } from 'express'
import { stripe, getPriceId } from '../lib/stripe'
import { prisma } from '../lib/prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// Create Stripe Checkout session
router.post('/checkout', requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } })
  if (!user) return res.status(404).json({ error: 'User not found' })
  if (user.isPremium) return res.status(400).json({ error: 'Already a Pro member' })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: getPriceId(), quantity: 1 }],
    success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/dashboard`,
    customer_email: user.email,
    metadata: { userId: user.id },
  })

  // Pre-create payment record as PENDING
  await prisma.payment.create({
    data: {
      stripeSessionId: session.id,
      amount: 499,
      userId: user.id,
    },
  })

  res.json({ url: session.url })
})

export default router
