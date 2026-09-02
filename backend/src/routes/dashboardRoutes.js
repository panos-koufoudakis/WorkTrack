/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

export const dashboardRoutes = (controller, authenticate) => {
  const router = Router();
  router.get('/summary', authenticate, asyncHandler(controller.summary));
  return router;
};

