/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import EmptyState from '../components/EmptyState.jsx';
import Toast from '../components/Toast.jsx';
import { formatDate, statusLabel } from '../utils/format.js';

export default function ApprovalsPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('PENDING');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [workingId, setWorkingId] = useState('');
  const load = () => api('/leaves/department').then(setItems);
  useEffect(() => { document.title = 'Εγκρίσεις | WorkTrack'; load().catch((err) => setError(err.message)); }, []);
  const filtered = useMemo(() => filter === 'ALL' ? items : items.filter((item) => item.status === filter), [items, filter]);

  const review = async (id, status) => {
    const reviewComment = status === 'REJECTED' ? window.prompt('Προαιρετικό σχόλιο απόρριψης:') || '' : '';
    setWorkingId(id); setError('');
    try { await api(`/leaves/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, reviewComment }) }); setToast(status === 'APPROVED' ? 'Το αίτημα εγκρίθηκε.' : 'Το αίτημα απορρίφθηκε.'); await load(); }
    catch (err) { setError(err.message); }
    finally { setWorkingId(''); }
  };

  return <div className="page">
    <div className="page-heading"><div><span className="eyebrow dark">Η ομάδα μου</span><h1>Εγκρίσεις αδειών</h1><p>Αξιολογήστε μόνο τα αιτήματα εργαζομένων του τμήματός σας.</p></div></div>
    {error && <div className="alert error">{error}</div>}
    <div className="tabs">{[['PENDING', 'Σε αναμονή'], ['APPROVED', 'Εγκεκριμένα'], ['REJECTED', 'Απορριφθέντα'], ['ALL', 'Όλα']].map(([value, label]) => <button key={value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>{label}<span>{value === 'ALL' ? items.length : items.filter((i) => i.status === value).length}</span></button>)}</div>
    <section className="approval-list">{filtered.length === 0 ? <div className="card"><EmptyState title="Καμία εκκρεμότητα" text="Δεν υπάρχουν αιτήματα σε αυτή την κατηγορία." /></div> : filtered.map((request) => <article className="card approval-card" key={request.id}>
      <div className="request-person"><span className="avatar">{request.employee.firstName[0]}{request.employee.lastName[0]}</span><div><strong>{request.employee.firstName} {request.employee.lastName}</strong><small>{request.employee.email}</small></div><span className={`status ${request.status.toLowerCase()}`}>{statusLabel[request.status]}</span></div>
      <div className="request-details"><div><small>ΤΥΠΟΣ ΑΔΕΙΑΣ</small><strong>{request.leaveType.name}</strong></div><div><small>ΗΜΕΡΟΜΗΝΙΕΣ</small><strong>{formatDate(request.startDate)} – {formatDate(request.endDate)}</strong></div><div><small>ΔΙΑΡΚΕΙΑ</small><strong>{request.totalDays} ημέρες</strong></div></div>
      {request.reason && <p className="request-reason">“{request.reason}”</p>}
      {request.status === 'PENDING' && <div className="approval-actions"><button className="button secondary danger-text" disabled={workingId === request.id} onClick={() => review(request.id, 'REJECTED')}>Απόρριψη</button><button className="button primary" disabled={workingId === request.id} onClick={() => review(request.id, 'APPROVED')}>Έγκριση</button></div>}
      {request.reviewComment && <p className="review-note"><strong>Σχόλιο:</strong> {request.reviewComment}</p>}
    </article>)}</section>
    <Toast message={toast} onClose={() => setToast('')} />
  </div>;
}

