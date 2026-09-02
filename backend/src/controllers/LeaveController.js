/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

export class LeaveController {
  constructor(service) { this.service = service; }
  types = async (_req, res) => res.json(await this.service.listTypes(true));
  mine = async (req, res) => res.json(await this.service.listMine(req.user.id));
  create = async (req, res) => res.status(201).json(await this.service.create(req.user.id, req.body));
  department = async (req, res) => res.json(await this.service.listForReviewer(req.user));
  review = async (req, res) => res.json(await this.service.review(req.user, req.params.id, req.body));
}

