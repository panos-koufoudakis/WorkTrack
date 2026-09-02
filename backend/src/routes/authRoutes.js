/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../validation/schemas.js';

export const authRoutes = (controller, authenticate) => {
  const router = Router();
  router.post('/login', validate(loginSchema), asyncHandler(controller.login));
  router.post('/logout', authenticate, asyncHandler(controller.logout));
  router.get('/me', authenticate, asyncHandler(controller.me));
  return router;
};

