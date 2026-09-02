/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { z } from 'zod';

const uuid = z.string().uuid('Μη έγκυρο αναγνωριστικό.');
const optionalUuid = z.union([uuid, z.literal(''), z.null()]).transform((value) => value || null).optional();

export const loginSchema = z.object({
  email: z.string().email('Μη έγκυρο email.'),
  password: z.string().min(8, 'Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες.')
});

export const attendanceNoteSchema = z.object({
  notes: z.string().trim().max(300).optional()
});

export const attendanceQuerySchema = z.object({
  from: z.string().date().optional(),
  to: z.string().date().optional()
});

export const leaveRequestSchema = z.object({
  leaveTypeId: uuid,
  startDate: z.string().date('Μη έγκυρη ημερομηνία έναρξης.'),
  endDate: z.string().date('Μη έγκυρη ημερομηνία λήξης.'),
  reason: z.string().trim().max(500).optional()
});

export const reviewLeaveSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  reviewComment: z.string().trim().max(500).optional()
});

export const idParamSchema = z.object({ id: uuid });

const userFields = {
  email: z.string().email(),
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(2).max(80),
  jobTitle: z.string().trim().max(120).nullable().optional(),
  role: z.enum(['EMPLOYEE', 'MANAGER', 'ADMIN']),
  departmentId: optionalUuid,
  active: z.boolean().optional()
};

export const createUserSchema = z.object({
  ...userFields,
  password: z.string().min(8).max(128)
});

export const updateUserSchema = z.object({
  ...Object.fromEntries(Object.entries(userFields).map(([key, value]) => [key, value.optional()])),
  password: z.string().min(8).max(128).optional()
}).refine((value) => Object.keys(value).length > 0, 'Δεν δόθηκαν αλλαγές.');

export const departmentSchema = z.object({
  name: z.string().trim().min(2).max(100),
  code: z.string().trim().min(2).max(12).transform((value) => value.toUpperCase()),
  managerId: optionalUuid
});

export const updateDepartmentSchema = departmentSchema.partial();

export const leaveTypeSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(300).nullable().optional(),
  active: z.boolean().optional()
});

export const updateLeaveTypeSchema = leaveTypeSchema.partial();

