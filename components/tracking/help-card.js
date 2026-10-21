import { translateTracking } from '@/lib/tracking-translations';

export default function HelpCard({ title, entries, sample, isArabic }) {
  return <section className="tracking-card"><h2>{translateTracking(isArabic, title)}</h2>{entries && <ol>{entries.map(([heading, copy]) => <li key={heading}><strong>{translateTracking(isArabic, heading)}</strong><p>{translateTracking(isArabic, copy)}</p></li>)}</ol>}{sample && <div className="tracking-sample"><b>Dokan Lebss</b><p>{translateTracking(isArabic, 'Thanks for your order! Your order number is:')}</p><strong>#DL-10482</strong><small>{translateTracking(isArabic, 'Shipping in 4 days from confirming the order.')}</small></div>}</section>;
}
