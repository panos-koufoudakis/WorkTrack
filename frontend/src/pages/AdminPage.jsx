/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import EmptyState from '../components/EmptyState.jsx';
import Toast from '../components/Toast.jsx';
import { roleLabel } from '../utils/format.js';

const initialUser = { firstName: '', lastName: '', email: '', password: '', jobTitle: '', role: 'EMPLOYEE', departmentId: '' };
const initialDepartment = { name: '', code: '', managerId: '' };
const initialType = { name: '', description: '', active: true };

export default function AdminPage() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [types, setTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [userForm, setUserForm] = useState(initialUser);
  const [departmentForm, setDepartmentForm] = useState(initialDepartment);
  const [typeForm, setTypeForm] = useState(initialType);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => Promise.all([
    api('/admin/users'), api('/admin/departments'), api('/admin/leave-types')
  ]).then(([u, d, t]) => { setUsers(u); setDepartments(d); setTypes(t); });
  useEffect(() => { document.title = 'Διαχείριση | WorkTrack'; load().catch((err) => setError(err.message)); }, []);

  const openTab = (next) => { setTab(next); setShowForm(false); setError(''); };
  const create = async (event) => {
    event.preventDefault(); setSubmitting(true); setError('');
    const config = tab === 'users'
      ? ['/admin/users', { ...userForm, departmentId: userForm.departmentId || null }, initialUser, setUserForm]
      : tab === 'departments'
        ? ['/admin/departments', { ...departmentForm, managerId: departmentForm.managerId || null }, initialDepartment, setDepartmentForm]
        : ['/admin/leave-types', typeForm, initialType, setTypeForm];
    try {
      await api(config[0], { method: 'POST', body: JSON.stringify(config[1]) });
      config[3](config[2]); setShowForm(false); setToast('Η εγγραφή δημιουργήθηκε.'); await load();
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  const toggleUser = async (user) => {
    try { await api(`/admin/users/${user.id}`, { method: 'PATCH', body: JSON.stringify({ active: !user.active }) }); setToast(`Ο λογαριασμός ${user.active ? 'απενεργοποιήθηκε' : 'ενεργοποιήθηκε'}.`); await load(); }
    catch (err) { setError(err.message); }
  };
  const toggleType = async (type) => {
    try { await api(`/admin/leave-types/${type.id}`, { method: 'PATCH', body: JSON.stringify({ active: !type.active }) }); await load(); }
    catch (err) { setError(err.message); }
  };
  const removeDepartment = async (department) => {
    if (!window.confirm(`Διαγραφή του τμήματος «${department.name}»;`)) return;
    try { await api(`/admin/departments/${department.id}`, { method: 'DELETE' }); setToast('Το τμήμα διαγράφηκε.'); await load(); }
    catch (err) { setError(err.message); }
  };

  const managerCandidates = users.filter((user) => user.role === 'MANAGER' && user.active);

  return <div className="page">
    <div className="page-heading split"><div><span className="eyebrow dark">Ρυθμίσεις οργανισμού</span><h1>Διαχείριση</h1><p>Εργαζόμενοι, τμήματα και διαθέσιμοι τύποι αδειών.</p></div><button className="button primary" onClick={() => setShowForm(!showForm)}>＋ Νέα εγγραφή</button></div>
    {error && <div className="alert error">{error}</div>}
    <div className="tabs admin-tabs">
      <button className={tab === 'users' ? 'active' : ''} onClick={() => openTab('users')}>Εργαζόμενοι <span>{users.length}</span></button>
      <button className={tab === 'departments' ? 'active' : ''} onClick={() => openTab('departments')}>Τμήματα <span>{departments.length}</span></button>
      <button className={tab === 'types' ? 'active' : ''} onClick={() => openTab('types')}>Τύποι αδειών <span>{types.length}</span></button>
    </div>

    {showForm && <section className="card form-card"><div className="section-title"><div><h2>{tab === 'users' ? 'Νέος εργαζόμενος' : tab === 'departments' ? 'Νέο τμήμα' : 'Νέος τύπος άδειας'}</h2><p>Συμπληρώστε τα στοιχεία της νέας εγγραφής.</p></div><button className="icon-button" onClick={() => setShowForm(false)}>×</button></div>
      {tab === 'users' && <form className="form-grid" onSubmit={create}>
        <label>Όνομα *<input value={userForm.firstName} onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })} minLength="2" required /></label>
        <label>Επώνυμο *<input value={userForm.lastName} onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })} minLength="2" required /></label>
        <label className="span-2">Email *<input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required /></label>
        <label>Προσωρινός κωδικός *<input type="password" minLength="8" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} required /></label>
        <label>Θέση<input value={userForm.jobTitle} onChange={(e) => setUserForm({ ...userForm, jobTitle: e.target.value })} /></label>
        <label>Ρόλος *<select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}><option value="EMPLOYEE">Εργαζόμενος</option><option value="MANAGER">Manager</option><option value="ADMIN">Admin</option></select></label>
        <label>Τμήμα<select value={userForm.departmentId} onChange={(e) => setUserForm({ ...userForm, departmentId: e.target.value })}><option value="">Χωρίς τμήμα</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
        <div className="form-actions span-2"><button type="button" className="button secondary" onClick={() => setShowForm(false)}>Ακύρωση</button><button className="button primary" disabled={submitting}>Δημιουργία</button></div>
      </form>}
      {tab === 'departments' && <form className="form-grid" onSubmit={create}>
        <label>Όνομα *<input value={departmentForm.name} onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })} required /></label>
        <label>Κωδικός *<input value={departmentForm.code} onChange={(e) => setDepartmentForm({ ...departmentForm, code: e.target.value.toUpperCase() })} maxLength="12" required /></label>
        <label className="span-2">Manager<select value={departmentForm.managerId} onChange={(e) => setDepartmentForm({ ...departmentForm, managerId: e.target.value })}><option value="">Χωρίς manager</option>{managerCandidates.map((u) => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}</select></label>
        <div className="form-actions span-2"><button type="button" className="button secondary" onClick={() => setShowForm(false)}>Ακύρωση</button><button className="button primary" disabled={submitting}>Δημιουργία</button></div>
      </form>}
      {tab === 'types' && <form className="form-grid" onSubmit={create}>
        <label className="span-2">Όνομα *<input value={typeForm.name} onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })} required /></label>
        <label className="span-2">Περιγραφή<textarea rows="3" value={typeForm.description} onChange={(e) => setTypeForm({ ...typeForm, description: e.target.value })} /></label>
        <div className="form-actions span-2"><button type="button" className="button secondary" onClick={() => setShowForm(false)}>Ακύρωση</button><button className="button primary" disabled={submitting}>Δημιουργία</button></div>
      </form>}
    </section>}

    {tab === 'users' && <section className="card table-card"><div className="section-title"><div><h2>Εργαζόμενοι</h2><p>Η απενεργοποίηση διατηρεί με ασφάλεια το ιστορικό.</p></div></div>{users.length === 0 ? <EmptyState /> : <div className="table-wrap"><table><thead><tr><th>Εργαζόμενος</th><th>Ρόλος</th><th>Τμήμα</th><th>Κατάσταση</th><th /></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td><div className="person-cell"><span className="avatar small">{user.firstName[0]}{user.lastName[0]}</span><div><strong>{user.firstName} {user.lastName}</strong><small>{user.email}</small></div></div></td><td>{roleLabel[user.role]}</td><td>{user.department?.name || '—'}</td><td><span className={`status ${user.active ? 'complete' : 'rejected'}`}>{user.active ? 'Ενεργός' : 'Ανενεργός'}</span></td><td className="align-right"><button className="text-button" onClick={() => toggleUser(user)}>{user.active ? 'Απενεργοποίηση' : 'Ενεργοποίηση'}</button></td></tr>)}</tbody></table></div>}</section>}
    {tab === 'departments' && <div className="admin-card-grid">{departments.length === 0 ? <section className="card"><EmptyState /></section> : departments.map((department) => <article className="card department-card" key={department.id}><div className="department-code">{department.code}</div><div><h3>{department.name}</h3><p>{department._count?.members || 0} εργαζόμενοι</p></div><div className="department-footer"><span>Manager: {department.manager ? `${department.manager.firstName} ${department.manager.lastName}` : 'Δεν ορίστηκε'}</span><button className="text-button danger-text" onClick={() => removeDepartment(department)}>Διαγραφή</button></div></article>)}</div>}
    {tab === 'types' && <section className="card table-card"><div className="section-title"><div><h2>Τύποι αδειών</h2><p>Μόνο οι ενεργοί εμφανίζονται στη φόρμα εργαζομένου.</p></div></div>{types.length === 0 ? <EmptyState /> : <div className="type-list">{types.map((type) => <div className="type-row" key={type.id}><span className="action-icon blue">▤</span><div><strong>{type.name}</strong><small>{type.description || 'Χωρίς περιγραφή'}</small></div><label className="switch"><input type="checkbox" checked={type.active} onChange={() => toggleType(type)} /><span /></label></div>)}</div>}</section>}
    <Toast message={toast} onClose={() => setToast('')} />
  </div>;
}

