'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getProductBySlug } from '@/hooks/useProducts'
import { useCart } from '@/hooks/CartProvider'
import { useToast } from '@/hooks/ToastProvider'
import { Btn, Badge, Stars, Spinner } from '@/components/UI'

export default function ProductPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { notify } = useToast()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [size, setSize] = useState(null)
  const [tab, setTab] = useState('desc')
  const [imgLoaded, setImgLoaded] = useState(false)
  const [wishOn, setWishOn] = useState(false)

  useEffect(() => {
    setLoading(true)
    setSize(null)
    getProductBySlug(slug).then(({ data }) => { setProduct(data); setLoading(false) })
  }, [slug])

  if (loading) return <div className="flex justify-center py-40"><Spinner size={40} /></div>
  if (!product) return <div className="text-center py-40 text-muted">Product not found.</div>

  const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto px-8 md:px-10 pt-[120px] pb-20">
      <button onClick={() => router.back()} className="text-muted text-[13px] mb-7 flex items-center gap-1.5 hover:text-rose-light transition-colors">
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
        {/* Image */}
        <div className="animate-scaleIn relative rounded-lg overflow-hidden bg-surface">
          {!imgLoaded && <div className="skeleton absolute inset-0" />}
          <img
            src={product.images?.[0]} alt={product.name} onLoad={() => setImgLoaded(true)}
            className={`w-full max-h-[620px] object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className="absolute top-4.5 left-4.5 flex gap-2">
            {product.tag && <Badge label={product.tag} variant={product.tag === 'Sale' ? 'rose' : 'gold'} />}
            {discount > 0 && <Badge label={`−${discount}%`} variant="rose" />}
          </div>
        </div>

        {/* Details */}
        <div className="animate-fadeUp" style={{ animationDelay: '.1s' }}>
          <p className="text-muted text-xs tracking-[2px] uppercase mb-2.5">{product.category_slug}</p>
          <h1 className="font-display text-[38px] mb-3.5 leading-tight">{product.name}</h1>
          <Stars rating={product.rating} count={product.review_count} />

          <div className="flex items-baseline gap-3 my-6">
            <span className="text-[32px] font-semibold text-rose-light">${product.price}</span>
            {product.original_price && <span className="text-lg text-muted line-through">${product.original_price}</span>}
          </div>

          <div className="mb-7">
            <p className="text-xs text-muted tracking-wide uppercase mb-3">Select Size</p>
            <div className="flex gap-2.5 flex-wrap">
              {product.sizes?.map(s => (
                <button key={s} onClick={() => setSize(s)}
                  className={`w-[54px] h-[46px] rounded-sm border text-[13px] transition-all
                    ${size === s ? 'bg-rose border-rose text-white font-semibold' : 'border-border-light text-offwhite font-normal'}`}
                >{s}</button>
              ))}
            </div>
            {!size && <p className="text-muted text-xs mt-2.5">Please select a size to continue</p>}
          </div>

          <div className="flex gap-3 mb-8">
            <Btn size="lg" className="flex-1" disabled={!size}
              onClick={() => {
                if (!size) { notify('Select a size first', 'error'); return }
                addToCart(product, size)
                notify(`${product.name} added to cart`)
              }}
            >Add to Cart</Btn>
            <button onClick={() => setWishOn(w => !w)}
              className={`w-[52px] h-[52px] border border-border-light rounded-sm text-[22px] transition-all ${wishOn ? 'text-rose-light' : 'text-muted'}`}
            >{wishOn ? '♥' : '♡'}</button>
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex gap-1 mb-4.5">
              {['desc', 'shipping', 'returns'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4.5 py-2 text-[13px] border-b transition-colors
                    ${tab === t ? 'text-rose-light border-rose font-semibold' : 'text-muted border-transparent font-normal'}`}
                >{t === 'desc' ? 'Description' : t.charAt(0).toUpperCase() + t.slice(1)}</button>
              ))}
            </div>
            <p key={tab} className="animate-fadeIn text-warm text-sm leading-7">
              {tab === 'desc' && product.description}
              {tab === 'shipping' && 'Free standard shipping on orders over $150. Express shipping available at checkout. Estimated delivery: 3–5 business days (standard), 1–2 business days (express).'}
              {tab === 'returns' && 'Free returns within 30 days of purchase. Items must be unworn, unwashed, and in original condition with tags attached.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
