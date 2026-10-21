'use client';

import { useState } from 'react';
import { ArrowUpRight, CircleArrowOutUpRight } from 'lucide-react';
import { orders, formatMoney } from './admin-data';
import { PageHeading, StatCards, StatusPill } from './admin-ui';
import styles from './admin.module.css';

const revenueBars = [33, 44, 39, 61, 49, 74, 43, 57, 82, 53, 68, 91, 62, 77, 48, 70, 96, 61, 79, 54, 72, 87, 58, 78];

export function Dashboard({ setPage }) {
  const [period, setPeriod] = useState('Last 30 days');

  return (
    <>
      <PageHeading title="Dashboard" description="Here’s an overview of your store’s performance." action={
        <button className={styles.secondaryButton} onClick={() => setPage('Products')}>View products <CircleArrowOutUpRight size={15} /></button>
      } />
      <div className={styles.periodBar}><span>{period}</span>{['Today', 'This week', 'Last 30 days'].map((item) => <button className={period === item ? styles.periodSelected : ''} key={item} onClick={() => setPeriod(item)}>{item}</button>)}</div>
      <StatCards items={[
        { label: 'TOTAL REVENUE', value: formatMoney(184320), note: <><ArrowUpRight size={13} /> 12.5% vs last month</> },
        { label: 'TOTAL ORDERS', value: '1,248', note: <><ArrowUpRight size={13} /> 8.3% vs last month</> },
        { label: 'PENDING ORDERS', value: '342', note: 'Needs your attention', tone: 'negative' },
        { label: 'AVG. ORDER VALUE', value: formatMoney(477), note: <><ArrowUpRight size={13} /> 4.2% vs last month</> },
      ]} />
      <section className={`${styles.panel} ${styles.revenuePanel}`}>
        <div className={styles.panelHeading}><div><h2>Revenue</h2><p>Sales performance over {period.toLowerCase()}</p></div><select className={styles.selectButton} aria-label="Revenue chart period"><option>Last 7 days</option><option>Last 30 days</option><option>Last 90 days</option></select></div>
        <div className={styles.chartLegend}><span><i /> Revenue</span><strong>EGP 42,680</strong></div>
        <div className={styles.barChart} role="img" aria-label="Revenue chart showing daily sales over the last seven days">
          {revenueBars.map((height, index) => <div className={styles.chartBarWrap} key={index}><i className={index === 16 ? styles.chartBarHighlight : ''} style={{ height: `${height}%` }} /></div>)}
        </div>
        <div className={styles.chartAxis}><span>Oct 14</span><span>Oct 16</span><span>Oct 18</span><span>Oct 20</span><span>Oct 21</span></div>
      </section>
      <section className={styles.panel}>
        <div className={styles.panelHeading}><div><h2>Top Selling Products</h2><p>Your best performers this month</p></div><button className={styles.textButton} onClick={() => setPage('Products')}>View all</button></div>
        <div className={styles.topProducts}>
          {[
            ['Classic Denim Jacket', 'Outerwear · 124 sold', 'EGP 79,800', '/Rectangle 7.png'],
            ['Oversized Cotton Tee', 'Tops · 98 sold', 'EGP 45,440', '/e9b39c94-37ce-4bee-a1db-30924d5bfed3.jpeg'],
            ['Linen Summer Shirt', 'Tops · 76 sold', 'EGP 34,020', '/Rectangle 9.png'],
            ['Knitted Cardigan', 'Knitwear · 62 sold', 'EGP 30,420', '/home-card-images/category-top.png'],
          ].map(([name, subtitle, amount, image], index) => (
            <div className={styles.topProductRow} key={name}><span className={styles.rank}>{String(index + 1).padStart(2, '0')}</span><img src={image} alt="" /><div><strong>{name}</strong><small>{subtitle}</small></div><b>{amount}</b></div>
          ))}
        </div>
      </section>
      <section className={`${styles.panel} ${styles.tablePanel}`}>
        <div className={styles.panelHeading}><div><h2>Recent Orders</h2><p>Latest orders from your store</p></div><button className={styles.textButton} onClick={() => setPage('Order Tracking')}>View all orders</button></div>
        <div className={styles.tableScroll}><table><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>DATE</th><th>ITEMS</th><th>TOTAL</th><th>STATUS</th></tr></thead><tbody>
          {orders.slice(0, 3).map((order) => <tr key={order.id}><td><strong>{order.id}</strong></td><td>{order.customer}</td><td>{order.date}</td><td>{order.items}</td><td>{formatMoney(order.total)}</td><td><StatusPill>{order.status}</StatusPill></td></tr>)}
        </tbody></table></div>
      </section>
    </>
  );
}
