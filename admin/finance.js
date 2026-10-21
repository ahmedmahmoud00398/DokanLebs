'use client';

import { useState } from 'react';
import { ArrowDownToLine, ArrowUpRight } from 'lucide-react';
import { formatMoney, transactions } from './admin-data';
import { PageHeading, StatCards, StatusPill } from './admin-ui';
import styles from './admin.module.css';

const weeks = [26, 41, 31, 53, 45, 62, 37, 48, 72, 55, 68, 83, 56, 76, 65, 91, 59, 75, 48, 69, 84, 60, 77, 95, 66, 80, 54, 72];

export function Finance() {
  const [period, setPeriod] = useState('Last 30 days');
  const exportReport = () => {
    const rows = [
      ['Transaction', 'Customer', 'Date', 'Method', 'Amount (EGP)', 'Status'],
      ...transactions.map((item) => [item.id, item.customer, item.date, item.method, item.amount, item.status]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const link = document.createElement('a');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.href = url;
    link.download = 'dokan-lebss-transactions.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeading title="Finance" description="Track revenue, payouts, and payment activity." action={
        <button className={styles.secondaryButton} onClick={exportReport}><ArrowDownToLine size={15} /> Export report</button>
      } />
      <div className={styles.financeToolbar}><span>Overview</span><select value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Finance reporting period">{['Last 7 days', 'Last 30 days', 'Last 90 days'].map((item) => <option key={item}>{item}</option>)}</select></div>
      <StatCards items={[
        { label: 'TOTAL REVENUE', value: formatMoney(184320), note: <><ArrowUpRight size={13} /> 12.5% vs last month</> },
        { label: 'THIS MONTH', value: formatMoney(76540), note: 'October 1 – October 21' },
        { label: 'PENDING PAYOUTS', value: formatMoney(12900), note: 'Next payout Oct 25', tone: 'negative' },
        { label: 'REFUNDS', value: formatMoney(3240), note: '1.8% of total revenue' },
      ]} />
      <div className={styles.financeGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeading}><div><h2>Revenue over time</h2><p>{period} · Daily gross sales</p></div><strong className={styles.chartValue}>{formatMoney(184320)}</strong></div>
          <div className={styles.barChart} role="img" aria-label="Revenue over time"><span className={styles.chartGrid}><i /><i /><i /><i /></span>{weeks.map((height, index) => <div className={styles.chartBarWrap} key={index}><i className={index === 15 ? styles.chartBarHighlight : ''} style={{ height: `${height}%` }} /></div>)}</div>
          <div className={styles.chartAxis}><span>Oct 1</span><span>Oct 7</span><span>Oct 14</span><span>Oct 21</span></div>
        </section>
        <section className={styles.panel}>
          <div className={styles.panelHeading}><div><h2>Payment methods</h2><p>Share of successful payments</p></div></div>
          {[['Cards', 68, '68%'], ['Cash on delivery', 27, '27%'], ['Wallet', 5, '5%']].map(([name, width, value]) => <div className={styles.paymentMethod} key={name}><div><span>{name}</span><strong>{value}</strong></div><i><b style={{ width: `${width}%` }} /></i></div>)}
          <div className={styles.paymentTotal}><span>Successful payments</span><strong>1,204</strong></div>
        </section>
      </div>
      <section className={`${styles.panel} ${styles.tablePanel}`}>
        <div className={styles.panelHeading}><div><h2>Recent Transactions</h2><p>Latest payments and refunds</p></div></div>
        <div className={styles.tableScroll}><table><thead><tr><th>TRANSACTION</th><th>CUSTOMER</th><th>DATE</th><th>METHOD</th><th>AMOUNT</th><th>STATUS</th></tr></thead><tbody>
          {transactions.map((transaction) => <tr key={transaction.id}><td><strong>{transaction.id}</strong></td><td>{transaction.customer}</td><td>{transaction.date}</td><td>{transaction.method}</td><td>{formatMoney(transaction.amount)}</td><td><StatusPill>{transaction.status}</StatusPill></td></tr>)}
        </tbody></table></div>
      </section>
    </>
  );
}
