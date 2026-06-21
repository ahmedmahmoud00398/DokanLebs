'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge, Stars } from './UI'

export default function ProductCard({ product, onAddToCart, wishlist, onToggleWish }) {
  const [hovered, setHovered] = useState(false)
  const [addingSize, setAddingSize] = useState(null)
  const inWish = wishlist?.includes(product.id)
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100) : 0

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setAddingSize(null) }}
      className={`bg-card rounded-md overflow-hidden border border-border transition-all duration-300
        ${hovered ? '-translate-y-1.5 shadow-lg' : 'translate-y-0 shadow-none'}`}
    >
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative overflow-hidden h-[280px] block cursor-pointer">
        <img
          src={product.images?.[0]} alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${hovered ? 'scale-[1.06]' : 'scale-100'}`}
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.tag && <Badge label={product.tag} variant={product.tag === 'Sale' ? 'rose' : product.tag === 'New' ? 'gold' : 'solid'} />}
          {discount > 0 && <Badge label={`−${discount}%`} variant="rose" />}
        </div>
        <button
          onClick={e => { e.preventDefault(); onToggleWish?.(product.id) }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-lg transition-all
            ${inWish ? 'text-rose-light scale-110' : 'text-muted scale-100'}`}
        >{inWish ? '♥' : '♡'}</button>

        {hovered && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md p-3 flex gap-1.5 justify-center flex-wrap animate-fadeUp">
            {product.sizes?.map(s => (
              <button key={s} onClick={e => { e.preventDefault(); onAddToCart(product, s); setAddingSize(s) }}
                className={`px-2.5 py-1 border rounded text-[11px] font-medium transition-all
                  ${addingSize === s ? 'bg-rose text-white border-rose' : 'border-border-light text-offwhite'}`}
              >{s}</button>
            ))}
          </div>
        )}
      </Link>

      {/* Info */}
      <Link href={`/product/${product.slug}`} className="block px-4 py-3.5 cursor-pointer">
        <p className="text-[11px] text-muted tracking-wide uppercase mb-1.5">{product.category_slug}</p>
        <p className="text-[15px] font-medium mb-2 leading-tight">{product.name}</p>
        <Stars rating={product.rating} count={product.review_count} />
        <div className="flex items-baseline gap-2 mt-2.5">
          <span className="text-lg font-semibold text-rose-light">${product.price}</span>
          {product.original_price && (
            <span className="text-[13px] text-muted line-through">${product.original_price}</span>
          )}
        </div>
      </Link>
    </div>
  )
}
