/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { attendanceNoteSchema, attendanceQuerySchema } from '../validation/schemas.js';

export const attendanceRoutes = (controller, authenticate) => {
  const router = Router();
  router.use(authenticate);
  router.get('/mine', validate(attendanceQuerySchema, 'query'), asyncHandler(controller.mine));
  router.post('/check-in', validate(attendanceNoteSchema), asyncHandler(controller.checkIn));
  router.post('/check-out', asyncHandler(controller.checkOut));
  return router;
};

