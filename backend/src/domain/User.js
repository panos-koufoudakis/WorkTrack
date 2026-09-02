/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

export class User {
  constructor(data) {
    Object.assign(this, data);
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  toPublic() {
    const { passwordHash, ...safe } = this;
    return { ...safe, fullName: this.fullName };
  }
}

