'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from 'react';
import { addressService, orderService } from '@/lib/store-services';
import { ChevronDown, Heart, Menu, Minus, Plus, Search, ShoppingBag, UserRound, X } from 'lucide-react';
const imageUrls = { hero: '/placeholder.svg?height=720&width=1440&query=fashion+hero+placeholder', sweatshirt: '/placeholder.svg?height=640&width=520&query=black+sweatshirt+placeholder', jacket: '/placeholder.svg?height=640&width=520&query=leather+jacket+placeholder', search: '/placeholder.svg?height=640&width=520&query=clothing+product+placeholder', checkout: '/placeholder.svg?height=640&width=520&query=denim+jacket+placeholder', denim: '/placeholder.svg?height=640&width=520&query=jeans+placeholder', filter: '/placeholder.svg?height=640&width=520&query=white+pants+placeholder' };
const products = [['ZARA JEANS', 850, 'denim', 'Jeans'], ['H&M PANTS', 1500, 'checkout', 'Jeans'], ['LV JEANS', 1200, 'search', 'Jeans'], ['SWEAT PANTS', 1300, 'sweatshirt', 'Sweat Pants'], ['WIDE LEG PANTS', 850, 'denim', 'Wild Leg'], ['CLASSIC PANTAS', 1500, 'jacket', 'Tailer Pants'], ['CHARMUEIS PANTS', 500, 'filter', 'Jeans'], ['OLX PANTS', 1300, 'search', 'Wild Leg'], ['TAILER PANTS', 850, 'jacket', 'Tailer Pants'], ['SPORT PANTS', 1500, 'sweatshirt', 'Sweat Pants'], ['SHORT', 500, 'checkout', 'Tailer Pants'], ['ADIDAS ADIBREAK', 1300, 'denim', 'Wild Leg']].map(([name, price, image, category]) => ({ id: String(name).toLowerCase().replaceAll(' ', '-'), name: String(name), price: Number(price), image: imageUrls[image], category: String(category), colors: ['Cream', 'Black', 'Sage'], sizes: ['XS', 'S', 'M', 'L', 'XL'] }));
const t = (ar, en) => ar ? ({ 'Wear Your Vibe': 'ارتدِ أسلوبك', 'Shop Now': 'تسوق الآن', 'Collections': 'المجموعات', 'New Arrival': 'وصل حديثًا', 'Best-Sellers': 'الأكثر مبيعًا', 'Sales': 'التخفيضات', 'shop by category': 'تسوق حسب الفئة', 'Winter collection': 'مجموعة الشتاء', 'Our store': 'متجرنا', 'SHOP': 'المتجر', 'Shop': 'تسوق', 'Category': 'الفئات', 'About': 'من نحن', 'Sort': 'ترتيب', 'Filter': 'فلترة', 'Add to cart': 'أضف للسلة', 'Add To Cart': 'أضف إلى السلة', 'View Full Details': 'عرض التفاصيل الكاملة', 'Bag': 'السلة', 'Remove': 'حذف', 'Your bag is empty.': 'السلة فارغة.', 'Checkout': 'الدفع', 'Delivery': 'التوصيل', 'Payment Method': 'طريقة الدفع', 'Shipping Method': 'طريقة الشحن', 'Complete Order': 'إتمام الطلب', 'Product Details': 'تفاصيل المنتج', 'PRODUCT COLOR': 'لون المنتج', 'PRODUCT SIZE': 'مقاس المنتج', 'See Results': 'عرض النتائج', 'Colors': 'الألوان', 'Size': 'المقاس', 'Contact Us': 'تواصل معنا', 'Account': 'الحساب', 'Search': 'بحث', 'Menu': 'القائمة', 'Favorites': 'المفضلة', 'Cart': 'السلة', 'Top': 'القمصان', 'Bottoms': 'البناطيل', 'Accessories': 'إكسسوارات', 'Shoes': 'أحذية', 'CONTACT US': 'تواصل معنا', 'CATEGORIES': 'الفئات', 'CUSTOMERS': 'العملاء', 'SOCIAL MEDIA': 'وسائل التواصل', 'Refund Policy': 'سياسة الاسترجاع', 'Support': 'الدعم', 'Bottom': 'البناطيل', 'Log in': 'تسجيل الدخول', 'Sign up': 'إنشاء حساب', 'Saved addresses': 'العناوين المحفوظة', 'Add address': 'إضافة عنوان', 'Save address': 'حفظ العنوان', 'Select address': 'اختر العنوان', 'New address': 'عنوان جديد', 'Cash on delivery': 'الدفع عند الاستلام', 'Place order': 'تأكيد الطلب', 'No address saved': 'لا توجد عناوين محفوظة' }[en] || en) : en;
function Header({ ar, toggle, navigate, open, count, favoriteCount }) {
    const label = (x) => t(ar, x);
    const [savedFavoriteCount, setSavedFavoriteCount] = useState(0);
    useEffect(() => {
        try { setSavedFavoriteCount(JSON.parse(localStorage.getItem('dokan-favorites') || '[]').length); } catch { setSavedFavoriteCount(0); }
        const updateCount = (event) => setSavedFavoriteCount(Array.isArray(event.detail) ? event.detail.length : Number.isInteger(event.detail) ? event.detail : 0);
        window.addEventListener('dokan-favorites-updated', updateCount);
        return () => window.removeEventListener('dokan-favorites-updated', updateCount);
    }, []);
    return <>
        <div className="promo"><div className="promo-track"><span>{ar ? 'خصم 25٪ عند الطلب من الموقع الآن' : 'sale up 25% if you order from website now'}</span><span>{ar ? 'خصم 25٪ عند الطلب من الموقع الآن' : 'sale up 25% if you order from website now'}</span></div></div>
        <header className="header">
            <div className="mobile-controls"><button className="mobile-only icon-button" onClick={() => open('menu')} aria-label={label('Menu')}><Menu size={18} /></button><button className="mobile-only mobile-language" onClick={toggle}>{ar ? 'EN' : 'عربي'}</button></div>
            <button className="logo" onClick={() => navigate('home')}>Dokan Lebss</button>
            <nav><a href="/track-order">{ar ? 'تتبع الطلب' : 'Track Order'}</a><a href="/collections">{ar ? 'المجموعات' : 'Collection'}</a><button onClick={() => navigate('shop')}>{label('Shop')}</button><button onClick={() => navigate('home')}>{label('New Arrival')}</button><button onClick={() => navigate('refund')}>{label('About')}</button><button className="language-nav" onClick={toggle}>{ar ? 'EN' : 'عربي'}</button></nav>
            <div className="header-actions"><button onClick={() => open('search')} aria-label={label('Search')}><Search size={18} /></button><button onClick={() => open('favorites')} aria-label={`${label('Favorites')} (${savedFavoriteCount})`}><Heart size={19} fill={savedFavoriteCount ? 'currentColor' : 'none'} /><span className="header-favorites-count">{savedFavoriteCount}</span></button><button onClick={() => open('account')} aria-label={label('Account')}><UserRound size={18} /></button><button onClick={() => open('cart')} aria-label={label('Cart')}><ShoppingBag size={18} /></button><span>{count}</span></div>
        </header>
    </>;
}
function Footer({ ar }) { const label = (x) => t(ar, x); return _jsxs("footer", { children: [_jsxs("div", { className: "footer-grid", children: [_jsxs("div", { children: [_jsx("small", { children: label('CONTACT US') }), _jsx("p", { children: '+20 123 456 789' }), _jsx("p", { children: 'Dokan.EL-Labas@GMAIL.COM' })] }), _jsxs("div", { children: [_jsx("small", { children: label('CATEGORIES') }), _jsx("p", { children: label('Top') }), _jsx("p", { children: label('Bottom') }), _jsx("p", { children: label('Accessories') })] }), _jsxs("div", { children: [_jsx("small", { children: label('CUSTOMERS') }), _jsx("p", { children: label('Refund Policy') }), _jsx("p", { children: label('Support') })] }), _jsxs("div", { children: [_jsx("small", { children: label('SOCIAL MEDIA') }), _jsx("p", { children: 'FACEBOOK' }), _jsx("p", { children: 'INSTAGRAM' })] })] }), _jsx("div", { className: "footer-brand", children: 'Dokan Lebss' })] }); }
function Home({ ar, navigate }) {
    const label = (x) => t(ar, x);
    const winterCarousel = useRef(null);
    const winterSelection = products;
    return <main>
        <section className="hero" style={{ backgroundImage: `url(${imageUrls.hero})` }}><div><h1>{label('Wear Your Vibe')}</h1><p>{ar ? 'أساسيات أنيقة تناسب أسلوب حياتك أينما ذهبت.' : 'A collection of refined essentials made to keep up with your lifestyle, wherever it takes you.'}</p><button onClick={() => navigate('shop')}>{label('Shop Now')}</button><a className="home-collection-link" href="/collections">{label('Collections')}</a></div></section>
        <section className="home-section"><p className="eyebrow">{label('shop by category')}</p><div className="category-grid">{['Top', 'Bottoms', 'Accessories', 'Shoes'].map((item, index) => <button key={item} onClick={() => navigate('shop')}><img src={[imageUrls.search, imageUrls.denim, imageUrls.sweatshirt, imageUrls.jacket][index]} alt={item} /><span>{label(item)}</span></button>)}</div></section>
        <section className="home-section"><div className="winter-carousel-heading"><p className="eyebrow">{ar ? 'مجموعة الشتاء' : 'Winter collection'}</p><div className="winter-carousel-controls"><button type="button" aria-label={ar ? 'السابق' : 'Previous products'} onClick={() => winterCarousel.current?.scrollBy({ left: -winterCarousel.current.clientWidth, behavior: 'smooth' })}>←</button><button type="button" aria-label={ar ? 'التالي' : 'Next products'} onClick={() => winterCarousel.current?.scrollBy({ left: winterCarousel.current.clientWidth, behavior: 'smooth' })}>→</button></div></div><div className="mini-products winter-carousel" ref={winterCarousel}>{winterSelection.map((product) => <button key={product.id} onClick={() => navigate('shop')}><img src={product.image} alt={product.name} /><p>{product.name}</p><span>{product.price} LE</span></button>)}</div></section>
        <section className="sale-banner"><p>{ar ? 'خصم 25٪ إذا طلبت من الموقع' : '25% sale if you order from website'}</p><button onClick={() => navigate('shop')}>{label('Shop Now')}</button></section>
        <section className="home-section store"><p className="eyebrow">{ar ? 'متجرنا' : 'Our store'}</p><div><div className="store-information"><strong>Dokan Lebss</strong><p>+20 123 456 789</p><p>{ar ? 'السبت - الجمعة 9 صباحًا - 12 ظهرًا' : 'SAT - FRI 9AM -12PM'}</p></div><div className="map">{process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ? <iframe title={ar ? 'موقع متجر دوكان لبس على الخريطة' : 'Dokan Lebss store location map'} src={process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /> : <p>{ar ? 'أضف رابط تضمين Google Maps في NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL' : 'Add your Google Maps embed URL in NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL'}</p>}</div></div></section>
    </main>;
}
function Shop({ ar, add, select, open, sort, filter, setFilter }) {
    const label = (x) => t(ar, x);
    const category = filter.category || 'All';
    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    const visible = useMemo(() => {
        let list = category === 'All' ? [...products] : products.filter((product) => product.category === category);
        if (filter.category)
            list = list.filter((product) => product.category === filter.category);
        if (filter.max !== null)
            list = list.filter((product) => product.price <= filter.max);
        if (filter.color)
            list = list.filter((product) => product.colors.includes(filter.color));
        if (filter.size)
            list = list.filter((product) => sizes.includes(filter.size));
        if (sort === 'recent')
            list.reverse();
        if (sort === 'low')
            list.sort((a, b) => a.price - b.price);
        if (sort === 'high')
            list.sort((a, b) => b.price - a.price);
        return list;
    }, [category, sort, filter]);
    return _jsxs("main", { className: "shop-page", children: [_jsx("h1", { children: label('SHOP') }), _jsxs("div", { className: "shop-tools", children: [_jsx("div", { children: ['All', 'Jeans', 'Sweat Pants', 'Tailer Pants', 'Wild Leg'].map((item) => _jsx("button", { className: category === item ? 'active' : '', onClick: () => setFilter({ ...filter, category: item === 'All' ? '' : item }), "aria-pressed": category === item, children: item }, item)) }), _jsxs("div", { children: [_jsxs("button", { onClick: () => open('sort'), children: [label('Sort'), " ", _jsx(ChevronDown, { size: 14 })] }), _jsx("button", { onClick: () => open('filter'), children: label('Filter') })] })] }), visible.length ? _jsx("div", { className: "product-grid", children: visible.map((product) => _jsxs("article", { children: [_jsxs("button", { className: "product-open", onClick: () => select(product), children: [_jsx("img", { src: product.image, alt: product.name }), _jsx("h2", { children: product.name }), _jsxs("p", { children: [product.price, " LE"] })] }), _jsx("button", { className: "quick-add", onClick: () => select(product), children: label('View Full Details') })] }, product.id)) }) : _jsx("p", { role: "status", children: ar ? 'لا توجد منتجات تطابق اختياراتك.' : 'No products match these filters.' })] });
}
function ProductModal({ ar, product, close, add, details }) {
    const colors = Array.isArray(product.colors) ? product.colors : [];
    const sizes = Array.isArray(product.sizes) ? product.sizes : [];
    const salePrice = Number(product.salePrice);
    const shownPrice = Number.isFinite(salePrice) && salePrice > 0 && salePrice < Number(product.price) ? salePrice : Number(product.price);
    const [size, setSize] = useState(sizes.includes('M') ? 'M' : sizes[0] || '');
    const [color, setColor] = useState(colors[0] || '');
    useEffect(() => { setSize(sizes.includes('M') ? 'M' : sizes[0] || ''); setColor(colors[0] || ''); }, [product.id]);
    useEffect(() => { const fn = (e) => e.key === 'Escape' && close(); window.addEventListener('keydown', fn); return () => window.removeEventListener('keydown', fn); }, [close]);
    return <div className="overlay" onMouseDown={e => e.target === e.currentTarget && close()}><div className="product-modal" role="dialog" aria-modal="true" aria-label={t(ar, 'Product Details')}><button className="close" onClick={close} aria-label="Close"><X /></button><img src={product.image} alt={product.name} /><div><div className="product-modal-heading"><h2>{product.name}</h2><FavoriteButton product={product} /></div><h3>{shownPrice} LE {shownPrice < Number(product.price) && <del className="original-price">{product.price} LE</del>}</h3><p>{ar ? 'تفاصيل المنتج ومعلومات المقاس والخامة والعناية.' : 'Product details, sizing, material, care and cleaning instructions.'}</p><p>{t(ar, 'PRODUCT COLOR')}{color ? ` : ${color}` : ''}</p><div className="swatches">{colors.map(c => <button type="button" aria-label={c} aria-pressed={color === c} className={`swatch ${String(c).toLowerCase()}`} style={{ backgroundColor: ({ Cream: '#f5e9d7', Black: '#000000', Sage: '#aab9a9', Brown: '#513a25', Green: '#228b22' })[c] || c, outline: color === c ? '2px solid #111' : undefined }} onClick={() => setColor(c)} key={c} />)}</div><p>{t(ar, 'PRODUCT SIZE')}</p><div className="sizes">{sizes.map(s => <button type="button" aria-pressed={size === s} className={size === s ? 'selected' : ''} onClick={() => setSize(s)} key={s}>{s}</button>)}</div><button className="black-button" disabled={!size || !color} onClick={() => { add({ ...product, price: shownPrice }, size, color); close(); }}>{t(ar, 'Add To Cart')}</button><button className="text-link" onClick={details}>{t(ar, 'View Full Details')}</button></div></div></div>;
}
function FavoriteButton({ product }) {
    const [saved, setSaved] = useState(false);
    useEffect(() => {
        try { setSaved(JSON.parse(localStorage.getItem('dokan-favorites') || '[]').includes(product.id)); } catch { setSaved(false); }
    }, [product.id]);
    const toggle = () => {
        let current = [];
        try { current = JSON.parse(localStorage.getItem('dokan-favorites') || '[]'); } catch { current = []; }
        const next = current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id];
        localStorage.setItem('dokan-favorites', JSON.stringify(next));
        setSaved(next.includes(product.id));
        window.dispatchEvent(new CustomEvent('dokan-favorites-updated', { detail: next }));
    };
    return <button type="button" className="favorite-toggle" aria-label={saved ? 'Remove from favorites' : 'Add to favorites'} aria-pressed={saved} onClick={toggle}><Heart size={18} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}</button>;
}
function Cart({ ar, items, checkout, update, remove, shop }) {
    const label = (x) => t(ar, x);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return _jsxs("main", { className: "cart-page", children: [_jsx("div", { className: "cart-title", children: _jsx("h1", { children: label('Bag') }) }), items.length ? items.map((item) => _jsxs("div", { className: "cart-row", children: [_jsx("img", { src: item.image, alt: item.name }), _jsxs("div", { children: [_jsx("h2", { children: item.name }), _jsxs("p", { children: [item.color, " / ", item.size] }), _jsxs("p", { children: [item.price * item.quantity, " LE"] }), _jsxs("div", { className: "quantity", children: [_jsx("button", { "aria-label": ar ? 'تقليل الكمية' : 'Decrease', onClick: () => update(`${item.id}-${item.size}-${item.color}`, -1), children: _jsx(Minus, { size: 16 }) }), _jsx("span", { children: item.quantity }), _jsx("button", { "aria-label": ar ? 'زيادة الكمية' : 'Increase', onClick: () => update(`${item.id}-${item.size}-${item.color}`, 1), children: _jsx(Plus, { size: 16 }) })] }), _jsx("button", { className: "text-link", onClick: () => remove(`${item.id}-${item.size}-${item.color}`), children: label('Remove') })] })] }, `${item.id}-${item.size}-${item.color}`)) : _jsxs(_Fragment, { children: [_jsx("p", { children: label('Your bag is empty.') }), _jsx("button", { className: "black-button", onClick: shop, children: label('Shop Now') })] }), _jsxs("button", { className: "black-button", disabled: !items.length, onClick: checkout, children: [label('Checkout'), " (", subtotal, ") LE"] })] });
}
function FilterPanel({ ar, value, setValue, close }) {
    const label = (x) => t(ar, x);
    const colors = [['Cream', '#f5e9d7'], ['Black', '#000'], ['Sage', '#aab9a9']];
    const sizes = [['XS', 'Extra Small'], ['S', 'Small'], ['M', 'Medium'], ['L', 'Large'], ['XL', 'Extra Large']];
    return _jsxs("section", { className: "filter-panel", children: [_jsx("button", { className: "close", onClick: close, "aria-label": "Close", children: _jsx(X, {}) }), _jsx("h2", { children: label('Filter') }), _jsx("hr", {}), _jsx("h3", { children: label('Colors') }), _jsx("div", { className: "filter-colors", children: colors.map(([name, bg]) => _jsx("button", { type: "button", "aria-label": name, "aria-pressed": value.color === name, className: value.color === name ? 'active' : '', style: { background: bg }, onClick: () => setValue({ ...value, color: value.color === name ? '' : name }) }, name)) }), _jsx("h3", { children: label('Size') }), _jsx("div", { className: "filter-sizes", children: sizes.map(([code, name]) => _jsx("button", { type: "button", "aria-pressed": value.size === code, className: value.size === code ? 'active' : '', onClick: () => setValue({ ...value, size: value.size === code ? '' : code }), children: ar ? ({ 'Extra Small': 'صغير جدًا', 'Extra Large': 'كبير جدًا', 'Small': 'صغير', 'Medium': 'متوسط', 'Large': 'كبير' })[name] : name }, code)) }), _jsx("button", { className: "text-link", onClick: () => setValue({ ...value, color: '', size: '', max: null, category: '' }), children: ar ? 'مسح التصفية' : 'Clear filters' }), _jsx("button", { className: "black-button", onClick: close, children: label('See Results') })] });
}
function Checkout({ ar, items }) {
    const empty = { country: '', firstName: '', lastName: '', name: '', phone: '', address: '', city: '', governorate: 'Alexandria' };
    const [addresses, setAddresses] = useState([]);
    const [selected, setSelected] = useState('');
    const [form, setForm] = useState(empty);
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const rates = { Alexandria: 85, 'Cairo/Giza': 100, Beheira: 95, Other: 150 };
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = items.length ? rates[form.governorate] : 0;
    const total = subtotal + shipping;
    const name = (form.firstName + ' ' + form.lastName).trim();

    useEffect(() => {
        const saved = addressService.list();
        setAddresses(saved);
        const initial = saved.find((item) => item.default) || saved[0];
        if (initial) {
            const split = (initial.name || '').split(' ');
            setSelected(initial.id);
            setForm({ ...empty, ...initial, firstName: split.shift() || '', lastName: split.join(' ') });
        }
    }, []);

    const persist = (next) => { setAddresses(next); addressService.save(next); };
    const pick = (address) => {
        const split = (address.name || '').split(' ');
        setSelected(address.id);
        setForm({ ...empty, ...address, firstName: split.shift() || '', lastName: split.join(' ') });
        setError('');
    };
    const saveAddress = () => {
        if (!form.country.trim() || !name || !form.phone.trim() || !form.address.trim() || !form.city.trim()) {
            setError(ar ? 'يرجى إكمال جميع بيانات التوصيل.' : 'Complete all shipping fields before saving.');
            return false;
        }
        const id = selected || (globalThis.crypto?.randomUUID?.() || String(Date.now()));
        const previous = addresses.find((item) => item.id === id);
        const address = { ...form, name, id, default: previous?.default ?? addresses.length === 0 };
        persist(previous ? addresses.map((item) => item.id === id ? address : item) : [...addresses, address]);
        setSelected(id);
        setError('');
        return true;
    };
    const removeAddress = (id) => {
        if (!window.confirm(ar ? 'هل تريد حذف هذا العنوان؟' : 'Delete this saved address?')) return;
        const next = addresses.filter((item) => item.id !== id);
        if (addresses.find((item) => item.id === id)?.default && next.length) next[0] = { ...next[0], default: true };
        persist(next);
        if (selected === id) { setSelected(''); setForm(empty); }
    };
    const setDefault = (id) => persist(addresses.map((item) => ({ ...item, default: item.id === id })));
    const submit = async (event) => {
        event.preventDefault();
        setError('');
        if (saving) return;
        if (!items.length) return setError(ar ? 'السلة فارغة.' : 'Your cart is empty.');
        if (!form.country.trim() || !name || !form.phone.trim() || !form.address.trim() || !form.city.trim()) return setError(ar ? 'يرجى إكمال بيانات التوصيل.' : 'Complete the shipping address before continuing.');
        if (remember && !saveAddress()) return;
        setSaving(true);
        try {
            const result = await orderService.create({ items, shippingAddress: { ...form, name, id: selected || 'unsaved-address' }, shippingFee: shipping, paymentMethod: 'cash' });
            if (!result.ok) setError(result.error);
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Order submission is unavailable.');
        } finally { setSaving(false); }
    };

    return <main className="checkout checkout-reference">
        <section className="checkout-delivery">
            <h1>{ar ? 'التوصيل' : 'Delivery'}</h1>
            {addresses.length > 0 && <div className="saved-addresses"><h2>{ar ? 'العناوين المحفوظة' : 'Saved addresses'} <small>({ar ? 'على هذا الجهاز' : 'on this device'})</small></h2>{addresses.map((address) => <div className="saved-address" key={address.id}><button type="button" className={selected === address.id ? 'selected' : ''} onClick={() => pick(address)} aria-pressed={selected === address.id}>{address.default ? '★ ' : ''}{address.name}, {address.address}, {address.city}</button><button type="button" className="text-link" onClick={() => removeAddress(address.id)}>{ar ? 'حذف' : 'Delete'}</button><button type="button" className="text-link" onClick={() => setDefault(address.id)}>{ar ? 'افتراضي' : 'Make default'}</button></div>)}</div>}
            <button type="button" className="text-link" onClick={() => { setSelected(''); setForm(empty); setError(''); }}>{ar ? 'إضافة عنوان جديد' : 'Add a new address'}</button>
            <form onSubmit={submit}>
                <label>{ar ? 'الدولة / المنطقة' : 'Country'}<input required autoComplete="country-name" placeholder="Country / Region" value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} /></label>
                <div className="checkout-name-row"><label>{ar ? 'الاسم الأول' : 'First Name'}<input required autoComplete="given-name" value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} /></label><label>{ar ? 'اسم العائلة' : 'Last Name'}<input required autoComplete="family-name" value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} /></label></div>
                <label>{ar ? 'العنوان' : 'Address'}<input required autoComplete="street-address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /></label>
                <div className="checkout-name-row"><label>{ar ? 'المدينة' : 'City'}<input required autoComplete="address-level2" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} /></label><label>{ar ? 'المحافظة' : 'Governorate'}<select value={form.governorate} onChange={(event) => setForm({ ...form, governorate: event.target.value })}>{Object.entries(rates).map(([region, rate]) => <option key={region} value={region}>{region} · {rate}.00 LE</option>)}</select></label></div>
                <label>{ar ? 'الهاتف' : 'Phone'}<input required type="tel" autoComplete="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
                <label className="remember-address"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />{ar ? 'حفظ هذه المعلومات للمرة القادمة' : 'Save this information for next time'}</label>
                <button type="button" className="text-link" onClick={saveAddress}>{ar ? 'حفظ العنوان' : 'Save address'}</button>
                <h2>{ar ? 'طريقة الشحن' : 'Shipping Method'}</h2><p className="shipping-choice">{form.governorate}<span>{shipping}.00 LE</span></p>
                <h2>{ar ? 'طريقة الدفع' : 'Payment Method'}</h2><div className="checkout-payment"><span>{ar ? 'الدفع عند الاستلام' : 'Cash On Delivery (الدفع عند الاستلام)'}</span><b aria-hidden="true">✓</b></div>
                <p className="payment-unavailable">{ar ? 'الدفع بالبطاقة غير متاح حتى يتم ربط مزود دفع.' : 'Card payment will be available when a payment provider is connected.'}</p>
                {error && <p className="form-error" role="alert">{error}</p>}
                <button className="black-button" type="submit" disabled={saving || !items.length}>{saving ? (ar ? 'جارٍ التحقق…' : 'Checking…') : (ar ? 'إتمام الطلب' : 'Complete Order')}</button>
            </form>
        </section>
        <aside className="checkout-summary"><div className="checkout-summary-items">{items.map((item) => <div className="checkout-summary-item" key={item.id + '-' + item.size + '-' + item.color}><img src={item.image} alt="" /><span>{item.name} × {item.quantity}</span><strong>{item.price * item.quantity} LE</strong></div>)}</div>
            <p className="summary-total"><span>{ar ? 'إجمالي المنتجات' : 'Total Items ' + items.reduce((sum, item) => sum + item.quantity, 0)}</span><span>{subtotal} LE</span></p>
            <p className="summary-total"><span>{ar ? 'الشحن' : 'Shipping'}</span><span>{shipping}.00 LE</span></p>
            <p className="summary-total total-line"><strong>{ar ? 'الإجمالي' : 'Total'}</strong><strong>{total}.00 LE</strong></p>
            <p>{ar ? 'التوصيل خلال 4 أيام من تأكيد الطلب' : 'Shipping in 4 days from confirming the order'}</p>
            <p>{form.firstName && name + ', ' + form.address + ', ' + form.city}</p>
        </aside>
    </main>;
}
function Account({ ar }) {
    return _jsxs("section", { className: "account-panel", children: [_jsx(UserRound, { size: 28 }), _jsx("h2", { children: t(ar, 'Account') }), _jsx("p", { children: ar ? 'انتقل إلى صفحة تسجيل الدخول أو إنشاء الحساب.' : 'Continue to a dedicated sign-in or sign-up page.' }), _jsx("a", { className: "outline-button", href: "/login", children: t(ar, 'Log in') }), _jsx("a", { className: "black-button", href: "/signup", children: t(ar, 'Sign up') })] });
}
function ProductDetails({ ar, product, add, buyNow, navigate }) {
    const colors = Array.isArray(product.colors) ? product.colors : [];
    const sizes = Array.isArray(product.sizes) ? product.sizes : [];
    const salePrice = Number(product.salePrice);
    const shownPrice = Number.isFinite(salePrice) && salePrice > 0 && salePrice < Number(product.price) ? salePrice : Number(product.price);
    const [size, setSize] = useState(sizes.includes('M') ? 'M' : sizes[0] || '');
    const [color, setColor] = useState(colors[0] || '');
    const photos = product.images?.length ? product.images : [product.image];
    const [activePhoto, setActivePhoto] = useState(0);
    useEffect(() => { setSize(sizes.includes('M') ? 'M' : sizes[0] || ''); setColor(colors[0] || ''); setActivePhoto(0); }, [product.id]);
    return <main className="product-details"><div className="details-gallery"><div className="details-image"><img src={photos[activePhoto]} alt={product.name} /></div><div className="details-thumbnails">{photos.map((photo, index) => <button type="button" key={photo + index} className={activePhoto === index ? 'active' : ''} onClick={() => setActivePhoto(index)} aria-label={`View product image ${index + 1}`}><img src={photo} alt="" /></button>)}</div></div><div className="details-copy"><div className="product-modal-heading"><h1>{product.name}</h1><FavoriteButton product={product} /></div><h2>{shownPrice} LE {shownPrice < Number(product.price) && <del className="original-price">{product.price} LE</del>}</h2><p>{ar ? 'تفاصيل المنتج ومعلومات الخامة والمقاس والعناية.' : 'Product details, sizing, material, care and cleaning instructions.'}</p><p>{t(ar, 'PRODUCT COLOR')}{color ? ` : ${color}` : ''}</p><div className="swatches">{colors.map(c => <button type="button" className={`swatch ${String(c).toLowerCase()} ${color === c ? 'selected' : ''}`} style={{ backgroundColor: ({ Cream: '#f5e9d7', Black: '#000000', Sage: '#aab9a9', Brown: '#513a25', Green: '#228b22' })[c] || c }} onClick={() => setColor(c)} aria-label={c} aria-pressed={color === c} key={c} />)}</div><p>{t(ar, 'PRODUCT SIZE')}</p><div className="sizes">{sizes.map(s => <button type="button" className={size === s ? 'selected' : ''} aria-pressed={size === s} onClick={() => setSize(s)} key={s}>{s}</button>)}</div>{(!colors.length || !sizes.length) && <p className="form-error" role="status">{ar ? 'المقاسات أو الألوان غير متاحة حاليًا.' : 'No color or size options are currently available for this item.'}</p>}<button className="black-button" disabled={!size || !color} onClick={() => buyNow({ ...product, price: shownPrice }, size, color)}>{ar ? 'اشتر الآن' : 'Buy Now'}</button><button className="outline-button" disabled={!size || !color} onClick={() => add({ ...product, price: shownPrice }, size, color)}>{t(ar, 'Add To Cart')}</button><button className="text-link" onClick={() => navigate('refund')}>{ar ? 'سياسة الاسترجاع والاسترداد' : 'Return & Refund Policy'}</button><p className="details-shipping">{ar ? 'تظهر خيارات وتفاصيل الشحن عند إتمام الطلب.' : 'Shipping options and details are shown at checkout.'}</p></div></main>;
}
function SearchPanel({ ar, close, select }) {
    const [query, setQuery] = useState('');
    const matches = products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(query.trim().toLowerCase()));
    return _jsxs("section", { className: "filter-panel", children: [_jsx("button", { className: "close", onClick: close, "aria-label": "Close", children: _jsx(X, {}) }), _jsx("h2", { children: ar ? 'بحث' : 'Search' }), _jsxs("div", { className: "searchbar", children: [_jsx(Search, { size: 18 }), _jsx("input", { autoFocus: true, value: query, onChange: (event) => setQuery(event.target.value), placeholder: ar ? 'ابحث عن المنتجات' : 'Search products' })] }), query && (matches.length ? _jsx("div", { className: "search-results", children: matches.map((product) => _jsxs("button", { onClick: () => { close(); select(product); }, children: [_jsx("img", { src: product.image, alt: product.name }), _jsx("p", { children: product.name }), _jsxs("p", { children: [product.price, " LE"] })] }, product.id)) }) : _jsx("p", { role: "status", children: ar ? 'لا توجد نتائج.' : 'No products found.' }))] });
}
function FavoritesPanel({ ar, favorites, toggle, close, select }) {
    useEffect(() => { window.dispatchEvent(new CustomEvent('dokan-favorites-updated', { detail: favorites.length })); }, [favorites]);
    return _jsxs("section", { className: "filter-panel", children: [_jsx("button", { className: "close", onClick: close, "aria-label": "Close", children: _jsx(X, {}) }), _jsx("h2", { children: ar ? 'المفضلة' : 'Favorites' }), products.map((product) => { const saved = favorites.includes(product.id); return _jsxs("div", { className: "saved-address", children: [_jsxs("button", { type: "button", onClick: () => { close(); select(product); }, children: [_jsx("img", { src: product.image, alt: product.name, style: { width: 64, height: 64, objectFit: 'cover' } }), " ", product.name, " \u00B7 ", product.price, " LE"] }), _jsx("button", { className: "text-link", onClick: () => toggle(product.id), children: saved ? (ar ? 'إزالة' : 'Remove') : (ar ? 'حفظ' : 'Save') })] }, product.id); })] });
}
export default function Storefront() {
    useEffect(() => {
        const syncFavorites = (event) => { if (Array.isArray(event.detail)) setFavorites(event.detail); };
        window.addEventListener('dokan-favorites-updated', syncFavorites);
        return () => window.removeEventListener('dokan-favorites-updated', syncFavorites);
    }, []);
    const [page, setPage] = useState('home'); const [ar, setAr] = useState(false); const [items, setItems] = useState([]); const [favorites, setFavorites] = useState([]); const [modal, setModal] = useState(null); const [drawer, setDrawer] = useState(null); const [sort, setSort] = useState('default'); const [filter, setFilter] = useState({ category: '', max: null, color: '', size: '' }); const [details, setDetails] = useState(null); const [hydrated, setHydrated] = useState(false); useEffect(() => {
        setAr(localStorage.getItem('dokan-language') === 'ar'); try {
            const raw = JSON.parse(localStorage.getItem('dokan-cart') || '[]');
            if (Array.isArray(raw))
                setItems(raw.filter(x => x && x.id && Number.isInteger(x.quantity) && x.quantity > 0).map(x => ({ ...x, size: x.size || 'M', color: x.color || 'Cream' })));
            const savedFavorites = JSON.parse(localStorage.getItem('dokan-favorites') || '[]');
            if (Array.isArray(savedFavorites)) setFavorites(savedFavorites.filter((id) => products.some((product) => product.id === id)));
        }
        catch { } setHydrated(true);
    }, []); useEffect(() => { if (hydrated) localStorage.setItem('dokan-language', ar ? 'ar' : 'en'); }, [ar, hydrated]); useEffect(() => { if (hydrated) { document.documentElement.lang = ar ? 'ar' : 'en'; document.documentElement.dir = ar ? 'rtl' : 'ltr'; } }, [ar, hydrated]); useEffect(() => { if (hydrated) localStorage.setItem('dokan-cart', JSON.stringify(items)); }, [items, hydrated]); useEffect(() => { if (hydrated) localStorage.setItem('dokan-favorites', JSON.stringify(favorites)); }, [favorites, hydrated]); const add = (p, size = 'M', color = 'Cream') => setItems(cur => { const key = p.id + '-' + size + '-' + color; const found = cur.find(x => x.id + '-' + x.size + '-' + x.color === key); return found ? cur.map(x => x.id + '-' + x.size + '-' + x.color === key ? { ...x, quantity: x.quantity + 1 } : x) : [...cur, { ...p, size, color, quantity: 1 }]; }); const update = (key, delta) => setItems(cur => cur.map(x => x.id + '-' + x.size + '-' + x.color === key ? { ...x, quantity: Math.max(1, x.quantity + delta) } : x)); const remove = (key) => setItems(cur => cur.filter(x => x.id + '-' + x.size + '-' + x.color !== key)); const toggleFavorite = (id) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); const count = items.reduce((s, x) => s + x.quantity, 0); const close = () => setDrawer(null); return _jsxs("div", { className: "site", dir: ar ? 'rtl' : 'ltr', children: [_jsx(Header, { ar: ar, toggle: () => setAr(x => !x), navigate: setPage, open: setDrawer, count: count }), page === 'home' && _jsx(Home, { ar: ar, navigate: setPage }), " ", page === 'shop' && _jsx(Shop, { ar: ar, add: p => add(p), select: setModal, open: setDrawer, sort: sort, filter: filter, setFilter: setFilter }), " ", page === 'checkout' && _jsx(Checkout, { ar: ar, items: items }), " ", page === 'details' && _jsx(ProductDetails, { ar: ar, product: details || products[0], add: add, buyNow: (p, size, color) => { add(p, size, color); setPage('checkout'); }, navigate: setPage }), " ", page === 'refund' && _jsxs("main", { className: "refund", children: [_jsx("h1", { children: "Refund Policy" }), _jsx("p", { children: "Our refund policy information." })] }), _jsx(Footer, { ar: ar }), modal && _jsx(ProductModal, { ar: ar, product: modal, close: () => setModal(null), add: add, details: () => { setDetails(modal); setModal(null); setPage('details'); } }), drawer && _jsx("div", { className: "overlay", onMouseDown: e => e.target === e.currentTarget && close(), children: _jsxs("div", { className: drawer === 'sort' ? 'drawer sort-drawer' : 'drawer', children: [drawer === 'cart' && _jsxs(_Fragment, { children: [_jsx("button", { className: "close", onClick: close, children: _jsx(X, {}) }), _jsx(Cart, { ar: ar, items: items, checkout: () => { close(); setPage('checkout'); }, update: update, remove: remove, shop: () => { close(); setPage('shop'); } })] }), drawer === 'account' && _jsxs(_Fragment, { children: [_jsx("button", { className: "close", onClick: close, children: _jsx(X, {}) }), _jsx(Account, { ar: ar })] }), drawer === 'search' && _jsx(SearchPanel, { ar: ar, close: close, select: setModal }), drawer === 'favorites' && _jsx(FavoritesPanel, { ar: ar, favorites: favorites, toggle: toggleFavorite, close: close, select: setModal }), drawer === 'filter' && _jsx(FilterPanel, { ar: ar, value: filter, setValue: v => setFilter(current => ({ ...current, ...v })), close: close }), " ", drawer === 'sort' && _jsxs("section", { className: "filter-panel", children: [_jsx("button", { className: "close", onClick: close, children: _jsx(X, {}) }), _jsx("h2", { children: t(ar, 'Sort') }), [['default', 'Best Sellers'], ['recent', 'Last Arrive'], ['low', 'Price Low To High'], ['high', 'Price High To Low']].map(([v, l]) => _jsx("button", { className: "filter-sort-option", onClick: () => { setSort(v); close(); }, children: ar ? { 'Best Sellers': 'الأكثر مبيعًا', 'Last Arrive': 'الأحدث وصولًا', 'Price Low To High': 'السعر من الأقل للأعلى', 'Price High To Low': 'السعر من الأعلى للأقل' }[l] || l : l }, v))] }), drawer === 'menu' && _jsxs("nav", { className: "mobile-menu", children: [_jsx("button", { onClick: () => { close(); setPage('shop'); }, children: t(ar, 'Shop') }), _jsx("a", { href: "/track-order", children: ar ? 'تتبع الطلب' : 'Track Order' }), _jsx("a", { href: "/collections", children: ar ? 'المجموعات' : 'Collection' }), _jsx("button", { onClick: () => { close(); setAr(x => !x); }, children: ar ? 'English' : 'العربية' })] })] }) })] });
}
export { imageUrls };
