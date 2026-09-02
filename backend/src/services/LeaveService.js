/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { AppError } from '../errors/AppError.js';
import { inclusiveDays, parseDateOnly } from '../utils/date.js';

export class LeaveService {
  constructor(leaveRepository, leaveTypeRepository) {
    this.leaves = leaveRepository;
    this.leaveTypes = leaveTypeRepository;
  }

  listMine(userId) { return this.leaves.listByEmployee(userId); }
  listTypes(activeOnly = true) { return this.leaveTypes.list({ activeOnly }); }

  async create(userId, input) {
    const startDate = parseDateOnly(input.startDate);
    const endDate = parseDateOnly(input.endDate);
    if (endDate < startDate) throw new AppError('Η ημερομηνία λήξης πρέπει να είναι μετά την έναρξη.', 400, 'INVALID_DATES');
    if (startDate < parseDateOnly(new Date().toISOString().slice(0, 10))) {
      throw new AppError('Δεν μπορεί να υποβληθεί άδεια για παρελθοντική ημερομηνία.', 400, 'PAST_DATE');
    }
    const leaveType = await this.leaveTypes.findById(input.leaveTypeId);
    if (!leaveType || !leaveType.active) throw new AppError('Ο τύπος άδειας δεν είναι διαθέσιμος.', 400, 'INVALID_LEAVE_TYPE');
    if (await this.leaves.hasOverlap(userId, startDate, endDate)) {
      throw new AppError('Υπάρχει ήδη αίτημα άδειας για αυτές τις ημερομηνίες.', 409, 'LEAVE_OVERLAP');
    }
    return this.leaves.create({
      employeeId: userId,
      leaveTypeId: input.leaveTypeId,
      startDate,
      endDate,
      totalDays: inclusiveDays(startDate, endDate),
      reason: input.reason || null
    });
  }

  async listForReviewer(user) {
    if (user.role === 'ADMIN') return this.leaves.listAll();
    if (!user.departmentId) throw new AppError('Δεν έχετε αντιστοιχιστεί σε τμήμα.', 403, 'NO_DEPARTMENT');
    return this.leaves.listForDepartment(user.departmentId);
  }

  async review(reviewer, requestId, { status, reviewComment }) {
    const request = await this.leaves.findById(requestId);
    if (!request) throw new AppError('Το αίτημα δεν βρέθηκε.', 404, 'NOT_FOUND');
    if (request.status !== 'PENDING') throw new AppError('Το αίτημα έχει ήδη αξιολογηθεί.', 409, 'ALREADY_REVIEWED');
    if (reviewer.role !== 'ADMIN' && request.employee.departmentId !== reviewer.departmentId) {
      throw new AppError('Δεν μπορείτε να αξιολογήσετε αίτημα άλλου τμήματος.', 403, 'FORBIDDEN');
    }
    if (request.employeeId === reviewer.id) {
      throw new AppError('Δεν μπορείτε να αξιολογήσετε δικό σας αίτημα.', 403, 'SELF_REVIEW');
    }
    return this.leaves.updateStatus(requestId, {
      status,
      reviewedById: reviewer.id,
      reviewedAt: new Date(),
      reviewComment: reviewComment || null
    });
  }
}

