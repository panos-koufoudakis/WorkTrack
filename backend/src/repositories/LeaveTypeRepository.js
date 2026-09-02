/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { LeaveType } from '../domain/LeaveType.js';

const map = (value) => (value ? new LeaveType(value) : null);

export class LeaveTypeRepository {
  constructor(prisma) { this.prisma = prisma; }
  async list({ activeOnly = false } = {}) {
    return (await this.prisma.leaveType.findMany({
      where: activeOnly ? { active: true } : {}, orderBy: { name: 'asc' }
    })).map(map);
  }
  async findById(id) { return map(await this.prisma.leaveType.findUnique({ where: { id } })); }
  async create(data) { return map(await this.prisma.leaveType.create({ data })); }
  async update(id, data) { return map(await this.prisma.leaveType.update({ where: { id }, data })); }
  async remove(id) { return this.prisma.leaveType.delete({ where: { id } }); }
  countActive() { return this.prisma.leaveType.count({ where: { active: true } }); }
}

