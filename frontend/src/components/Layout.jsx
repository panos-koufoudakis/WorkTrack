/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { roleLabel } from '../utils/format.js';

const nav = [
  { to: '/', label: 'Επισκόπηση', icon: '⌂', roles: ['EMPLOYEE', 'MANAGER', 'ADMIN'] },
  { to: '/attendance', label: 'Παρουσίες', icon: '◷', roles: ['EMPLOYEE', 'MANAGER', 'ADMIN'] },
  { to: '/leaves', label: 'Οι άδειές μου', icon: '▤', roles: ['EMPLOYEE', 'MANAGER', 'ADMIN'] },
  { to: '/approvals', label: 'Εγκρίσεις', icon: '✓', roles: ['MANAGER', 'ADMIN'] },
  { to: '/admin', label: 'Διαχείριση', icon: '⚙', roles: ['ADMIN'] }
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const links = nav.filter((item) => item.roles.includes(user.role));
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;

  return <div className="app-shell">
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="brand"><span className="brand-mark">W</span><div><strong>WorkTrack</strong><small>People operations</small></div></div>
      <nav>{links.map((item) => <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setOpen(false)}>
        <span className="nav-icon">{item.icon}</span>{item.label}
      </NavLink>)}</nav>
      <div className="sidebar-user">
        <span className="avatar">{initials}</span>
        <div><strong>{user.firstName} {user.lastName}</strong><small>{roleLabel[user.role]}</small></div>
        <button className="icon-button" onClick={logout} title="Αποσύνδεση">↪</button>
      </div>
    </aside>
    {open && <button className="sidebar-overlay" onClick={() => setOpen(false)} aria-label="Κλείσιμο μενού" />}
    <main className="main-area">
      <header className="mobile-header"><button className="icon-button" onClick={() => setOpen(true)}>☰</button><strong>WorkTrack</strong><span className="avatar small">{initials}</span></header>
      <Outlet />
    </main>
  </div>;
}

