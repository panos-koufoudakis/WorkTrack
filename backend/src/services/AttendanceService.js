/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { AppError } from '../errors/AppError.js';

export class AttendanceService {
  constructor(attendanceRepository) { this.attendance = attendanceRepository; }

  async checkIn(userId, notes) {
    if (await this.attendance.findOpenByUser(userId)) {
      throw new AppError('Υπάρχει ήδη ενεργό check-in.', 409, 'ALREADY_CHECKED_IN');
    }
    return this.attendance.checkIn(userId, notes || null);
  }

  async checkOut(userId) {
    const open = await this.attendance.findOpenByUser(userId);
    if (!open) throw new AppError('Δεν υπάρχει ενεργό check-in.', 409, 'NOT_CHECKED_IN');
    return this.attendance.checkOut(open.id);
  }

  async getMine(userId, filters) {
    const records = await this.attendance.listByUser(userId, filters);
    const openRecord = records.find((record) => !record.checkOut) || await this.attendance.findOpenByUser(userId);
    return { records, isCheckedIn: Boolean(openRecord), openRecord: openRecord || null };
  }
}

