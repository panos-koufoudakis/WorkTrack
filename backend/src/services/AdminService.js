/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import bcrypt from 'bcryptjs';
import { AppError } from '../errors/AppError.js';

function translatePersistenceError(error) {
  if (error?.code === 'P2002') throw new AppError('Υπάρχει ήδη εγγραφή με αυτά τα στοιχεία.', 409, 'DUPLICATE');
  if (error?.code === 'P2003' || error?.code === 'P2014') throw new AppError('Η ενέργεια παραβιάζει συσχετισμένα δεδομένα.', 409, 'RELATION_CONFLICT');
  if (error?.code === 'P2025') throw new AppError('Η εγγραφή δεν βρέθηκε.', 404, 'NOT_FOUND');
  throw error;
}

export class AdminService {
  constructor(userRepository, departmentRepository, leaveTypeRepository) {
    this.users = userRepository;
    this.departments = departmentRepository;
    this.leaveTypes = leaveTypeRepository;
  }

  listUsers() { return this.users.list().then((items) => items.map((item) => item.toPublic())); }
  listDepartments() { return this.departments.list(); }
  listLeaveTypes() { return this.leaveTypes.list(); }

  async createUser(input) {
    try {
      const passwordHash = await bcrypt.hash(input.password, 12);
      const { password, ...data } = input;
      return (await this.users.create({ ...data, passwordHash })).toPublic();
    } catch (error) { return translatePersistenceError(error); }
  }

  async updateUser(id, input) {
    try {
      const data = { ...input };
      if (data.password) data.passwordHash = await bcrypt.hash(data.password, 12);
      delete data.password;
      return (await this.users.update(id, data)).toPublic();
    } catch (error) { return translatePersistenceError(error); }
  }

  async createDepartment(input) {
    try { return await this.departments.create(input); } catch (error) { return translatePersistenceError(error); }
  }
  async updateDepartment(id, input) {
    try { return await this.departments.update(id, input); } catch (error) { return translatePersistenceError(error); }
  }
  async deleteDepartment(id) {
    const department = await this.departments.findById(id);
    if (!department) throw new AppError('Το τμήμα δεν βρέθηκε.', 404, 'NOT_FOUND');
    if (department._count.members > 0) throw new AppError('Μετακινήστε πρώτα τους εργαζομένους του τμήματος.', 409, 'DEPARTMENT_NOT_EMPTY');
    try { await this.departments.remove(id); } catch (error) { return translatePersistenceError(error); }
  }

  async createLeaveType(input) {
    try { return await this.leaveTypes.create(input); } catch (error) { return translatePersistenceError(error); }
  }
  async updateLeaveType(id, input) {
    try { return await this.leaveTypes.update(id, input); } catch (error) { return translatePersistenceError(error); }
  }
}

