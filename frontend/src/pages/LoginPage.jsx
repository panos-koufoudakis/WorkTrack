/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const demoAccounts = [
  ['employee@worktrack.local', 'Εργαζόμενος'],
  ['manager@worktrack.local', 'Manager'],
  ['admin@worktrack.local', 'Admin']
];

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => { document.title = 'Σύνδεση | WorkTrack'; }, []);
  if (user) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault(); setError(''); setSubmitting(true);
    try { await login(form.email, form.password); navigate('/'); }
    catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  const useDemo = (email) => setForm({ email, password: 'Demo123!' });

  return <div className="login-page">
    <section className="login-visual">
      <div className="visual-glow" />
      <div className="brand light"><span className="brand-mark">W</span><div><strong>WorkTrack</strong><small>People operations</small></div></div>
      <div className="visual-copy"><span className="eyebrow">Απλά. Καθαρά. Ανθρώπινα.</span><h1>Η εργάσιμη ημέρα,<br />σε μία εικόνα.</h1><p>Παρουσίες και άδειες χωρίς χαρτιά, πολύπλοκα φύλλα και χαμένο χρόνο.</p></div>
      <div className="visual-stat"><span className="pulse" /><div><strong>Η ομάδα είναι σε συγχρονισμό</strong><small>Άμεση ενημέρωση, ασφαλής πρόσβαση</small></div></div>
    </section>
    <section className="login-panel">
      <div className="login-card">
        <span className="mobile-logo brand-mark">W</span>
        <div className="eyebrow dark">Καλώς ήρθατε</div>
        <h2>Σύνδεση στο WorkTrack</h2>
        <p className="muted">Χρησιμοποιήστε τα εταιρικά σας στοιχεία.</p>
        {error && <div className="alert error">{error}</div>}
        <form onSubmit={submit}>
          <label>Email<input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@company.gr" required /></label>
          <label>Κωδικός<input type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Τουλάχιστον 8 χαρακτήρες" minLength="8" required /></label>
          <button className="button primary wide" disabled={submitting}>{submitting ? <><span className="spinner small" />Σύνδεση…</> : 'Σύνδεση'}</button>
        </form>
        <div className="demo-box"><span>Demo λογαριασμοί</span><div>{demoAccounts.map(([email, label]) => <button key={email} onClick={() => useDemo(email)}>{label}</button>)}</div><small>Κοινός κωδικός seed: Demo123!</small></div>
      </div>
      <footer>© 2026 WorkTrack · Coding Factory Project</footer>
    </section>
  </div>;
}

