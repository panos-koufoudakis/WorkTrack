/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import EmptyState from '../components/EmptyState.jsx';
import Toast from '../components/Toast.jsx';
import { duration, formatDate, formatTime } from '../utils/format.js';

export default function AttendancePage() {
  const [data, setData] = useState({ records: [], isCheckedIn: false });
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const load = () => api('/attendance/mine').then(setData).catch((err) => setError(err.message)).finally(() => setLoading(false));
  useEffect(() => { document.title = 'Παρουσίες | WorkTrack'; load(); }, []);

  const toggle = async () => {
    setWorking(true); setError('');
    try {
      await api(`/attendance/${data.isCheckedIn ? 'check-out' : 'check-in'}`, { method: 'POST', body: '{}' });
      setToast(data.isCheckedIn ? 'Το check-out καταγράφηκε.' : 'Το check-in καταγράφηκε. Καλή εργασία!');
      await load();
    } catch (err) { setError(err.message); }
    finally { setWorking(false); }
  };

  return <div className="page">
    <div className="page-heading split"><div><span className="eyebrow dark">Χρόνος εργασίας</span><h1>Παρουσίες</h1><p>Καταγράψτε την προσέλευση και την αποχώρησή σας.</p></div></div>
    {error && <div className="alert error">{error}</div>}
    <section className={`clock-card ${data.isCheckedIn ? 'active' : ''}`}>
      <div><span className="live-dot" /><small>{data.isCheckedIn ? 'ΕΝΕΡΓΗ ΠΑΡΟΥΣΙΑ' : 'ΔΕΝ ΥΠΑΡΧΕΙ ΕΝΕΡΓΗ ΠΑΡΟΥΣΙΑ'}</small><h2>{new Intl.DateTimeFormat('el-GR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date())}</h2><p>{data.isCheckedIn ? `Έναρξη στις ${formatTime(data.openRecord?.checkIn)}` : 'Ξεκινήστε την εργάσιμη ημέρα σας'}</p></div>
      <button className={`button ${data.isCheckedIn ? 'danger' : 'primary'}`} onClick={toggle} disabled={working}>{working ? 'Καταγραφή…' : data.isCheckedIn ? 'Check-out' : 'Check-in τώρα'}</button>
    </section>
    <section className="card table-card"><div className="section-title"><div><h2>Ιστορικό παρουσιών</h2><p>Οι τελευταίες 100 εγγραφές σας</p></div></div>
      {loading ? <div className="page-loader compact"><span className="spinner" /></div> : data.records.length === 0 ? <EmptyState title="Καμία παρουσία ακόμη" text="Κάντε το πρώτο σας check-in για να ξεκινήσει το ιστορικό." /> : <div className="table-wrap"><table><thead><tr><th>Ημερομηνία</th><th>Προσέλευση</th><th>Αποχώρηση</th><th>Διάρκεια</th><th>Κατάσταση</th></tr></thead><tbody>{data.records.map((record) => <tr key={record.id}><td><strong>{formatDate(record.checkIn)}</strong></td><td>{formatTime(record.checkIn)}</td><td>{formatTime(record.checkOut)}</td><td>{duration(record.checkIn, record.checkOut)}</td><td><span className={`status ${record.checkOut ? 'complete' : 'pending'}`}>{record.checkOut ? 'Ολοκληρώθηκε' : 'Σε εξέλιξη'}</span></td></tr>)}</tbody></table></div>}
    </section>
    <Toast message={toast} onClose={() => setToast('')} />
  </div>;
}

