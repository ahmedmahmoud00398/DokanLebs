'use client';

import { useState } from 'react';
import {
  BarChart3,
  Bell,
  Boxes,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  Truck,
  Users,
  X,
} from 'lucide-react';
import styles from './admin.module.css';

const navigation = [
  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'Products', label: 'Products', icon: Package },
  { id: 'Order Tracking', label: 'Order Tracking', icon: Truck },
  { id: 'Customers', label: 'Customers', icon: Users },
  { id: 'Finance', label: 'Finance', icon: BarChart3 },
  { id: 'Settings', label: 'Settings', icon: Settings },
];

export function AdminShell({ page, setPage, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const currentPage = page === 'Product Editor' ? 'Products' : page;

  const navigate = (pageName) => {
    setPage(pageName);
    setMenuOpen(false);
  };

  return (
    <div className={styles.adminRoot}>
      {menuOpen && <button className={styles.mobileScrim} aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}>
          <span className={styles.brandMark}><Boxes size={20} /></span>
          <span>Dokan Lebss</span>
          <button className={styles.sidebarClose} aria-label="Close navigation" onClick={() => setMenuOpen(false)}><X size={18} /></button>
        </div>
        <div className={styles.navCaption}>STORE MANAGEMENT</div>
        <nav className={styles.navigation} aria-label="Admin navigation">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`${styles.navItem} ${currentPage === id ? styles.navActive : ''}`}
              aria-current={currentPage === id ? 'page' : undefined}
              onClick={() => navigate(id)}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {id === 'Order Tracking' && <span className={styles.navCount}>8</span>}
            </button>
          ))}
        </nav>
        <div className={styles.sidebarBottom}>
          <div className={styles.storeBadge}><span className={styles.onlineDot} /> Store is live</div>
          <button className={styles.storeLink} onClick={() => window.open('/', '_blank', 'noopener,noreferrer')}>
            View storefront <span aria-hidden="true">↗</span>
          </button>
          <div className={styles.adminProfile}>
            <div className={styles.avatar}>AM</div>
            <div><strong>Ahmed Mahmoud</strong><small>Store owner</small></div>
            <span className={styles.profileDots}>···</span>
          </div>
        </div>
      </aside>

      <div className={styles.adminMain}>
        <header className={styles.topbar}>
          <button className={styles.mobileMenuButton} aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu size={20} /></button>
          <div className={styles.breadcrumb}>Store admin <span>/</span> <strong>{currentPage}</strong></div>
          <div className={styles.topbarActions}>
            <span className={styles.storeLive}><i /> Store is live</span>
            <button className={styles.notificationButton} aria-label="Notifications" aria-expanded={notificationOpen} onClick={() => setNotificationOpen((current) => !current)}><Bell size={18} /><i /></button>
            <span className={styles.topbarAvatar}>AM</span>
          </div>
          {notificationOpen && <section className={styles.notificationPopover} aria-label="Notifications"><strong>Notifications</strong><p>You’re all caught up.</p><small>New order and low-stock alerts will appear here.</small></section>}
        </header>
        <main className={styles.content}>{children}</main>
        <footer className={styles.footer}>© 2026 Dokan Lebss <span>Admin panel · Frontend preview</span></footer>
      </div>
    </div>
  );
}
