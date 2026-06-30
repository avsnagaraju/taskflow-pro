import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { signToken } from '../lib/jwt'

const router = Router()

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })

  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (exists) return res.status(409).json({ error: 'An account with this email already exists' })

  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email: email.toLowerCase(), password: hash, name: name?.trim() || '' },
  })

  const token = signToken({ userId: user.id, email: user.email })
  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name, isPremium: user.isPremium },
  })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user) return res.status(401).json({ error: 'Invalid email or password' })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' })

  const token = signToken({ userId: user.id, email: user.email })
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, isPremium: user.isPremium },
  })
})

export default router
