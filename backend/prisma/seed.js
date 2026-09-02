/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import bcrypt from 'bcryptjs';
import { PrismaClient, Role, LeaveStatus } from '@prisma/client';

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'Demo123!';

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const technology = await prisma.department.upsert({
    where: { code: 'TECH' },
    update: { name: 'Τεχνολογία' },
    create: { name: 'Τεχνολογία', code: 'TECH' }
  });
  const hr = await prisma.department.upsert({
    where: { code: 'HR' },
    update: { name: 'Ανθρώπινο Δυναμικό' },
    create: { name: 'Ανθρώπινο Δυναμικό', code: 'HR' }
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@worktrack.local' },
    update: { passwordHash, active: true },
    create: {
      email: 'admin@worktrack.local', passwordHash, firstName: 'Άννα', lastName: 'Διαχειρίστρια',
      role: Role.ADMIN, jobTitle: 'HR Administrator', departmentId: hr.id
    }
  });
  const manager = await prisma.user.upsert({
    where: { email: 'manager@worktrack.local' },
    update: { passwordHash, active: true, departmentId: technology.id },
    create: {
      email: 'manager@worktrack.local', passwordHash, firstName: 'Μάριος', lastName: 'Ομάδαρχης',
      role: Role.MANAGER, jobTitle: 'Engineering Manager', departmentId: technology.id
    }
  });
  const employee = await prisma.user.upsert({
    where: { email: 'employee@worktrack.local' },
    update: { passwordHash, active: true, departmentId: technology.id },
    create: {
      email: 'employee@worktrack.local', passwordHash, firstName: 'Ελένη', lastName: 'Παπαδοπούλου',
      role: Role.EMPLOYEE, jobTitle: 'Frontend Developer', departmentId: technology.id
    }
  });

  await prisma.department.update({ where: { id: technology.id }, data: { managerId: manager.id } });

  const annual = await prisma.leaveType.upsert({
    where: { name: 'Κανονική άδεια' },
    update: { active: true },
    create: { name: 'Κανονική άδεια', description: 'Προγραμματισμένη ετήσια άδεια' }
  });
  await prisma.leaveType.upsert({
    where: { name: 'Αναρρωτική άδεια' },
    update: { active: true },
    create: { name: 'Αναρρωτική άδεια', description: 'Άδεια για λόγους υγείας' }
  });

  const existingAttendance = await prisma.attendanceRecord.findFirst({ where: { userId: employee.id } });
  if (!existingAttendance) {
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() - 1);
    checkIn.setHours(9, 0, 0, 0);
    const checkOut = new Date(checkIn);
    checkOut.setHours(17, 0, 0, 0);
    await prisma.attendanceRecord.create({ data: { userId: employee.id, checkIn, checkOut } });
  }

  const existingLeave = await prisma.leaveRequest.findFirst({ where: { employeeId: employee.id } });
  if (!existingLeave) {
    const startDate = new Date();
    startDate.setUTCDate(startDate.getUTCDate() + 14);
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + 1);
    await prisma.leaveRequest.create({
      data: {
        employeeId: employee.id,
        leaveTypeId: annual.id,
        startDate,
        endDate,
        totalDays: 2,
        reason: 'Προγραμματισμένη προσωπική άδεια',
        status: LeaveStatus.PENDING
      }
    });
  }

  console.log('Seed ολοκληρώθηκε. Demo users:', admin.email, manager.email, employee.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

