'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useProducts } from '@/hooks/useProducts'
import { useCart } from '@/hooks/CartProvider'
import { useToast } from '@/hooks/ToastProvider'
import ProductCard from '@/components/ProductCard'
import { Spinner } from '@/components/UI'

const CATEGORIES = [
  { slug: 'all', label: 'All' },
  { slug: 'mens', label: "Men's" },
  { slug: 'womens', label: "Women's" },
]

export default function ShopClient() {
  const params = useSearchParams()
  const router = useRouter()

  const [category, setCategory] = useState(params.get('category') || 'all')
  const [maxPrice, setMaxPrice] = useState(300)
  const [search, setSearch] = useState(params.get('search') || '')

  const { products, loading } = useProducts({ category, maxPrice, search })
  const { addToCart } = useCart()
  const { notify } = useToast()

  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    const p = new URLSearchParams()

    if (category !== 'all') p.set('category', category)
    if (search) p.set('search', search)

    router.replace(`/shop${p.toString() ? `?${p}` : ''}`, { scroll: false })
  }, [category, search, router])

  const toggleWish = (id) =>
    setWishlist((w) =>
      w.includes(id) ? w.filter((x) => x !== id) : [...w, id]
    )

  const handleAdd = (product, size) => {
    addToCart(product, size)
    notify(`${product.name} added to cart`)
  }

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto px-8 md:px-10 pt-[120px] pb-20">
      <h1 className="font-display text-4xl mb-2">
        {search ? `Results for "${search}"` : 'Shop All'}
      </h1>

      <p className="text-muted mb-9">{products.length} products</p>

      <div className="flex flex-wrap items-center gap-4 bg-surface border border-border rounded-md px-6 py-4.5 mb-9">
        <span className="text-muted text-xs tracking-wide uppercase">
          Category
        </span>

        <div className="flex gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCategory(c.slug)}
              className={`px-4.5 py-1.5 rounded-full text-[13px] border transition-all
              ${
                category === c.slug
                  ? 'bg-rose border-rose text-white font-semibold'
                  : 'border-border-light text-offwhite font-normal'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-border-light mx-2 hidden sm:block" />

        <span className="text-muted text-xs tracking-wide uppercase">
          Max Price:{' '}
          <span className="text-rose-light">${maxPrice}</span>
        </span>

        <input
          type="range"
          min={20}
          max={300}
          step={10}
          value={maxPrice}
          onChange={(e) => setMaxPrice(+e.target.value)}
          className="accent-rose w-40"
        />

        {search && (
          <button
            onClick={() => setSearch('')}
            className="ml-auto text-rose-light text-xs underline"
          >
            Clear search ✕
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-4xl mb-4">🔍</p>
          <p>No products match your filters.</p>
        </div>
      ) : (
        <div className="stagger grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <div key={p.id} className="animate-fadeUp">
              <ProductCard
                product={p}
                onAddToCart={handleAdd}
                wishlist={wishlist}
                onToggleWish={toggleWish}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
