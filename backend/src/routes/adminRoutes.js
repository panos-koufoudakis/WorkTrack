/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createUserSchema, updateUserSchema, departmentSchema, updateDepartmentSchema,
  leaveTypeSchema, updateLeaveTypeSchema, idParamSchema
} from '../validation/schemas.js';

export const adminRoutes = (controller, authenticate) => {
  const router = Router();
  router.use(authenticate, authorize('ADMIN'));
  router.get('/users', asyncHandler(controller.listUsers));
  router.post('/users', validate(createUserSchema), asyncHandler(controller.createUser));
  router.patch('/users/:id', validate(idParamSchema, 'params'), validate(updateUserSchema), asyncHandler(controller.updateUser));
  router.get('/departments', asyncHandler(controller.listDepartments));
  router.post('/departments', validate(departmentSchema), asyncHandler(controller.createDepartment));
  router.patch('/departments/:id', validate(idParamSchema, 'params'), validate(updateDepartmentSchema), asyncHandler(controller.updateDepartment));
  router.delete('/departments/:id', validate(idParamSchema, 'params'), asyncHandler(controller.deleteDepartment));
  router.get('/leave-types', asyncHandler(controller.listLeaveTypes));
  router.post('/leave-types', validate(leaveTypeSchema), asyncHandler(controller.createLeaveType));
  router.patch('/leave-types/:id', validate(idParamSchema, 'params'), validate(updateLeaveTypeSchema), asyncHandler(controller.updateLeaveType));
  return router;
};

