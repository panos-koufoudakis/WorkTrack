/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { idParamSchema, leaveRequestSchema, reviewLeaveSchema } from '../validation/schemas.js';

export const leaveRoutes = (controller, authenticate) => {
  const router = Router();
  router.use(authenticate);
  router.get('/types', asyncHandler(controller.types));
  router.get('/mine', asyncHandler(controller.mine));
  router.post('/', validate(leaveRequestSchema), asyncHandler(controller.create));
  router.get('/department', authorize('MANAGER', 'ADMIN'), asyncHandler(controller.department));
  router.patch('/:id/status', authorize('MANAGER', 'ADMIN'), validate(idParamSchema, 'params'), validate(reviewLeaveSchema), asyncHandler(controller.review));
  return router;
};

