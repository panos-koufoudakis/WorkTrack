/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;
  return <div className={`toast ${type}`} role="status"><span>{message}</span><button onClick={onClose} aria-label="Κλείσιμο">×</button></div>;
}

