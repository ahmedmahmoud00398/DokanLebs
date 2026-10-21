'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Cart, Account } from './cart-checkout';
import { FavoritesPanel, SearchPanel } from './catalog';
import { FilterPanel } from './filter-panel';
import { t } from './data';

export default function StorefrontDrawer({
  ar,
  drawer,
  drawerAnchor,
  close,
  items,
  update,
  remove,
  setPage,
  filter,
  setFilter,
  setSort,
  favorites,
  toggleFavorite,
  setModal,
  setAr,
}) {
  const overlayRef = useRef(null);
  const anchored = Boolean(drawerAnchor && ['menu', 'search', 'favorites', 'cart'].includes(drawer));

  useEffect(() => {
    if (drawer !== 'search' || !overlayRef.current) return undefined;

    const overlay = overlayRef.current;
    const site = overlay.closest('.site');
    const header = site?.querySelector('.header');
    const searchButton = header?.querySelector('[aria-label="Search"], [aria-label="بحث"]');
    if (!header || !searchButton) return undefined;

    let frame = 0;
    const updatePosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (window.matchMedia('(max-width: 820px)').matches) {
          overlay.style.setProperty('--popover-top', `${searchButton.getBoundingClientRect().bottom + 8}px`);
        } else {
          overlay.style.setProperty('--search-top', `${header.getBoundingClientRect().bottom}px`);
        }
      });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [drawer]);

  if (!drawer) return null;

  return (
    <div
      ref={overlayRef}
      className={`overlay drawer-overlay${anchored ? ' drawer-popover' : ''}`}
      style={anchored ? {
        '--popover-top': `${drawerAnchor.top}px`,
        '--popover-left': `${drawerAnchor.left}px`,
        '--popover-width': `${drawerAnchor.width}px`,
      } : undefined}
      onMouseDown={(event) => event.target === event.currentTarget && close()}
    >
      <div className={`drawer drawer-${drawer}${drawer === 'sort' ? ' sort-drawer' : ''}`}>
        {drawer === 'cart' && (
          <>
            <button className="close" onClick={close} aria-label={t(ar, 'Close')}><X /></button>
            <Cart
              ar={ar}
              items={items}
              checkout={() => { close(); setPage('checkout'); }}
              update={update}
              remove={remove}
              shop={() => { close(); setPage('shop'); }}
            />
          </>
        )}
        {drawer === 'account' && (
          <>
            <button className="close" onClick={close} aria-label={t(ar, 'Close')}><X /></button>
            <Account ar={ar} />
          </>
        )}
        {drawer === 'search' && (
          <SearchPanel
            ar={ar}
            close={close}
            select={setModal}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            shop={() => setPage('shop')}
          />
        )}
        {drawer === 'favorites' && (
          <FavoritesPanel
            ar={ar}
            favorites={favorites}
            toggle={toggleFavorite}
            close={close}
            select={setModal}
          />
        )}
        {drawer === 'filter' && (
          <FilterPanel
            ar={ar}
            value={filter}
            setValue={(value) => setFilter((current) => ({ ...current, ...value }))}
            close={close}
          />
        )}
        {drawer === 'sort' && (
          <section className="filter-panel">
            <button className="close" onClick={close} aria-label={t(ar, 'Close')}><X /></button>
            <h2>{t(ar, 'Sort')}</h2>
            {[
              ['default', 'Best Sellers'],
              ['recent', 'Last Arrive'],
              ['low', 'Price Low To High'],
              ['high', 'Price High To Low'],
            ].map(([value, label]) => (
              <button
                className="filter-sort-option"
                key={value}
                onClick={() => { setSort(value); close(); }}
              >
                {ar
                  ? {
                    'Best Sellers': 'الأكثر مبيعًا',
                    'Last Arrive': 'الأحدث وصولًا',
                    'Price Low To High': 'السعر من الأقل للأعلى',
                    'Price High To Low': 'السعر من الأعلى للأقل',
                  }[label] || label
                  : label}
              </button>
            ))}
          </section>
        )}
        {drawer === 'menu' && (
          <nav className="mobile-menu">
            <button onClick={() => { close(); setPage('shop'); }}>{t(ar, 'Shop')}</button>
            <a href="/track-order">{ar ? 'تتبع الطلب' : 'Track Order'}</a>
            <a href="/collections">{ar ? 'المجموعات' : 'Collection'}</a>
            <button onClick={() => { close(); setAr((current) => !current); }}>
              {ar ? 'English' : 'العربية'}
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
