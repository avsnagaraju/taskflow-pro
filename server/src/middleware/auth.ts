import { Request, Response, NextFunction } from 'express'
import { createClerkClient } from '@clerk/backend'
import { prisma } from '../lib/prisma'

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! })

export interface AuthRequest extends Request {
  userId?: string      // our DB user id
  clerkUserId?: string
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const payload = await clerk.verifyToken(token)
    const clerkId = payload.sub

    // Upsert user on first request (fallback if webhook missed)
    let user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) {
      const clerkUser = await clerk.users.getUser(clerkId)
      user = await prisma.user.create({
        data: {
          clerkId,
          email: clerkUser.emailAddresses[0].emailAddress,
        },
      })
    }

    req.userId = user.id
    req.clerkUserId = clerkId
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
