-- ============================================================
-- VESTIS — Supabase Database Schema
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PROFILES ────────────────────────────────────────────────────
-- Extends Supabase auth.users with additional profile data
create table public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  full_name     text,
  phone         text,
  avatar_url    text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── ADDRESSES ───────────────────────────────────────────────────
create table public.addresses (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  label         text default 'Home',          -- Home / Work / Other
  full_name     text not null,
  phone         text,
  street        text not null,
  city          text not null,
  state         text,
  zip           text,
  country       text default 'Egypt',
  is_default    boolean default false,
  created_at    timestamptz default now()
);

-- ─── CATEGORIES ──────────────────────────────────────────────────
create table public.categories (
  id    serial primary key,
  slug  text unique not null,
  name  text not null
);

insert into public.categories (slug, name) values
  ('mens',   'Men''s'),
  ('womens', 'Women''s'),
  ('unisex', 'Unisex');

-- ─── PRODUCTS ────────────────────────────────────────────────────
create table public.products (
  id              uuid default uuid_generate_v4() primary key,
  name            text not null,
  slug            text unique not null,
  description     text,
  price           numeric(10,2) not null,
  original_price  numeric(10,2),
  category_slug   text references public.categories(slug),
  tag             text,                        -- 'Best Seller' | 'New' | 'Sale'
  images          text[] default '{}',
  sizes           text[] default '{}',
  stock           integer default 100,
  rating          numeric(3,2) default 0,
  review_count    integer default 0,
  is_active       boolean default true,
  created_at      timestamptz default now()
);

-- Seed products
insert into public.products (name, slug, description, price, original_price, category_slug, tag, images, sizes, rating, review_count) values
(
  'Tailored Wool Blazer', 'tailored-wool-blazer',
  'A refined blazer with a structured silhouette. Crafted from premium Italian wool blend with single-button closure and welt pockets.',
  189, 249, 'womens', 'Best Seller',
  array['https://images.unsplash.com/photo-1594938298603-c8148c4b8ee1?w=600&q=80'],
  array['XS','S','M','L','XL'], 4.8, 124
),
(
  'Slim Fit Oxford Shirt', 'slim-fit-oxford-shirt',
  'A crisp Oxford shirt with modern slim fit. Made from 100% Egyptian cotton with a button-down collar.',
  79, null, 'mens', 'New',
  array['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80'],
  array['S','M','L','XL','XXL'], 4.6, 89
),
(
  'High-Rise Linen Trousers', 'high-rise-linen-trousers',
  'Effortlessly chic high-rise trousers in breathable linen. Wide-leg silhouette with side pockets.',
  129, 159, 'womens', 'Sale',
  array['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80'],
  array['XS','S','M','L'], 4.7, 56
),
(
  'Cashmere Crewneck', 'cashmere-crewneck',
  'Luxuriously soft pure cashmere crewneck. Ribbed cuffs and hem, classic relaxed fit.',
  219, 279, 'mens', 'Best Seller',
  array['https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&q=80'],
  array['S','M','L','XL'], 4.9, 203
),
(
  'Pleated Midi Skirt', 'pleated-midi-skirt',
  'An elegant pleated midi skirt in flowing crepe fabric. Versatile enough for office or evening.',
  95, null, 'womens', 'New',
  array['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80'],
  array['XS','S','M','L','XL'], 4.5, 41
),
(
  'Slim Chino Trousers', 'slim-chino-trousers',
  'Smart slim chinos in stretch cotton. A wardrobe essential with a clean, tailored finish.',
  89, null, 'mens', null,
  array['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80'],
  array['28','30','32','34','36'], 4.4, 67
),
(
  'Silk Wrap Dress', 'silk-wrap-dress',
  'A fluid silk wrap dress that flatters every figure. Adjustable tie waist and V-neckline.',
  165, 210, 'womens', 'Sale',
  array['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80'],
  array['XS','S','M','L'], 4.8, 98
),
(
  'Merino Turtleneck', 'merino-turtleneck',
  'Fine merino wool turtleneck with slim silhouette. Soft, breathable, and temperature-regulating.',
  109, null, 'mens', 'Best Seller',
  array['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80'],
  array['S','M','L','XL','XXL'], 4.7, 142
);

-- ─── CART ────────────────────────────────────────────────────────
create table public.cart_items (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  product_id  uuid references public.products(id) on delete cascade not null,
  size        text not null,
  quantity    integer default 1 check (quantity > 0),
  added_at    timestamptz default now(),
  unique (user_id, product_id, size)
);

-- ─── ORDERS ──────────────────────────────────────────────────────
create type order_status as enum (
  'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
);

create table public.orders (
  id              uuid default uuid_generate_v4() primary key,
  order_number    text unique not null default 'ORD-' || floor(random()*90000+10000)::text,
  user_id         uuid references auth.users(id) on delete set null,
  status          order_status default 'pending',
  subtotal        numeric(10,2) not null,
  shipping_cost   numeric(10,2) default 0,
  discount        numeric(10,2) default 0,
  total           numeric(10,2) not null,
  payment_method  text default 'cash',        -- 'cash' | 'card'
  payment_status  text default 'pending',     -- 'pending' | 'paid'
  address_id      uuid references public.addresses(id),
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table public.order_items (
  id          uuid default uuid_generate_v4() primary key,
  order_id    uuid references public.orders(id) on delete cascade not null,
  product_id  uuid references public.products(id) on delete set null,
  product_name text not null,
  size        text not null,
  quantity    integer not null,
  unit_price  numeric(10,2) not null,
  total_price numeric(10,2) not null
);

-- Auto-update orders.updated_at
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger orders_updated_at before update on public.orders
  for each row execute function update_updated_at();

-- ─── WISHLIST ─────────────────────────────────────────────────────
create table public.wishlist (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  product_id  uuid references public.products(id) on delete cascade not null,
  added_at    timestamptz default now(),
  unique (user_id, product_id)
);

-- ─── PAYMENT METHODS ──────────────────────────────────────────────
create table public.payment_methods (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references auth.users(id) on delete cascade not null,
  card_brand      text,                         -- 'Visa' | 'Mastercard'
  last_four       text,
  expiry_month    integer,
  expiry_year     integer,
  stripe_pm_id    text,                         -- Stripe PaymentMethod ID
  is_default      boolean default false,
  created_at      timestamptz default now()
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────
alter table public.profiles         enable row level security;
alter table public.addresses        enable row level security;
alter table public.cart_items       enable row level security;
alter table public.orders           enable row level security;
alter table public.order_items      enable row level security;
alter table public.wishlist         enable row level security;
alter table public.payment_methods  enable row level security;

-- Products are public
alter table public.products   enable row level security;
alter table public.categories enable row level security;
create policy "Products are public"   on public.products   for select using (true);
create policy "Categories are public" on public.categories for select using (true);

-- Users can only see/edit their own data
create policy "Own profile"     on public.profiles         for all using (auth.uid() = id);
create policy "Own addresses"   on public.addresses        for all using (auth.uid() = user_id);
create policy "Own cart"        on public.cart_items       for all using (auth.uid() = user_id);
create policy "Own orders"      on public.orders           for select using (auth.uid() = user_id);
create policy "Own order items" on public.order_items      for select using (
  exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
);
create policy "Own wishlist"    on public.wishlist         for all using (auth.uid() = user_id);
create policy "Own payments"    on public.payment_methods  for all using (auth.uid() = user_id);

-- Service role (backend) can do everything
create policy "Service full access orders" on public.orders
  for all using (auth.role() = 'service_role');
create policy "Service full access order_items" on public.order_items
  for all using (auth.role() = 'service_role');
