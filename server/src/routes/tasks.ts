import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()
const FREE_LIMIT = 5

router.use(requireAuth)

router.get('/', async (req: AuthRequest, res) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.userId! },
    orderBy: { createdAt: 'desc' },
  })
  res.json(tasks)
})

router.post('/', async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    include: { _count: { select: { tasks: true } } },
  })
  if (!user) return res.status(404).json({ error: 'User not found' })

  if (!user.isPremium && user._count.tasks >= FREE_LIMIT) {
    return res.status(403).json({ error: 'Free task limit reached. Upgrade to Pro.' })
  }

  const { title, description, priority, dueDate, status } = req.body
  if (!title?.trim()) return res.status(400).json({ error: 'Title is required' })

  const task = await prisma.task.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      priority: priority || 'MEDIUM',
      dueDate: dueDate ? new Date(dueDate) : null,
      status: status || 'TODO',
      userId: req.userId!,
    },
  })
  res.status(201).json(task)
})

router.patch('/:id', async (req: AuthRequest, res) => {
  const task = await prisma.task.findFirst({
    where: { id: req.params.id, userId: req.userId },
  })
  if (!task) return res.status(404).json({ error: 'Task not found' })

  const { title, description, status, priority, dueDate } = req.body
  const updated = await prisma.task.update({
    where: { id: task.id },
    data: {
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description?.trim() || null }),
      ...(status !== undefined && { status }),
      ...(priority !== undefined && { priority }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
    },
  })
  res.json(updated)
})

router.delete('/:id', async (req: AuthRequest, res) => {
  const task = await prisma.task.findFirst({
    where: { id: req.params.id, userId: req.userId },
  })
  if (!task) return res.status(404).json({ error: 'Task not found' })

  await prisma.task.delete({ where: { id: task.id } })
  res.status(204).send()
})

export default router
