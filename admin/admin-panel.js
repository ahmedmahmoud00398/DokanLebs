'use client';

import { useState } from 'react';
import { AdminShell } from './admin-shell';
import { Customers } from './customers';
import { Dashboard } from './dashboard';
import { Finance } from './finance';
import { initialProducts } from './admin-data';
import { OrderTracking } from './order-tracking';
import { ProductEditor } from './product-editor';
import { Products } from './products';
import { Settings } from './settings';

export default function AdminPanel() {
  const [page, setPage] = useState('Dashboard');
  const [products, setProducts] = useState(initialProducts);
  const [editingProduct, setEditingProduct] = useState(null);

  const openProductEditor = (product) => {
    setEditingProduct(product);
    setPage('Product Editor');
  };

  const saveProduct = (product) => {
    setProducts((current) => {
      const exists = current.some((item) => item.id === product.id);
      return exists
        ? current.map((item) => item.id === product.id ? product : item)
        : [product, ...current];
    });
    setPage('Products');
  };

  const cancelProductEditor = () => {
    setEditingProduct(null);
    setPage('Products');
  };

  let screen;
  switch (page) {
    case 'Products':
      screen = <Products products={products} setProducts={setProducts} editProduct={openProductEditor} />;
      break;
    case 'Product Editor':
      screen = <ProductEditor key={editingProduct?.id || 'new'} product={editingProduct} onSave={saveProduct} onCancel={cancelProductEditor} />;
      break;
    case 'Order Tracking':
      screen = <OrderTracking />;
      break;
    case 'Customers':
      screen = <Customers />;
      break;
    case 'Finance':
      screen = <Finance />;
      break;
    case 'Settings':
      screen = <Settings />;
      break;
    default:
      screen = <Dashboard setPage={setPage} />;
  }

  return <AdminShell page={page} setPage={setPage}>{screen}</AdminShell>;
}
