'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useProducts({ category = 'all', maxPrice = 1000, search = '' } = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const supabase = createClient()
    const fetch = async () => {
      setLoading(true)
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .lte('price', maxPrice)
        .order('created_at', { ascending: false })

      if (category !== 'all') query = query.eq('category_slug', category)
      if (search) query = query.ilike('name', `%${search}%`)

      const { data } = await query
      setProducts(data || [])
      setLoading(false)
    }
    fetch()
  }, [category, maxPrice, search])

  const bestSellers = products.filter(p => p.tag === 'Best Seller')

  return { products, bestSellers, loading }
}

export async function getProductBySlug(slug) {
  const supabase = createClient()
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single()
  return { data, error }
}
