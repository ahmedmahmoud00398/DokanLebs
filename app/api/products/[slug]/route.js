import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request, { params }) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('products').select('*').eq('slug', params.slug).single()
  if (error) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  return NextResponse.json({ product: data })
}
