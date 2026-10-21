'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Heart, Search, X } from 'lucide-react';
import { products, t } from './data';

const swatchColors = {
  Cream: '#f5e9d7',
  Black: '#000000',
  Sage: '#aab9a9',
  Brown: '#513a25',
  Green: '#228b22',
};

export function Shop({ ar, select, open, sort, filter, setFilter }) {
  const label = (text) => t(ar, text);
  const category = filter.category || 'All';
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const visible = useMemo(() => {
    let list = category === 'All'
      ? [...products]
      : products.filter((product) => product.category === category);

    if (filter.category) {
      list = list.filter((product) => product.category === filter.category);
    }
    if (filter.max !== null) {
      list = list.filter((product) => product.price <= filter.max);
    }
    if (filter.color) {
      list = list.filter((product) => product.colors.includes(filter.color));
    }
    if (filter.size) {
      list = list.filter(() => sizes.includes(filter.size));
    }
    if (sort === 'recent') list.reverse();
    if (sort === 'low') list.sort((a, b) => a.price - b.price);
    if (sort === 'high') list.sort((a, b) => b.price - a.price);

    return list;
  }, [category, sort, filter]);

  return (
    <main className="shop-page">
      <h1>{label('SHOP')}</h1>
      <div className="shop-tools">
        <div>
          {['All', 'Jeans', 'Sweat Pants', 'Tailer Pants', 'Wild Leg'].map((item) => (
            <button
              className={category === item ? 'active' : ''}
              onClick={() => setFilter({ ...filter, category: item === 'All' ? '' : item })}
              aria-pressed={category === item}
              key={item}
            >
              {label(item)}
            </button>
          ))}
        </div>
        <div>
          <button onClick={() => open('sort')}>
            {label('Sort')} <ChevronDown size={14} />
          </button>
          <button onClick={() => open('filter')}>{label('Filter')}</button>
        </div>
      </div>
      {visible.length ? (
        <div className="product-grid">
          {visible.map((product) => (
            <article key={product.id}>
              <button className="product-open" onClick={() => select(product)}>
                <img src={product.image} alt={label(product.name)} />
                <h2>{label(product.name)}</h2>
                <p>{product.price} LE</p>
              </button>
              <button className="quick-add" onClick={() => select(product)}>
                {label('View Full Details')}
              </button>
            </article>
          ))}
        </div>
      ) : (
        <p role="status">
          {ar ? 'لا توجد منتجات تطابق اختياراتك.' : 'No products match these filters.'}
        </p>
      )}
    </main>
  );
}

export function ProductModal({ ar, product, close, add, details }) {
  const colors = Array.isArray(product.colors) ? product.colors : [];
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
  const salePrice = Number(product.salePrice);
  const shownPrice = Number.isFinite(salePrice)
    && salePrice > 0
    && salePrice < Number(product.price)
    ? salePrice
    : Number(product.price);
  const [size, setSize] = useState(sizes.includes('M') ? 'M' : sizes[0] || '');
  const [color, setColor] = useState(colors[0] || '');

  useEffect(() => {
    setSize(sizes.includes('M') ? 'M' : sizes[0] || '');
    setColor(colors[0] || '');
  }, [product.id]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [close]);

  return (
    <div
      className="overlay product-modal-overlay"
      onMouseDown={(event) => event.target === event.currentTarget && close()}
    >
      <div className="product-modal" role="dialog" aria-modal="true" aria-label={t(ar, 'Product Details')}>
        <button className="close" onClick={close} aria-label={t(ar, 'Close')}><X /></button>
        <img src={product.image} alt={t(ar, product.name)} />
        <div>
          <div className="product-modal-heading">
            <h2>{t(ar, product.name)}</h2>
            <FavoriteButton ar={ar} product={product} />
          </div>
          <h3>
            {shownPrice} LE
            {shownPrice < Number(product.price) && (
              <del className="original-price">{product.price} LE</del>
            )}
          </h3>
          <p>
            {ar
              ? 'تفاصيل المنتج ومعلومات المقاس والخامة والعناية.'
              : 'Product details, sizing, material, care and cleaning instructions.'}
          </p>
          <p>{t(ar, 'PRODUCT COLOR')}{color ? ` : ${t(ar, color)}` : ''}</p>
          <div className="swatches">
            {colors.map((option) => (
              <button
                type="button"
                aria-label={t(ar, option)}
                aria-pressed={color === option}
                className={`swatch ${String(option).toLowerCase()}`}
                style={{
                  backgroundColor: swatchColors[option] || option,
                  outline: color === option ? '2px solid #111' : undefined,
                }}
                onClick={() => setColor(option)}
                key={option}
              />
            ))}
          </div>
          <p>{t(ar, 'PRODUCT SIZE')}</p>
          <div className="sizes">
            {sizes.map((option) => (
              <button
                type="button"
                aria-pressed={size === option}
                className={size === option ? 'selected' : ''}
                onClick={() => setSize(option)}
                key={option}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            className="black-button"
            disabled={!size || !color}
            onClick={() => {
              add({ ...product, price: shownPrice }, size, color);
              close();
            }}
          >
            {t(ar, 'Add To Cart')}
          </button>
          <button className="text-link" onClick={details}>{t(ar, 'View Full Details')}</button>
        </div>
      </div>
    </div>
  );
}

export function FavoriteButton({ product, ar = false }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      setSaved(JSON.parse(localStorage.getItem('dokan-favorites') || '[]').includes(product.id));
    } catch {
      setSaved(false);
    }
  }, [product.id]);

  const toggle = () => {
    let current = [];
    try {
      current = JSON.parse(localStorage.getItem('dokan-favorites') || '[]');
    } catch {
      current = [];
    }
    const next = current.includes(product.id)
      ? current.filter((id) => id !== product.id)
      : [...current, product.id];

    localStorage.setItem('dokan-favorites', JSON.stringify(next));
    setSaved(next.includes(product.id));
    window.dispatchEvent(new CustomEvent('dokan-favorites-updated', { detail: next }));
  };

  return (
    <button
      type="button"
      className="favorite-toggle"
      aria-label={saved ? t(ar, 'Remove from favorites') : t(ar, 'Add to favorites')}
      aria-pressed={saved}
      onClick={toggle}
    >
      <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
      {saved ? t(ar, 'Saved') : t(ar, 'Save')}
    </button>
  );
}

export function ProductDetails({ ar, product, add, buyNow, navigate }) {
  const colors = Array.isArray(product.colors) ? product.colors : [];
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
  const salePrice = Number(product.salePrice);
  const shownPrice = Number.isFinite(salePrice)
    && salePrice > 0
    && salePrice < Number(product.price)
    ? salePrice
    : Number(product.price);
  const [size, setSize] = useState(sizes.includes('M') ? 'M' : sizes[0] || '');
  const [color, setColor] = useState(colors[0] || '');
  const photos = product.images?.length ? product.images : [product.image];
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    setSize(sizes.includes('M') ? 'M' : sizes[0] || '');
    setColor(colors[0] || '');
    setActivePhoto(0);
  }, [product.id]);

  return (
    <main className="product-details">
      <div className="details-gallery">
        <div className="details-image">
          <img src={photos[activePhoto]} alt={t(ar, product.name)} />
        </div>
        <div className="details-thumbnails">
          {photos.map((photo, index) => (
            <button
              type="button"
              key={photo + index}
              className={activePhoto === index ? 'active' : ''}
              onClick={() => setActivePhoto(index)}
              aria-label={ar ? `عرض صورة المنتج ${index + 1}` : `View product image ${index + 1}`}
            >
              <img src={photo} alt="" />
            </button>
          ))}
        </div>
      </div>
      <div className="details-copy">
        <div className="product-modal-heading">
          <h1>{t(ar, product.name)}</h1>
          <FavoriteButton ar={ar} product={product} />
        </div>
        <h2>
          {shownPrice} LE
          {shownPrice < Number(product.price) && (
            <del className="original-price">{product.price} LE</del>
          )}
        </h2>
        <p>
          {ar
            ? 'تفاصيل المنتج ومعلومات الخامة والمقاس والعناية.'
            : 'Product details, sizing, material, care and cleaning instructions.'}
        </p>
        <p>{t(ar, 'PRODUCT COLOR')}{color ? ` : ${t(ar, color)}` : ''}</p>
        <div className="swatches">
          {colors.map((option) => (
            <button
              type="button"
              className={`swatch ${String(option).toLowerCase()} ${color === option ? 'selected' : ''}`}
              style={{ backgroundColor: swatchColors[option] || option }}
              onClick={() => setColor(option)}
              aria-label={t(ar, option)}
              aria-pressed={color === option}
              key={option}
            />
          ))}
        </div>
        <p>{t(ar, 'PRODUCT SIZE')}</p>
        <div className="sizes">
          {sizes.map((option) => (
            <button
              type="button"
              className={size === option ? 'selected' : ''}
              aria-pressed={size === option}
              onClick={() => setSize(option)}
              key={option}
            >
              {option}
            </button>
          ))}
        </div>
        {(!colors.length || !sizes.length) && (
          <p className="form-error" role="status">
            {ar ? 'المقاسات أو الألوان غير متاحة حاليًا.' : 'No color or size options are currently available for this item.'}
          </p>
        )}
        <button
          className="black-button"
          disabled={!size || !color}
          onClick={() => buyNow({ ...product, price: shownPrice }, size, color)}
        >
          {ar ? 'اشتر الآن' : 'Buy Now'}
        </button>
        <button
          className="outline-button"
          disabled={!size || !color}
          onClick={() => add({ ...product, price: shownPrice }, size, color)}
        >
          {t(ar, 'Add To Cart')}
        </button>
        <button className="text-link" onClick={() => navigate('refund')}>
          {ar ? 'سياسة الاسترجاع والاسترداد' : 'Return & Refund Policy'}
        </button>
        <p className="details-shipping">
          {ar ? 'تظهر خيارات وتفاصيل الشحن عند إتمام الطلب.' : 'Shipping options and details are shown at checkout.'}
        </p>
      </div>
    </main>
  );
}

export function SearchPanel({ ar, close, select }) {
  const [query, setQuery] = useState('');
  const matches = products.filter((product) => (
    `${product.name} ${product.category} ${t(ar, product.name)} ${t(ar, product.category)}`
      .toLowerCase().includes(query.trim().toLowerCase())
  ));

  return (
    <section className="filter-panel">
      <button className="close" onClick={close} aria-label={t(ar, 'Close')}><X /></button>
      <h2>{ar ? 'بحث' : 'Search'}</h2>
      <div className="searchbar">
        <Search size={18} />
        <input
          dir="auto"
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={ar ? 'ابحث عن المنتجات' : 'Search products'}
        />
      </div>
      {query && (matches.length ? (
        <div className="search-results">
          {matches.map((product) => (
            <button onClick={() => { close(); select(product); }} key={product.id}>
              <img src={product.image} alt={t(ar, product.name)} />
              <p>{t(ar, product.name)}</p>
              <p>{product.price} LE</p>
            </button>
          ))}
        </div>
      ) : (
        <p role="status">{ar ? 'لا توجد نتائج.' : 'No products found.'}</p>
      ))}
    </section>
  );
}

export function FavoritesPanel({ ar, favorites, toggle, close, select }) {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('dokan-favorites-updated', { detail: favorites.length }));
  }, [favorites]);

  const savedProducts = products.filter((product) => favorites.includes(product.id));

  return (
    <section className="filter-panel">
      <button className="close" onClick={close} aria-label={t(ar, 'Close')}><X /></button>
      <h2>{ar ? 'المفضلة' : 'Favorites'}</h2>
      {savedProducts.length === 0 ? (
        <p role="status">{ar ? 'لم تحفظ أي منتجات في المفضلة بعد.' : 'You have no saved favorites yet.'}</p>
      ) : (
        savedProducts.map((product) => (
          <div className="saved-address" key={product.id}>
            <button type="button" onClick={() => { close(); select(product); }}>
              <img className="h-16 w-16 object-cover" src={product.image} alt={t(ar, product.name)} />
              {t(ar, product.name)} · {product.price} LE
            </button>
            <button className="text-link" onClick={() => toggle(product.id)}>
              {ar ? 'إزالة' : 'Remove'}
            </button>
          </div>
        ))
      )}
    </section>
  );
}
