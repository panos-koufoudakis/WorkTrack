/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { prisma } from './config/prisma.js';
import { env } from './config/env.js';
import { UserRepository } from './repositories/UserRepository.js';
import { DepartmentRepository } from './repositories/DepartmentRepository.js';
import { AttendanceRepository } from './repositories/AttendanceRepository.js';
import { LeaveTypeRepository } from './repositories/LeaveTypeRepository.js';
import { LeaveRequestRepository } from './repositories/LeaveRequestRepository.js';
import { AuthService } from './services/AuthService.js';
import { AttendanceService } from './services/AttendanceService.js';
import { LeaveService } from './services/LeaveService.js';
import { AdminService } from './services/AdminService.js';
import { DashboardService } from './services/DashboardService.js';

export function createContainer(database = prisma) {
  const userRepository = new UserRepository(database);
  const departmentRepository = new DepartmentRepository(database);
  const attendanceRepository = new AttendanceRepository(database);
  const leaveTypeRepository = new LeaveTypeRepository(database);
  const leaveRepository = new LeaveRequestRepository(database);
  return {
    userRepository,
    services: {
      auth: new AuthService(userRepository, { jwtSecret: env.JWT_SECRET, expiresIn: env.JWT_EXPIRES_IN }),
      attendance: new AttendanceService(attendanceRepository),
      leave: new LeaveService(leaveRepository, leaveTypeRepository),
      admin: new AdminService(userRepository, departmentRepository, leaveTypeRepository),
      dashboard: new DashboardService(userRepository, departmentRepository, leaveTypeRepository, leaveRepository, attendanceRepository)
    }
  };
}

