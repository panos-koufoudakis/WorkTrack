/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

export const formatDate = (value) => value ? new Intl.DateTimeFormat('el-GR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)) : '—';
export const formatTime = (value) => value ? new Intl.DateTimeFormat('el-GR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value)) : '—';
export const roleLabel = { EMPLOYEE: 'Εργαζόμενος', MANAGER: 'Manager', ADMIN: 'Διαχειριστής' };
export const statusLabel = { PENDING: 'Σε αναμονή', APPROVED: 'Εγκρίθηκε', REJECTED: 'Απορρίφθηκε' };

export function duration(checkIn, checkOut) {
  if (!checkOut) return 'Σε εξέλιξη';
  const minutes = Math.max(0, Math.floor((new Date(checkOut) - new Date(checkIn)) / 60000));
  return `${Math.floor(minutes / 60)}ω ${minutes % 60}λ`;
}

