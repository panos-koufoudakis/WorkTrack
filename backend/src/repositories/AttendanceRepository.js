/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { AttendanceRecord } from '../domain/AttendanceRecord.js';

const map = (value) => (value ? new AttendanceRecord(value) : null);

export class AttendanceRepository {
  constructor(prisma) { this.prisma = prisma; }
  async findOpenByUser(userId) {
    return map(await this.prisma.attendanceRecord.findFirst({
      where: { userId, checkOut: null }, orderBy: { checkIn: 'desc' }
    }));
  }
  async checkIn(userId, notes) {
    return map(await this.prisma.attendanceRecord.create({ data: { userId, checkIn: new Date(), notes } }));
  }
  async checkOut(id) {
    return map(await this.prisma.attendanceRecord.update({ where: { id }, data: { checkOut: new Date() } }));
  }
  async listByUser(userId, { from, to, limit = 100 } = {}) {
    const checkIn = {};
    if (from) checkIn.gte = new Date(from);
    if (to) checkIn.lte = new Date(`${to}T23:59:59.999Z`);
    return (await this.prisma.attendanceRecord.findMany({
      where: { userId, ...(Object.keys(checkIn).length ? { checkIn } : {}) },
      orderBy: { checkIn: 'desc' }, take: limit
    })).map(map);
  }
  countToday(userId, startOfDay) {
    return this.prisma.attendanceRecord.count({ where: { userId, checkIn: { gte: startOfDay } } });
  }
}

