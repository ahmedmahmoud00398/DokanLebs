import { NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/getUserFromRequest'

// Ready-to-use scaffold for real card payments via Stripe. OFF by default —
// cash-on-delivery works without it.
//
// To enable:
//   1. npm install stripe
//   2. Add STRIPE_SECRET_KEY to .env.local
//   3. Uncomment the code below
//   4. In app/checkout/page.jsx, swap the plain card inputs for Stripe Elements
//      (https://stripe.com/docs/payments/quickstart) and call this endpoint
//      to create a PaymentIntent before placing the order.

/*
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  const user = await getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { amount } = await request.json() // amount in cents
  try {
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { user_id: user.id },
    })
    return NextResponse.json({ clientSecret: intent.client_secret })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
*/

export async function POST() {
  return NextResponse.json(
    { error: 'Stripe is not configured yet. See app/api/payments/create-intent/route.js for setup instructions.' },
    { status: 501 }
  )
}
