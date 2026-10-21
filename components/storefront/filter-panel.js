'use client';
import { X } from 'lucide-react';
import { t } from './data';

export function FilterPanel({ ar, value, setValue, close }) {
  const label = (text) => t(ar, text);
  const colors = ['Cream', 'Black', 'Sage'];
  const sizes = [
    ['XS', 'Extra Small'],
    ['S', 'Small'],
    ['M', 'Medium'],
    ['L', 'Large'],
    ['XL', 'Extra Large'],
  ];
  return (
    <section className="filter-panel">
      <button className="close" onClick={close} aria-label={label('Close')}><X /></button>
      <h2>{label('Filter')}</h2>
      <hr />
      <h3>{label('Colors')}</h3>
      <div className="filter-colors">
        {colors.map((name) => (
          <button
            type="button"
            key={name}
            data-color={name}
            aria-label={label(name)}
            aria-pressed={value.color === name}
            className={value.color === name ? 'active' : ''}
            onClick={() => setValue({ ...value, color: value.color === name ? '' : name })}
          />
        ))}
      </div>
      <h3>{label('Size')}</h3>
      <div className="filter-sizes">
        {sizes.map(([code, name]) => (
          <button
            type="button"
            key={code}
            aria-pressed={value.size === code}
            className={value.size === code ? 'active' : ''}
            onClick={() => setValue({ ...value, size: value.size === code ? '' : code })}
          >
            {label(name)}
          </button>
        ))}
      </div>
      <button
        className="text-link"
        onClick={() => setValue({ ...value, color: '', size: '', max: null, category: '' })}
      >
        {ar ? 'مسح التصفية' : 'Clear filters'}
      </button>
      <button className="black-button" onClick={close}>{label('See Results')}</button>
    </section>
  );
}
