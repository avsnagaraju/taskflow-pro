import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// Simulated one-time payment — no real payment processor needed.
// In production, swap this with a real Stripe Checkout session.
router.post('/upgrade', requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } })
  if (!user) return res.status(404).json({ error: 'User not found' })
  if (user.isPremium) return res.status(400).json({ error: 'Already a Pro member' })

  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { isPremium: true } }),
    prisma.payment.create({ data: { userId: user.id, amount: 499 } }),
  ])

  res.json({ success: true })
})

export default router
