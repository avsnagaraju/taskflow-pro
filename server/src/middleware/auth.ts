import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '@clerk/backend'
import { prisma } from '../lib/prisma'

export interface AuthRequest extends Request {
  userId?: string       // our internal DB user id
  clerkUserId?: string
}

async function getClerkUser(clerkId: string): Promise<{ email: string }> {
  const res = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
    headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}` },
  })
  if (!res.ok) throw new Error(`Clerk API error: ${res.status}`)
  const data = (await res.json()) as {
    email_addresses: Array<{ email_address: string; id: string }>
    primary_email_address_id: string
  }
  const email = data.email_addresses.find(
    (e) => e.id === data.primary_email_address_id,
  )?.email_address
  if (!email) throw new Error('No primary email on Clerk user')
  return { email }
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    // @clerk/backend@0.38 TS types omit secretKey, but the runtime accepts it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! } as any)
    const clerkId = payload.sub

    let user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) {
      // Fallback: user.created webhook may not have fired yet
      const { email } = await getClerkUser(clerkId)
      user = await prisma.user.create({ data: { clerkId, email } })
    }

    req.userId = user.id
    req.clerkUserId = clerkId
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
