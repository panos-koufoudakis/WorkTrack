/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

export class AttendanceController {
  constructor(service) { this.service = service; }
  checkIn = async (req, res) => res.status(201).json(await this.service.checkIn(req.user.id, req.body.notes));
  checkOut = async (req, res) => res.json(await this.service.checkOut(req.user.id));
  mine = async (req, res) => res.json(await this.service.getMine(req.user.id, req.query));
}

