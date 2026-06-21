'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/AuthProvider'
import { useCart } from '@/hooks/CartProvider'
import CartDrawer from './CartDrawer'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [search, setSearch] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const { user } = useAuth()
  const { cartCount } = useCart()
  const router = useRouter()
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = e => {
    if (e.key === 'Enter' && search.trim()) {
      router.push(`/shop?search=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  return (
    <>
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}

      <nav className={`fixed top-0 left-0 right-0 z-[500] h-16 flex items-center px-8 gap-4 transition-colors duration-300
        ${scrolled || !isHome ? 'bg-bg/95 backdrop-blur-xl border-b border-border' : 'bg-transparent'}`}>

        <Link href="/" className="font-display text-2xl font-light tracking-[6px] uppercase shrink-0">
          VESTIS
        </Link>

        <div className="hidden md:flex gap-0 ml-6">
          {[['/', 'Home'], ['/shop', 'Shop'], ['/orders', 'Orders']].map(([href, label]) => (
            <Link key={href} href={href}
              className={`px-3.5 py-1.5 text-[13px] border-b transition-colors
                ${pathname === href ? 'text-rose-light border-rose' : 'text-muted border-transparent hover:text-offwhite'}`}
            >{label}</Link>
          ))}
        </div>

        <div className="flex-1 max-w-[280px] mx-4 relative hidden sm:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">⌕</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearch}
            placeholder="Search styles…"
            className="w-full bg-surface border border-border rounded-full py-1.5 pl-9 pr-3.5 text-[13px] text-offwhite outline-none focus:border-rose transition-colors"
          />
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          {user ? (
            <Link href="/profile" title="My Profile">
              <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-rose-dark to-gold flex items-center justify-center text-[13px] font-semibold text-white cursor-pointer">
                {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
              </div>
            </Link>
          ) : (
            <Link href="/login" className="px-4.5 py-1.5 border border-border-light rounded-sm text-[13px] hover:border-rose transition-colors">
              Sign In
            </Link>
          )}
          <button onClick={() => setCartOpen(true)} className="relative text-xl px-2.5 py-1.5 hover:text-rose transition-colors">
            🛍
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-rose text-white rounded-full w-[17px] h-[17px] text-[9px] font-bold flex items-center justify-center animate-scaleIn">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  )
}
