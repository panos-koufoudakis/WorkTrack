/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

export class AdminController {
  constructor(service) { this.service = service; }
  listUsers = async (_req, res) => res.json(await this.service.listUsers());
  createUser = async (req, res) => res.status(201).json(await this.service.createUser(req.body));
  updateUser = async (req, res) => res.json(await this.service.updateUser(req.params.id, req.body));
  listDepartments = async (_req, res) => res.json(await this.service.listDepartments());
  createDepartment = async (req, res) => res.status(201).json(await this.service.createDepartment(req.body));
  updateDepartment = async (req, res) => res.json(await this.service.updateDepartment(req.params.id, req.body));
  deleteDepartment = async (req, res) => { await this.service.deleteDepartment(req.params.id); res.status(204).end(); };
  listLeaveTypes = async (_req, res) => res.json(await this.service.listLeaveTypes());
  createLeaveType = async (req, res) => res.status(201).json(await this.service.createLeaveType(req.body));
  updateLeaveType = async (req, res) => res.json(await this.service.updateLeaveType(req.params.id, req.body));
}

