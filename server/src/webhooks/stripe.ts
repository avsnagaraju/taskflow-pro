import { Request, Response } from 'express'
import Stripe from 'stripe'
import { stripe } from '../lib/stripe'
import { prisma } from '../lib/prisma'

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string
  let event: Stripe.Event

  try {
    // req.body must be the raw Buffer — see index.ts for the raw body middleware
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Stripe webhook signature error:', err)
    return res.status(400).send('Webhook signature verification failed')
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId

    if (userId) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { isPremium: true },
        }),
        prisma.payment.update({
          where: { stripeSessionId: session.id },
          data: {
            status: 'COMPLETED',
            stripePaymentId: session.payment_intent as string,
          },
        }),
      ])
      console.log(`User ${userId} upgraded to Pro`)
    }
  }

  res.json({ received: true })
}
