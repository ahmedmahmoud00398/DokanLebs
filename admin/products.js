'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, MoreHorizontal, Plus, SlidersHorizontal } from 'lucide-react';
import { formatMoney } from './admin-data';
import { PageHeading, SearchField, StatCards, StatusPill } from './admin-ui';
import styles from './admin.module.css';

export function Products({ products, setProducts, editProduct }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All products');
  const [sortDirection, setSortDirection] = useState('up');
  const filteredProducts = useMemo(() => products
    .filter((product) => `${product.name} ${product.id} ${product.category}`.toLowerCase().includes(search.toLowerCase()))
    .filter((product) => status === 'All products' || product.status === status)
    .sort((a, b) => sortDirection === 'up' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)),
  [products, search, status, sortDirection]);

  const removeProduct = (product) => {
    if (window.confirm(`Remove ${product.name} from this preview catalog?`)) {
      setProducts((current) => current.filter((item) => item.id !== product.id));
    }
  };

  return (
    <>
      <PageHeading title="Products" description="Manage your products, inventory, and collections." action={
        <button className={styles.primaryButton} onClick={() => editProduct(null)}><Plus size={16} /> Add Product</button>
      } />
      <StatCards items={[
        { label: 'TOTAL PRODUCTS', value: '156', note: 'Across all collections' },
        { label: 'ACTIVE', value: '128', note: 'Visible in your store' },
        { label: 'LOW STOCK', value: '18', note: 'Less than 10 items', tone: 'negative' },
        { label: 'OUT OF STOCK', value: '10', note: 'Currently unavailable', tone: 'negative' },
      ]} />
      <section className={`${styles.panel} ${styles.tablePanel}`}>
        <div className={styles.productToolbar}>
          <SearchField value={search} onChange={setSearch} placeholder="Search products..." />
          <div className={styles.toolbarControls}>
            <label className={styles.filterSelect}><SlidersHorizontal size={15} /><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter products by status">
              {['All products', 'Active', 'Low stock', 'Out of stock'].map((option) => <option key={option}>{option}</option>)}
            </select></label>
            <button className={styles.selectButton} onClick={() => setSortDirection((current) => current === 'up' ? 'down' : 'up')}>Name {sortDirection === 'up' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}</button>
          </div>
        </div>
        <div className={styles.tableScroll}><table><thead><tr><th><input type="checkbox" aria-label="Select all products" /></th><th>PRODUCT</th><th>SKU</th><th>PRICE</th><th>STOCK</th><th>CATEGORY</th><th>STATUS</th><th aria-label="Actions" /></tr></thead><tbody>
          {filteredProducts.length ? filteredProducts.map((product) => (
            <tr key={product.id}>
              <td><input type="checkbox" aria-label={`Select ${product.name}`} /></td>
              <td><div className={styles.productCell}><img src={product.image} alt="" /><div><strong>{product.name}</strong><small>{product.id}</small></div></div></td>
              <td>{product.id}</td><td>{formatMoney(product.price)}</td><td>{product.stock} in stock</td><td>{product.category}</td>
              <td><StatusPill>{product.status}</StatusPill></td>
              <td><div className={styles.rowActions}><button aria-label={`Edit ${product.name}`} onClick={() => editProduct(product)}><MoreHorizontal size={18} /></button><div className={styles.actionMenu}><button onClick={() => editProduct(product)}>Edit product</button><button onClick={() => removeProduct(product)}>Remove</button></div></div></td>
            </tr>
          )) : <tr><td colSpan="8" className={styles.tableEmpty}>No products match your search.</td></tr>}
        </tbody></table></div>
        <div className={styles.tableFooter}><span>Showing {filteredProducts.length} preview products</span><div><button disabled>Previous</button><button className={styles.pageNumber}>1</button><button disabled>Next</button></div></div>
      </section>
      <p className={styles.previewNote}>Changes are stored in this page only. No backend is connected.</p>
    </>
  );
}
