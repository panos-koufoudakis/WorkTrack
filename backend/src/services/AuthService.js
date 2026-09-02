/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError.js';

export class AuthService {
  constructor(userRepository, { jwtSecret, expiresIn = '8h' }) {
    this.users = userRepository;
    this.jwtSecret = jwtSecret;
    this.expiresIn = expiresIn;
  }

  async login(email, password) {
    const user = await this.users.findByEmail(email);
    const valid = user && user.active && await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError('Λανθασμένο email ή κωδικός.', 401, 'INVALID_CREDENTIALS');
    const token = jwt.sign({ sub: user.id, role: user.role }, this.jwtSecret, { expiresIn: this.expiresIn });
    return { token, user: user.toPublic() };
  }

  async getCurrentUser(id) {
    const user = await this.users.findById(id);
    if (!user || !user.active) throw new AppError('Ο χρήστης δεν είναι διαθέσιμος.', 401, 'UNAUTHORIZED');
    return user.toPublic();
  }
}

