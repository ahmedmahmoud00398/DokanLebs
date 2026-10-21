'use client';

import { useEffect, useState } from 'react';
import { products, imageUrls } from './storefront/data';
import { Header, Footer } from './storefront/site-shell';
import { Home } from './storefront/home';
import {
  ProductDetails,
  ProductModal,
  Shop,
} from './storefront/catalog';
import { Checkout } from './storefront/cart-checkout';
import StorefrontDrawer from './storefront/drawer';
import styles from './storefront/storefront.module.css';

export { imageUrls };

export default function Storefront() {
  const [page, setPage] = useState('home');
  const [isArabic, setIsArabic] = useState(false);
  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [modal, setModal] = useState(null);
  const [drawer, setDrawer] = useState(null);
  const [sort, setSort] = useState('default');
  const [filter, setFilter] = useState({ category: '', max: null, color: '', size: '' });
  const [details, setDetails] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const syncFavorites = (event) => {
      if (Array.isArray(event.detail)) setFavorites(event.detail);
    };
    window.addEventListener('dokan-favorites-updated', syncFavorites);
    return () => window.removeEventListener('dokan-favorites-updated', syncFavorites);
  }, []);

  useEffect(() => {
    setIsArabic(localStorage.getItem('dokan-language') === 'ar');

    try {
      const storedCart = JSON.parse(localStorage.getItem('dokan-cart') || '[]');
      if (Array.isArray(storedCart)) {
        setItems(storedCart
          .filter((item) => item && item.id && Number.isInteger(item.quantity) && item.quantity > 0)
          .map((item) => ({ ...item, size: item.size || 'M', color: item.color || 'Cream' })));
      }

      const storedFavorites = JSON.parse(localStorage.getItem('dokan-favorites') || '[]');
      if (Array.isArray(storedFavorites)) {
        setFavorites(storedFavorites.filter((id) => products.some((product) => product.id === id)));
      }
    } catch {
      // Keep the storefront usable when persisted browser data is malformed.
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem('dokan-language', isArabic ? 'ar' : 'en');
  }, [isArabic, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = isArabic ? 'ar' : 'en';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  }, [isArabic, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem('dokan-cart', JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem('dokan-favorites', JSON.stringify(favorites));
  }, [favorites, hydrated]);

  const add = (product, size = 'M', color = 'Cream') => setItems((current) => {
    const key = `${product.id}-${size}-${color}`;
    const existing = current.find((item) => `${item.id}-${item.size}-${item.color}` === key);
    if (existing) {
      return current.map((item) => (
        `${item.id}-${item.size}-${item.color}` === key
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    }
    return [...current, { ...product, size, color, quantity: 1 }];
  });

  const update = (key, delta) => setItems((current) => current.map((item) => (
    `${item.id}-${item.size}-${item.color}` === key
      ? { ...item, quantity: Math.max(1, item.quantity + delta) }
      : item
  )));

  const remove = (key) => setItems((current) => current.filter(
    (item) => `${item.id}-${item.size}-${item.color}` !== key,
  ));

  const toggleFavorite = (id) => setFavorites((current) => (
    current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
  ));

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const closeDrawer = () => setDrawer(null);

  return (
    <div className={`${styles.storefront} site`} dir={isArabic ? 'rtl' : 'ltr'}>
      <Header
        ar={isArabic}
        toggle={() => setIsArabic((current) => !current)}
        navigate={setPage}
        open={setDrawer}
        count={itemCount}
      />
      {page === 'home' && <Home ar={isArabic} navigate={setPage} select={setModal} />}
      {page === 'shop' && (
        <Shop
          ar={isArabic}
          select={setModal}
          open={setDrawer}
          sort={sort}
          filter={filter}
          setFilter={setFilter}
        />
      )}
      {page === 'checkout' && <Checkout ar={isArabic} items={items} />}
      {page === 'details' && (
        <ProductDetails
          ar={isArabic}
          product={details || products[0]}
          add={add}
          buyNow={(product, size, color) => {
            add(product, size, color);
            setPage('checkout');
          }}
          navigate={setPage}
        />
      )}
      {page === 'refund' && (
        <main className="refund">
          <h1>Refund Policy</h1>
          <p>Our refund policy information.</p>
        </main>
      )}
      <Footer ar={isArabic} navigate={setPage} />
      {modal && (
        <ProductModal
          ar={isArabic}
          product={modal}
          close={() => setModal(null)}
          add={add}
          details={() => {
            setDetails(modal);
            setModal(null);
            setPage('details');
          }}
        />
      )}
      <StorefrontDrawer
        ar={isArabic}
        drawer={drawer}
        close={closeDrawer}
        items={items}
        update={update}
        remove={remove}
        setPage={setPage}
        filter={filter}
        setFilter={setFilter}
        setSort={setSort}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        setModal={setModal}
        setAr={setIsArabic}
      />
    </div>
  );
}
