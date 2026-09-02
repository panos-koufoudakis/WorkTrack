/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { AppError } from '../errors/AppError.js';

export function notFoundHandler(req, _res, next) {
  next(new AppError(`Η διαδρομή ${req.method} ${req.originalUrl} δεν βρέθηκε.`, 404, 'ROUTE_NOT_FOUND'));
}

export function errorHandler(error, _req, res, _next) {
  if (error?.code === 'P2002') {
    error = new AppError('Υπάρχει ήδη εγγραφή με αυτά τα στοιχεία.', 409, 'DUPLICATE');
  } else if (error?.code === 'P2025') {
    error = new AppError('Η εγγραφή δεν βρέθηκε.', 404, 'NOT_FOUND');
  }

  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const payload = {
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: statusCode === 500 ? 'Παρουσιάστηκε εσωτερικό σφάλμα.' : error.message
    }
  };
  if (error.details) payload.error.details = error.details;
  if (statusCode === 500 && process.env.NODE_ENV !== 'test') console.error(error);
  res.status(statusCode).json(payload);
}

