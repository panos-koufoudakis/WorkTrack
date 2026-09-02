/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('worktrack_token')));

  const logout = useCallback(async () => {
    try { await api('/auth/logout', { method: 'POST' }); } catch { /* token μπορεί να έχει λήξει */ }
    localStorage.removeItem('worktrack_token');
    setUser(null);
  }, []);

  useEffect(() => {
    const restore = async () => {
      try { setUser(await api('/auth/me')); }
      catch { localStorage.removeItem('worktrack_token'); }
      finally { setLoading(false); }
    };
    if (localStorage.getItem('worktrack_token')) restore();
    const unauthorized = () => { localStorage.removeItem('worktrack_token'); setUser(null); };
    window.addEventListener('worktrack:unauthorized', unauthorized);
    return () => window.removeEventListener('worktrack:unauthorized', unauthorized);
  }, []);

  const login = async (email, password) => {
    const result = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    localStorage.setItem('worktrack_token', result.token);
    setUser(result.user);
    return result.user;
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

