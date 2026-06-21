'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProducts } from '@/hooks/useProducts'
import { useCart } from '@/hooks/CartProvider'
import { useToast } from '@/hooks/ToastProvider'
import ProductCard from '@/components/ProductCard'
import { Btn, Spinner } from '@/components/UI'

const OFFERS = [
  { id: 1, title: 'Autumn Collection', discount: '30% OFF', code: 'AUTUMN30', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80', from: '#1A0F0D', to: '#2A1612' },
  { id: 2, title: 'New Arrivals', discount: 'Free Shipping', code: 'FREESHIP', img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80', from: '#0F1410', to: '#16201A' },
  { id: 3, title: 'Members Only', discount: 'Extra 20% OFF', code: 'VIP20', img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80', from: '#150F18', to: '#241624' },
]

export default function HomePage() {
  const router = useRouter()
  const { bestSellers, loading } = useProducts()
  const { addToCart } = useCart()
  const { notify } = useToast()
  const [wishlist, setWishlist] = useState([])
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => { setHeroVisible(true) }, [])

  const toggleWish = (id) => setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id])
  const handleAdd = (product, size) => { addToCart(product, size); notify(`${product.name} added to cart`) }

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[88vh] min-h-[560px] overflow-hidden bg-[#050505]">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85"
          alt="hero"
          className={`w-full h-full object-cover opacity-40 transition-transform duration-[12000ms] ease-out ${heroVisible ? 'scale-[1.08]' : 'scale-100'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
          <p className="animate-fadeUp text-rose-light text-xs tracking-[5px] uppercase mb-4" style={{ animationDelay: '.1s' }}>
            New Season — 2026
          </p>
          <h1 className="animate-fadeUp font-display text-[42px] md:text-[76px] leading-[1.05] max-w-[640px] mb-6" style={{ animationDelay: '.25s' }}>
            Dress with<br /><em className="text-rose-light not-italic font-light italic">Intention.</em>
          </h1>
          <p className="animate-fadeUp text-warm max-w-[420px] mb-9 leading-7 text-[15px]" style={{ animationDelay: '.4s' }}>
            Curated collections for the discerning wardrobe — premium fabrics, timeless cuts, considered details.
          </p>
          <div className="animate-fadeUp flex gap-3.5" style={{ animationDelay: '.55s' }}>
            <Btn size="lg" onClick={() => router.push('/shop?category=womens')}>Shop Women</Btn>
            <Btn size="lg" variant="outline" onClick={() => router.push('/shop?category=mens')}>Shop Men</Btn>
          </div>
        </div>

        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-muted text-[11px] tracking-[2px] flex flex-col items-center gap-2 animate-float">
          SCROLL <span className="text-base">↓</span>
        </div>
      </div>

      {/* Offers */}
      <section className="px-8 md:px-10 pt-16 pb-5 max-w-7xl mx-auto">
        <h2 className="font-display text-[34px] mb-7">Current <em className="text-rose-light not-italic italic">Offers</em></h2>
        <div className="stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {OFFERS.map(o => (
            <div key={o.id}
              className="animate-fadeUp relative h-[170px] rounded-md overflow-hidden border border-border cursor-pointer transition-transform hover:-translate-y-1"
              style={{ background: `linear-gradient(135deg, ${o.from}, ${o.to})` }}
            >
              <img src={o.img} alt={o.title} className="absolute -right-5 top-0 w-[55%] h-full object-cover opacity-45"
                style={{ maskImage: 'linear-gradient(to left, black 40%, transparent)', WebkitMaskImage: 'linear-gradient(to left, black 40%, transparent)' }} />
              <div className="relative p-6.5 h-full flex flex-col justify-center">
                <p className="text-[11px] text-rose-light tracking-[3px] uppercase mb-2.5">{o.title}</p>
                <p className="font-display text-[28px] mb-3.5">{o.discount}</p>
                <span className="inline-block w-fit border border-rose text-rose-light text-[11px] px-3 py-1 rounded tracking-[2px]">
                  CODE: {o.code}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="px-8 md:px-10 pt-12 pb-20 max-w-7xl mx-auto">
        <div className="flex justify-between items-baseline mb-7">
          <h2 className="font-display text-[34px]">Best <em className="text-rose-light not-italic italic">Sellers</em></h2>
          <Btn variant="ghost" size="sm" onClick={() => router.push('/shop')}>View All →</Btn>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : (
          <div className="stagger grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {bestSellers.map(p => (
              <div key={p.id} className="animate-fadeUp">
                <ProductCard product={p} onAddToCart={handleAdd} wishlist={wishlist} onToggleWish={toggleWish} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
