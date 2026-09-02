/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const copy = {
  EMPLOYEE: 'Δείτε την παρουσία και τα αιτήματα άδειάς σας.',
  MANAGER: 'Παρακολουθήστε τη δική σας ημέρα και τις εκκρεμότητες της ομάδας.',
  ADMIN: 'Η συνολική εικόνα του οργανισμού σας.'
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    document.title = 'Επισκόπηση | WorkTrack';
    api('/dashboard/summary').then(setSummary).catch((err) => setError(err.message));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Καλημέρα' : hour < 18 ? 'Καλό απόγευμα' : 'Καλησπέρα';
  const cards = user.role === 'ADMIN' ? [
    ['Ενεργοί εργαζόμενοι', summary?.activeUsers, 'Άτομα', 'users'],
    ['Τμήματα', summary?.departments, 'Ομάδες', 'departments'],
    ['Εκκρεμείς άδειες', summary?.pendingLeaves, 'Για αξιολόγηση', 'pending'],
    ['Τύποι αδειών', summary?.activeLeaveTypes, 'Ενεργοί', 'types']
  ] : [
    ['Κατάσταση σήμερα', summary?.isCheckedIn ? 'Εντός' : 'Εκτός', summary?.isCheckedIn ? 'Ενεργό check-in' : 'Δεν έχει γίνει check-in', 'presence'],
    ['Εκκρεμείς άδειες', summary?.pendingLeaves, user.role === 'MANAGER' ? 'Της ομάδας' : 'Δικά σας αιτήματα', 'pending'],
    ...(user.role === 'EMPLOYEE' ? [['Εγκεκριμένες άδειες', summary?.approvedLeaves, 'Συνολικά αιτήματα', 'approved']] : [])
  ];

  return <div className="page">
    <div className="page-heading"><div><span className="eyebrow dark">{new Intl.DateTimeFormat('el-GR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</span><h1>{greeting}, {user.firstName}</h1><p>{copy[user.role]}</p></div></div>
    {error && <div className="alert error">{error}</div>}
    <div className="stats-grid">{cards.map(([label, value, hint, kind]) => <article className="stat-card" key={label}><div className={`stat-symbol ${kind}`}>{kind === 'presence' ? '◷' : kind === 'pending' ? '!' : '•'}</div><div><span>{label}</span><strong>{value ?? '—'}</strong><small>{hint}</small></div></article>)}</div>
    <div className="dashboard-grid">
      <section className="card quick-actions"><div className="section-title"><div><h2>Γρήγορες ενέργειες</h2><p>Τα συχνότερα εργαλεία σας</p></div></div><div className="action-list">
        <Link to="/attendance"><span className="action-icon green">◷</span><div><strong>Καταγραφή παρουσίας</strong><small>Check-in, check-out και ιστορικό</small></div><b>›</b></Link>
        <Link to="/leaves"><span className="action-icon blue">＋</span><div><strong>Νέο αίτημα άδειας</strong><small>Υποβολή και παρακολούθηση</small></div><b>›</b></Link>
        {(user.role === 'MANAGER' || user.role === 'ADMIN') && <Link to="/approvals"><span className="action-icon amber">✓</span><div><strong>Αξιολόγηση αιτημάτων</strong><small>{summary?.pendingLeaves || 0} σε αναμονή</small></div><b>›</b></Link>}
        {user.role === 'ADMIN' && <Link to="/admin"><span className="action-icon purple">⚙</span><div><strong>Διαχείριση οργανισμού</strong><small>Εργαζόμενοι, τμήματα και άδειες</small></div><b>›</b></Link>}
      </div></section>
      <section className="card notice-card"><div className="notice-art"><span>W</span></div><h2>Μια ήρεμη εργάσιμη ημέρα ξεκινά με σωστή ενημέρωση.</h2><p>Καταγράψτε την παρουσία σας και οργανώστε έγκαιρα τις ημέρες άδειας.</p></section>
    </div>
  </div>;
}

