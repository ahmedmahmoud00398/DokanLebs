'use client';

import { useState } from 'react';
import { Check, Pencil, Save, Truck } from 'lucide-react';
import { orders, formatMoney } from './admin-data';
import { PageHeading, StatusPill } from './admin-ui';
import styles from './admin.module.css';

const steps = ['Order Placed', 'Payment Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export function OrderTracking() {
  const [selectedId, setSelectedId] = useState(orders[0].id);
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [trackingChanges, setTrackingChanges] = useState({});
  const order = orders.find((item) => item.id === selectedId) || orders[0];
  const tracking = trackingChanges[order.id] || { carrier: order.carrier, number: order.tracking, status: order.status };
  const currentStep = tracking.status === 'Delivered' ? 6 : tracking.status === 'Shipped' ? 3 : tracking.status === 'Processing' ? 2 : 1;

  const updateTracking = (field, value) => setTrackingChanges((current) => ({
    ...current,
    [order.id]: { ...tracking, [field]: value },
  }));

  return (
    <>
      <PageHeading title="Order Tracking" description="Manage delivery progress and update order tracking details." action={
        <div className={styles.trackingHeaderActions}>
          <label className={styles.orderSelect}><span>Order</span><select value={selectedId} onChange={(event) => { setSelectedId(event.target.value); setSaved(false); }} aria-label="Select order">{orders.map((item) => <option value={item.id} key={item.id}>{item.id}</option>)}</select></label>
          {editMode ? <button className={styles.primaryButton} onClick={() => { setEditMode(false); setSaved(true); }}><Save size={15} /> Save tracking</button> : <button className={styles.primaryButton} onClick={() => { setEditMode(true); setSaved(false); }}><Pencil size={14} /> Edit tracking</button>}
        </div>
      } />
      {saved && <p className={styles.formSuccess} role="status">Tracking details saved for this preview.</p>}
      <div className={styles.orderTitle}><div><div className={styles.orderTitleLine}><h2>Order #{order.id}</h2><StatusPill>{tracking.status}</StatusPill></div><p>Placed on {order.date} · Updated just now</p></div><strong>{formatMoney(order.total)}</strong></div>
      <div className={styles.trackingGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeading}><div><h2>Order Tracking</h2><p>Delivery progress and shipping information</p></div></div>
          <div className={styles.trackingMeta}>
            <div><span>Carrier</span>{editMode ? <select value={tracking.carrier} onChange={(event) => updateTracking('carrier', event.target.value)}><option>Bosta</option><option>Aramex</option><option>Mylerz</option></select> : <strong><Truck size={14} /> {tracking.carrier}</strong>}</div>
            <div><span>Tracking number</span>{editMode ? <input value={tracking.number} onChange={(event) => updateTracking('number', event.target.value)} aria-label="Tracking number" /> : <strong>{tracking.number}</strong>}</div>
            <div><span>Expected delivery</span><strong>Oct 24, 2026</strong></div>
          </div>
          <div className={styles.timeline}>
            {steps.map((step, index) => <div className={`${styles.timelineStep} ${index < currentStep ? styles.stepDone : ''} ${index === currentStep ? styles.stepCurrent : ''}`} key={step}>
              <span>{index < currentStep ? <Check size={12} /> : index + 1}</span><div><strong>{step}</strong><small>{index === 0 ? order.date : index < currentStep ? 'Completed' : index === currentStep ? 'In progress' : 'Upcoming'}</small></div>
              {index < steps.length - 1 && <i />}
            </div>)}
          </div>
          {editMode && <label className={styles.formField}>Order status<select value={tracking.status} onChange={(event) => updateTracking('status', event.target.value)}>{['Pending', 'Processing', 'Shipped', 'Delivered'].map((status) => <option key={status}>{status}</option>)}</select></label>}
        </section>
        <div className={styles.orderSide}>
          <section className={styles.panel}><div className={styles.panelHeading}><div><h2>Customer</h2><p>Contact information</p></div></div><strong>{order.customer}</strong><p>customer@email.com</p><p>+20 100 123 4567</p></section>
          <section className={styles.panel}><div className={styles.panelHeading}><div><h2>Shipping Address</h2></div></div><p>{order.address}</p></section>
          <section className={styles.panel}><div className={styles.panelHeading}><div><h2>Payment</h2><p>Payment method</p></div><StatusPill>Paid</StatusPill></div><p>Visa ending in 2048</p><strong>{formatMoney(order.total)}</strong></section>
        </div>
      </div>
      <section className={`${styles.panel} ${styles.tablePanel}`}>
        <div className={styles.panelHeading}><div><h2>Order Items</h2><p>{order.items} items in this order</p></div></div>
        <div className={styles.orderItem}><span className={styles.orderItemImage}>DL</span><div><strong>Classic Denim Jacket</strong><small>Size M · Black · Qty 1</small></div><span>{formatMoney(1300)}</span></div>
        <div className={styles.orderItem}><span className={styles.orderItemImage}>DL</span><div><strong>Oversized Cotton Tee</strong><small>Size L · Cream · Qty 2</small></div><span>{formatMoney(900)}</span></div>
        <div className={styles.orderTotals}><span>Subtotal <b>{formatMoney(order.total - 85)}</b></span><span>Shipping <b>{formatMoney(85)}</b></span><strong>Total <b>{formatMoney(order.total)}</b></strong></div>
      </section>
    </>
  );
}
