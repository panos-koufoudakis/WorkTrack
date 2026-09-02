/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

export default function EmptyState({ title = 'Δεν υπάρχουν δεδομένα', text = 'Οι νέες εγγραφές θα εμφανιστούν εδώ.' }) {
  return <div className="empty-state"><div className="empty-mark">○</div><strong>{title}</strong><p>{text}</p></div>;
}

