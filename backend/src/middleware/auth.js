/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError.js';

export const createAuthenticate = (userRepository, jwtSecret) => async (req, _res, next) => {
  try {
    const [scheme, token] = (req.headers.authorization || '').split(' ');
    if (scheme !== 'Bearer' || !token) throw new AppError('Απαιτείται σύνδεση.', 401, 'UNAUTHORIZED');
    const payload = jwt.verify(token, jwtSecret);
    const user = await userRepository.findById(payload.sub);
    if (!user || !user.active) throw new AppError('Ο λογαριασμός δεν είναι ενεργός.', 401, 'UNAUTHORIZED');
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    return next(new AppError('Το token δεν είναι έγκυρο ή έχει λήξει.', 401, 'INVALID_TOKEN'));
  }
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) return next(new AppError('Δεν έχετε δικαίωμα για αυτή την ενέργεια.', 403, 'FORBIDDEN'));
  return next();
};

