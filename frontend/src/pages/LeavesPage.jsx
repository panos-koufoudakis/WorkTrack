/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import EmptyState from '../components/EmptyState.jsx';
import Toast from '../components/Toast.jsx';
import { formatDate, statusLabel } from '../utils/format.js';

const emptyForm = { leaveTypeId: '', startDate: '', endDate: '', reason: '' };

export default function LeavesPage() {
  const [requests, setRequests] = useState([]);
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const load = () => Promise.all([api('/leaves/mine'), api('/leaves/types')]).then(([items, leaveTypes]) => { setRequests(items); setTypes(leaveTypes); });
  useEffect(() => { document.title = 'Άδειες | WorkTrack'; load().catch((err) => setError(err.message)); }, []);

  const submit = async (event) => {
    event.preventDefault(); setSubmitting(true); setError('');
    try { await api('/leaves', { method: 'POST', body: JSON.stringify(form) }); setForm(emptyForm); setShowForm(false); setToast('Το αίτημα υποβλήθηκε επιτυχώς.'); await load(); }
    catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  return <div className="page">
    <div className="page-heading split"><div><span className="eyebrow dark">Χρόνος ανάπαυσης</span><h1>Οι άδειές μου</h1><p>Υποβάλετε και παρακολουθήστε τα αιτήματά σας.</p></div><button className="button primary" onClick={() => setShowForm(!showForm)}>＋ Νέο αίτημα</button></div>
    {error && <div className="alert error">{error}</div>}
    {showForm && <section className="card form-card"><div className="section-title"><div><h2>Νέο αίτημα άδειας</h2><p>Όλα τα πεδία με * είναι υποχρεωτικά.</p></div><button className="icon-button" onClick={() => setShowForm(false)}>×</button></div><form className="form-grid" onSubmit={submit}>
      <label className="span-2">Τύπος άδειας *<select value={form.leaveTypeId} onChange={(e) => setForm({ ...form, leaveTypeId: e.target.value })} required><option value="">Επιλέξτε τύπο</option>{types.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}</select></label>
      <label>Από *<input type="date" min={new Date().toISOString().slice(0, 10)} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required /></label>
      <label>Έως *<input type="date" min={form.startDate || new Date().toISOString().slice(0, 10)} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required /></label>
      <label className="span-2">Σημείωση<textarea rows="3" maxLength="500" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Προαιρετική αιτιολογία" /></label>
      <div className="form-actions span-2"><button type="button" className="button secondary" onClick={() => setShowForm(false)}>Ακύρωση</button><button className="button primary" disabled={submitting}>{submitting ? 'Υποβολή…' : 'Υποβολή αιτήματος'}</button></div>
    </form></section>}
    <section className="card table-card"><div className="section-title"><div><h2>Ιστορικό αιτημάτων</h2><p>{requests.length} συνολικά αιτήματα</p></div></div>
      {requests.length === 0 ? <EmptyState title="Δεν έχετε αιτήματα άδειας" text="Το πρώτο σας αίτημα μπορεί να δημιουργηθεί από το κουμπί επάνω." /> : <div className="table-wrap"><table><thead><tr><th>Τύπος</th><th>Περίοδος</th><th>Ημέρες</th><th>Κατάσταση</th><th>Σχόλιο</th></tr></thead><tbody>{requests.map((request) => <tr key={request.id}><td><strong>{request.leaveType?.name}</strong><small className="cell-sub">{request.reason || 'Χωρίς σημείωση'}</small></td><td>{formatDate(request.startDate)} – {formatDate(request.endDate)}</td><td>{request.totalDays}</td><td><span className={`status ${request.status.toLowerCase()}`}>{statusLabel[request.status]}</span></td><td>{request.reviewComment || '—'}</td></tr>)}</tbody></table></div>}
    </section>
    <Toast message={toast} onClose={() => setToast('')} />
  </div>;
}

