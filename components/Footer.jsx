export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border px-10 pt-12 pb-6 mt-16">
      <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-9 max-w-6xl mx-auto mb-9">
        <div>
          <p className="font-display text-[22px] tracking-[5px] mb-3.5">VESTIS</p>
          <p className="text-muted text-[13px] leading-7 max-w-[240px]">
            Premium clothing for the modern wardrobe. Curated with intention, crafted to last.
          </p>
        </div>
        {[
          ['Shop', ["Women's", "Men's", 'New Arrivals', 'Sale']],
          ['Help', ['Size Guide', 'Returns', 'Shipping', 'Contact']],
          ['Company', ['About', 'Careers', 'Sustainability', 'Press']],
        ].map(([title, links]) => (
          <div key={title}>
            <p className="text-[11px] tracking-[2px] text-muted uppercase mb-4.5">{title}</p>
            {links.map(l => (
              <p key={l} className="text-warm text-[13px] mb-2.5 cursor-pointer opacity-75 hover:opacity-100 transition-opacity">{l}</p>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-5 flex justify-between max-w-6xl mx-auto">
        <p className="text-muted text-xs">© 2026 VESTIS. All rights reserved.</p>
        <p className="text-muted text-xs">Privacy · Terms · Cookies</p>
      </div>
    </footer>
  )
}
