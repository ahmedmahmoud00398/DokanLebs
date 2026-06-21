-- ============================================================
-- Migration: fix profiles RLS so profile updates actually persist
-- Run this in Supabase SQL Editor if you already ran the original schema.sql
-- ============================================================

drop policy if exists "Own profile" on public.profiles;

create policy "Own profile select" on public.profiles
  for select using (auth.uid() = id);

create policy "Own profile update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Own profile insert" on public.profiles
  for insert with check (auth.uid() = id);

-- Same fix for addresses and cart_items — for-all policies need WITH CHECK too
drop policy if exists "Own addresses" on public.addresses;
create policy "Own addresses" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Own cart" on public.cart_items;
create policy "Own cart" on public.cart_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Own payments" on public.payment_methods;
create policy "Own payments" on public.payment_methods
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
