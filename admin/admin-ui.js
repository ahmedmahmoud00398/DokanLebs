import { Search } from 'lucide-react';
import styles from './admin.module.css';

export function PageHeading({ title, description, action }) {
  return (
    <div className={styles.pageHeading}>
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCards({ items }) {
  return (
    <div className={styles.statGrid}>
      {items.map(({ label, value, note, tone }) => (
        <article className={styles.statCard} key={label}>
          <p>{label}</p>
          <strong>{value}</strong>
          {note && <small className={tone === 'negative' ? styles.negative : styles.positive}>{note}</small>}
        </article>
      ))}
    </div>
  );
}

export function SearchField({ value, onChange, placeholder = 'Search...' }) {
  return (
    <label className={styles.searchField}>
      <Search size={16} aria-hidden="true" />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

export function StatusPill({ children }) {
  const state = String(children).toLowerCase().replaceAll(' ', '-');
  return <span className={`${styles.statusPill} ${styles[`status_${state}`] || ''}`}>{children}</span>;
}

export function EmptyState({ title, detail }) {
  return <div className={styles.emptyState}><strong>{title}</strong><span>{detail}</span></div>;
}
