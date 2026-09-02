/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

export class AuthController {
  constructor(service) { this.service = service; }
  login = async (req, res) => res.json(await this.service.login(req.body.email, req.body.password));
  me = async (req, res) => res.json(await this.service.getCurrentUser(req.user.id));
  logout = async (_req, res) => res.json({ message: 'Η αποσύνδεση ολοκληρώθηκε.' });
}

