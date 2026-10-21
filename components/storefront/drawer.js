'use client';

import { X } from 'lucide-react';
import { Cart, Account } from './cart-checkout';
import { FavoritesPanel, SearchPanel } from './catalog';
import { FilterPanel } from './filter-panel';
import { t } from './data';

export default function StorefrontDrawer({
  ar,
  drawer,
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
  if (!drawer) return null;

  return (
    <div className="overlay drawer-overlay" onMouseDown={(event) => event.target === event.currentTarget && close()}>
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
        {drawer === 'search' && <SearchPanel ar={ar} close={close} select={setModal} />}
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
