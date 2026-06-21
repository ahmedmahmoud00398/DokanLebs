import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/products?category=mens&maxPrice=200&search=shirt
// Note: the frontend queries Supabase directly via hooks/useProducts.js for speed.
// This route exists for external clients / mobile apps that need a stable REST API.
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const maxPrice = searchParams.get('maxPrice')
  const search   = searchParams.get('search')

  const supabase = createAdminClient()
  let query = supabase.from('products').select('*').eq('is_active', true)
  if (category && category !== 'all') query = query.eq('category_slug', category)
  if (maxPrice) query = query.lte('price', Number(maxPrice))
  if (search) query = query.ilike('name', `%${search}%`)

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ products: data })
}
