/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { Department } from '../domain/Department.js';

const include = {
  manager: { select: { id: true, firstName: true, lastName: true, email: true } },
  _count: { select: { members: true } }
};
const map = (value) => (value ? new Department(value) : null);

export class DepartmentRepository {
  constructor(prisma) { this.prisma = prisma; }
  async list() { return (await this.prisma.department.findMany({ include, orderBy: { name: 'asc' } })).map(map); }
  async findById(id) { return map(await this.prisma.department.findUnique({ where: { id }, include })); }
  async create(data) { return map(await this.prisma.department.create({ data, include })); }
  async update(id, data) { return map(await this.prisma.department.update({ where: { id }, data, include })); }
  async remove(id) { return this.prisma.department.delete({ where: { id } }); }
  count() { return this.prisma.department.count(); }
}

