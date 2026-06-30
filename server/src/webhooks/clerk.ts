import { Request, Response } from 'express'
import { Webhook } from 'svix'
import { prisma } from '../lib/prisma'

interface ClerkUserEvent {
  type: string
  data: {
    id: string
    email_addresses: Array<{ email_address: string; id: string }>
    primary_email_address_id: string
    deleted?: boolean
  }
}

export async function handleClerkWebhook(req: Request, res: Response) {
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)

  let event: ClerkUserEvent
  try {
    event = wh.verify(JSON.stringify(req.body), {
      'svix-id': req.headers['svix-id'] as string,
      'svix-timestamp': req.headers['svix-timestamp'] as string,
      'svix-signature': req.headers['svix-signature'] as string,
    }) as ClerkUserEvent
  } catch {
    return res.status(400).json({ error: 'Invalid webhook signature' })
  }

  const { type, data } = event

  if (type === 'user.created') {
    const primaryEmail = data.email_addresses.find(
      (e) => e.id === data.primary_email_address_id,
    )?.email_address

    if (primaryEmail) {
      await prisma.user.upsert({
        where: { clerkId: data.id },
        update: {},
        create: { clerkId: data.id, email: primaryEmail },
      })
    }
  }

  if (type === 'user.deleted' && data.deleted) {
    await prisma.user.deleteMany({ where: { clerkId: data.id } })
  }

  res.json({ received: true })
}
