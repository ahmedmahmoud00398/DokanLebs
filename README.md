# VESTIS — Next.js + Tailwind + Supabase

A fully working fashion e-commerce app. **Stack:** Next.js 14 (App Router) · Tailwind CSS · Supabase (Postgres + Auth).

This is a **single Next.js app** — no separate backend server. API routes live in `app/api/**` and run on Next's own server.

---

## 🚀 Setup (~15 minutes)

### 1. Supabase Project (Free)
1. Create a project at [supabase.com](https://supabase.com)
2. Copy your **Project URL** and **anon public key** from Settings → API (also grab the **service_role** key — keep it secret)
3. Open the SQL Editor and run the entire contents of `supabase/schema.sql`
4. Go to Authentication → URL Configuration:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 2. Enable Social Logins
In Supabase → Authentication → Providers, enable and configure:

**Google** — [console.cloud.google.com](https://console.cloud.google.com) → Credentials → OAuth Client ID (Web)
　Redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

**Facebook** — [developers.facebook.com](https://developers.facebook.com) → Create App → Add Facebook Login
　Redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

**Microsoft** — [portal.azure.com](https://portal.azure.com) → App registrations → New registration
　Redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
　In Supabase, this provider is called **azure**.

Paste each provider's Client ID & Secret into the matching Supabase provider screen.

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

### 4. Install & Run

```bash
npm install
npm run dev
```

Visit **http://localhost:3000**

---

## 📁 Project Structure

```
vestis-next/
├── app/
│   ├── page.jsx              # Homepage
│   ├── shop/                 # Shop with filters
│   ├── product/[slug]/       # Product detail
│   ├── cart/                 # Cart page
│   ├── checkout/             # 3-step checkout
│   ├── orders/                
│   │   ├── page.jsx          # Orders list
│   │   └── [id]/page.jsx     # Order tracker
│   ├── login/, signup/       # Auth pages
│   ├── auth/callback/        # OAuth redirect handler
│   ├── auth/reset-password/  # Password reset form
│   ├── profile/              # Account details/addresses/payments
│   └── api/                  # Route Handlers (replaces Express backend)
│       ├── orders/           # POST create, GET list/single, PATCH status
│       ├── products/         # GET list/single
│       └── payments/         # Stripe scaffold (disabled by default)
├── components/                # Navbar, CartDrawer, ProductCard, UI kit, AuthForm
├── hooks/                     # AuthProvider, CartProvider, ToastProvider (React Context)
├── lib/supabase/              # client.js (browser), server.js (SSR), admin.js (API routes)
├── middleware.js              # Refreshes Supabase session cookie on every request
└── supabase/schema.sql        # Full Postgres schema + RLS policies + seed products
```

---

## How auth works here
- `lib/supabase/client.js` — browser client, used in Client Components
- `lib/supabase/server.js` — SSR client, used in Server Components (cookie-based session)
- `lib/supabase/admin.js` — service-role client, **only** used inside `app/api/**` routes
- `middleware.js` — keeps the session cookie fresh across navigations
- `hooks/AuthProvider.jsx` — React Context exposing `user`, `profile`, and all auth methods to any Client Component via `useAuth()`

## Features
- ✅ Auth: Google, Facebook, Microsoft, Email/Password, Forgot Password
- ✅ Products with categories, filters, search (Tailwind-styled, animated)
- ✅ Product detail page with size selection
- ✅ Cart — persisted to Supabase for logged-in users, localStorage for guests
- ✅ Checkout — 3-step flow, Cash on Delivery or Card (Stripe-ready scaffold)
- ✅ Order tracking with animated status pipeline
- ✅ Profile — details, addresses, payment methods, order history
- ✅ Tailwind-driven animations: fadeUp, scaleIn, slideRight, float, shimmer skeletons

## Enabling real card payments
Cash-on-delivery works immediately. To accept cards:
1. `npm install stripe`
2. Add `STRIPE_SECRET_KEY` to `.env.local`
3. Uncomment the code in `app/api/payments/create-intent/route.js`
4. Replace the plain card inputs in `app/checkout/page.jsx` with [Stripe Elements](https://stripe.com/docs/payments/quickstart)
