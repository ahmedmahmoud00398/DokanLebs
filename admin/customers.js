'use client';

import { useMemo, useState } from 'react';
import { Eye, Mail } from 'lucide-react';
import { customers, formatMoney } from './admin-data';
import { PageHeading, SearchField, StatCards, StatusPill } from './admin-ui';
import styles from './admin.module.css';

export function Customers() {
  const [search, setSearch] = useState('');
  const [customerType, setCustomerType] = useState('All customers');
  const [period, setPeriod] = useState('Last 30 days');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const visibleCustomers = useMemo(() => customers.filter((customer) =>
    `${customer.name} ${customer.email} ${customer.id}`.toLowerCase().includes(search.toLowerCase())
    && (customerType === 'All customers' || customer.status === customerType)),
  [search, customerType]);

  return (
    <>
      <PageHeading title="Customers" description="Understand your customers and their shopping activity." />
      <StatCards items={[
        { label: 'TOTAL CUSTOMERS', value: '2,846', note: '+12.8% from last month' },
        { label: 'NEW THIS MONTH', value: '342', note: 'Customers joined in October' },
        { label: 'RETURNING CUSTOMERS', value: '61%', note: '+4.2% from last month' },
        { label: 'AVG. LIFETIME VALUE', value: formatMoney(1280), note: 'Across all customers' },
      ]} />
      <section className={`${styles.panel} ${styles.tablePanel}`}>
        <div className={styles.productToolbar}>
          <SearchField value={search} onChange={setSearch} placeholder="Search customers..." />
          <div className={styles.toolbarControls}><select className={styles.selectButton} aria-label="Filter customers" value={customerType} onChange={(event) => setCustomerType(event.target.value)}><option>All customers</option><option>New</option><option>Returning</option></select><select className={styles.selectButton} aria-label="Customer activity period" value={period} onChange={(event) => setPeriod(event.target.value)}><option>Last 7 days</option><option>Last 30 days</option><option>Last 90 days</option></select></div>
        </div>
        <div className={styles.tableScroll}><table><thead><tr><th>CUSTOMER</th><th>ORDERS</th><th>TOTAL SPENT</th><th>LAST ACTIVE</th><th>TYPE</th><th>DETAILS</th></tr></thead><tbody>
          {visibleCustomers.map((customer) => <tr key={customer.id}>
            <td><div className={styles.customerCell}><span className={styles.avatar}>{customer.name.split(' ').map((name) => name[0]).join('')}</span><div><strong>{customer.name}</strong><small>{customer.email}</small></div></div></td>
            <td>{customer.orders}</td><td>{formatMoney(customer.spent)}</td><td>{customer.lastActive}</td><td><StatusPill>{customer.status}</StatusPill></td>
            <td><button className={styles.iconTextButton} onClick={() => setSelectedCustomer(customer)}><Eye size={14} /> View</button></td>
          </tr>)}
          {!visibleCustomers.length && <tr><td colSpan="6" className={styles.tableEmpty}>No customers found.</td></tr>}
        </tbody></table></div>
        <div className={styles.tableFooter}><span>Showing {visibleCustomers.length} preview customers</span><div><button disabled>Previous</button><button className={styles.pageNumber}>1</button><button disabled>Next</button></div></div>
      </section>
      {selectedCustomer && <div className={styles.modalBackdrop} onMouseDown={(event) => event.target === event.currentTarget && setSelectedCustomer(null)}><section className={styles.detailModal} role="dialog" aria-modal="true" aria-labelledby="customer-detail-title">
        <button className={styles.modalClose} aria-label="Close customer details" onClick={() => setSelectedCustomer(null)}>×</button>
        <span className={styles.avatarLarge}>{selectedCustomer.name.split(' ').map((name) => name[0]).join('')}</span>
        <h2 id="customer-detail-title">{selectedCustomer.name}</h2><p>{selectedCustomer.email}</p>
        <div className={styles.customerSummary}><span><small>ORDERS</small><strong>{selectedCustomer.orders}</strong></span><span><small>TOTAL SPENT</small><strong>{formatMoney(selectedCustomer.spent)}</strong></span><span><small>TYPE</small><StatusPill>{selectedCustomer.status}</StatusPill></span></div>
        <a className={styles.secondaryButton} href={`mailto:${selectedCustomer.email}`}><Mail size={15} /> Email customer</a>
      </section></div>}
    </>
  );
}
