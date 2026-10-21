'use client';

import { useState } from 'react';
import { ArrowLeft, ImagePlus, Plus, X } from 'lucide-react';
import { formatMoney } from './admin-data';
import { PageHeading } from './admin-ui';
import styles from './admin.module.css';

const sizes = ['XS', 'S', 'M', 'L', 'XL'];
const swatches = [
  ['Cream', '#eadbc7'],
  ['Black', '#171717'],
  ['Sage', '#a7b4a6'],
  ['Rose', '#d9a9a2'],
  ['Blue', '#8da6c2'],
  ['Yellow', '#e4c75b'],
  ['Red', '#c64b42'],
];

export function ProductEditor({ product, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    comparePrice: product?.comparePrice || '',
    category: product?.category || 'Tops',
    stock: product?.stock ?? '',
    status: product?.status || 'Active',
    image: product?.image || '',
    selectedSizes: product?.selectedSizes || ['S', 'M', 'L', 'XL'],
    selectedColors: product?.selectedColors || ['Black'],
  }));
  const [saveError, setSaveError] = useState('');

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const toggleListItem = (field, value) => setForm((current) => ({
    ...current,
    [field]: current[field].includes(value) ? current[field].filter((item) => item !== value) : [...current[field], value],
  }));

  const addImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setSaveError('Choose an image file to use as the product photo.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        update('image', reader.result);
        setSaveError('');
      } else {
        setSaveError('The image could not be previewed. Please choose another file.');
      }
    };
    reader.onerror = () => setSaveError('The image could not be read. Please choose another file.');
    reader.readAsDataURL(file);
  };

  const save = (event, status = form.status) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setSaveError('Enter a product name before saving.');
      return;
    }
    if (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0) {
      setSaveError('Enter a price greater than zero.');
      return;
    }
    if (form.selectedSizes.length === 0 || form.selectedColors.length === 0) {
      setSaveError('Select at least one size and one color.');
      return;
    }
    onSave({
      ...product,
      ...form,
      id: product?.id || `PRD-${Date.now().toString().slice(-6)}`,
      name: form.name.trim(),
      price: Number(form.price),
      stock: Math.max(0, Number(form.stock) || 0),
      status,
      image: form.image || '/placeholder.jpg',
    });
  };

  return (
    <form onSubmit={(event) => save(event)} className={styles.editor}>
      <PageHeading title={product ? 'Edit Product' : 'Add Product'} description={product ? 'Update product details and inventory.' : 'Add a new item to your store.'} action={
        <div className={styles.editorActions}>
          <button className={styles.secondaryButton} type="button" onClick={onCancel}><ArrowLeft size={15} /> Back</button>
          <button className={styles.secondaryButton} type="button" onClick={(event) => save(event, 'Draft')}>Save draft</button>
          <button className={styles.primaryButton} type="submit">{product ? 'Save changes' : 'Publish product'}</button>
        </div>
      } />
      {saveError && <p className={styles.formError} role="alert">{saveError}</p>}
      <div className={styles.editorGrid}>
        <div className={styles.editorMain}>
          <section className={styles.panel}>
            <div className={styles.sectionTitle}><h2>Product Information</h2><p>Enter the basic information customers will see.</p></div>
            <label className={styles.formField}>Product name<input required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="e.g. Classic Denim Jacket" /></label>
            <label className={styles.formField}>Description<textarea rows="4" value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Describe the fabric, fit, and details..." /></label>
            <div className={styles.formTwoCol}>
              <label className={styles.formField}>Price (EGP)<input required min="1" type="number" value={form.price} onChange={(event) => update('price', event.target.value)} placeholder="0.00" /></label>
              <label className={styles.formField}>Compare-at price (EGP)<input min="0" type="number" value={form.comparePrice} onChange={(event) => update('comparePrice', event.target.value)} placeholder="Optional" /></label>
            </div>
          </section>
          <section className={styles.panel}>
            <div className={styles.sectionTitle}><h2>Product Images</h2><p>Add clear images to show your product.</p></div>
            <label className={styles.uploadArea}><input type="file" accept="image/*" onChange={addImage} /><ImagePlus size={22} /><strong>Click to upload an image</strong><span>PNG or JPG · Image preview stays on this device</span></label>
            {form.image && <div className={styles.imagePreview}><img src={form.image} alt="Product preview" /><button type="button" aria-label="Remove product image" onClick={() => update('image', '')}><X size={15} /></button></div>}
          </section>
          <section className={styles.panel}>
            <div className={styles.sectionTitle}><h2>Pricing &amp; Inventory</h2><p>Keep track of stock for each item.</p></div>
            <div className={styles.formTwoCol}>
              <label className={styles.formField}>Category<select value={form.category} onChange={(event) => update('category', event.target.value)}>{['Tops', 'Bottoms', 'Outerwear', 'Knitwear', 'Accessories', 'Shoes'].map((category) => <option key={category}>{category}</option>)}</select></label>
              <label className={styles.formField}>Available quantity<input min="0" type="number" value={form.stock} onChange={(event) => update('stock', event.target.value)} placeholder="0" /></label>
            </div>
            <div className={styles.variantBlock}><h3>Sizes</h3><div className={styles.sizePicker}>{sizes.map((size) => <button className={form.selectedSizes.includes(size) ? styles.sizeSelected : ''} key={size} type="button" aria-pressed={form.selectedSizes.includes(size)} onClick={() => toggleListItem('selectedSizes', size)}>{size}</button>)}</div></div>
            <div className={styles.variantBlock}><h3>Colors</h3><div className={styles.colorPicker}>{swatches.map(([name, color]) => <button key={name} type="button" aria-label={name} aria-pressed={form.selectedColors.includes(name)} title={name} style={{ backgroundColor: color }} className={form.selectedColors.includes(name) ? styles.colorSelected : ''} onClick={() => toggleListItem('selectedColors', name)} />)}</div></div>
          </section>
          <button className={`${styles.primaryButton} ${styles.mobilePublish}`} type="submit"><Plus size={15} /> {product ? 'Save changes' : 'Publish product'}</button>
        </div>
        <aside className={styles.editorAside}>
          <section className={styles.panel}>
            <div className={styles.sectionTitle}><h2>Status</h2><p>Set product visibility in your store.</p></div>
            <label className={styles.formField}>Visibility<select value={form.status} onChange={(event) => update('status', event.target.value)}><option>Active</option><option>Draft</option><option>Low stock</option><option>Out of stock</option></select></label>
          </section>
          <section className={styles.panel}>
            <div className={styles.sectionTitle}><h2>Collection</h2><p>Choose where your product appears.</p></div>
            <label className={styles.formField}>Product collection<select><option>New Arrivals</option><option>Winter Collection</option><option>Best Sellers</option><option>None</option></select></label>
            <p className={styles.collectionNote}><Plus size={13} /> Collections can be managed from the store catalog.</p>
          </section>
          <section className={styles.panel}>
            <div className={styles.sectionTitle}><h2>Preview</h2><p>Product card preview</p></div>
            <div className={styles.productPreview}>{form.image ? <img src={form.image} alt="" /> : <div className={styles.previewPlaceholder}><ImagePlus size={20} /></div>}<strong>{form.name || 'Product name'}</strong><span>{form.category}</span><b>{form.price ? formatMoney(form.price) : 'EGP 0'}</b></div>
          </section>
          <div className={styles.editorAsideFooter}><button className={styles.secondaryButton} type="button" onClick={onCancel}>Discard changes</button><span><Plus size={12} /> Changes stay in this preview while open</span></div>
        </aside>
      </div>
    </form>
  );
}
