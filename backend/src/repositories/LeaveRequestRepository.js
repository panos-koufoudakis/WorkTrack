/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { LeaveRequest } from '../domain/LeaveRequest.js';

const include = {
  leaveType: true,
  employee: { select: { id: true, firstName: true, lastName: true, email: true, departmentId: true } },
  reviewedBy: { select: { id: true, firstName: true, lastName: true } }
};
const map = (value) => (value ? new LeaveRequest(value) : null);

export class LeaveRequestRepository {
  constructor(prisma) { this.prisma = prisma; }
  async create(data) { return map(await this.prisma.leaveRequest.create({ data, include })); }
  async findById(id) { return map(await this.prisma.leaveRequest.findUnique({ where: { id }, include })); }
  async listByEmployee(employeeId) {
    return (await this.prisma.leaveRequest.findMany({ where: { employeeId }, include, orderBy: { createdAt: 'desc' } })).map(map);
  }
  async listForDepartment(departmentId) {
    return (await this.prisma.leaveRequest.findMany({
      where: { employee: { departmentId } }, include, orderBy: [{ status: 'asc' }, { createdAt: 'desc' }]
    })).map(map);
  }
  async listAll() {
    return (await this.prisma.leaveRequest.findMany({ include, orderBy: [{ status: 'asc' }, { createdAt: 'desc' }] })).map(map);
  }
  async hasOverlap(employeeId, startDate, endDate) {
    const count = await this.prisma.leaveRequest.count({
      where: {
        employeeId,
        status: { in: ['PENDING', 'APPROVED'] },
        startDate: { lte: endDate },
        endDate: { gte: startDate }
      }
    });
    return count > 0;
  }
  async updateStatus(id, data) {
    return map(await this.prisma.leaveRequest.update({ where: { id }, data, include }));
  }
  countPending(where = {}) {
    return this.prisma.leaveRequest.count({ where: { ...where, status: 'PENDING' } });
  }
}

