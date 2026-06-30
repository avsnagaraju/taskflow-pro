import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      email: true,
      name: true,
      isPremium: true,
      _count: { select: { tasks: true } },
    },
  })
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ ...user, taskCount: user._count.tasks })
})

export default router
