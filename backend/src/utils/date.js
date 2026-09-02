/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

export function parseDateOnly(value) {
  return new Date(`${value}T00:00:00.000Z`);
}

export function inclusiveDays(start, end) {
  return Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1;
}

