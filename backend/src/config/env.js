/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import dotenv from 'dotenv';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 3001),
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || (isTest ? 'test-secret-that-is-long-enough-for-tests' : undefined),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX || 200)
};

export function validateEnv() {
  const missing = ['DATABASE_URL', 'JWT_SECRET'].filter((key) => !env[key]);
  if (missing.length) throw new Error(`Λείπουν μεταβλητές περιβάλλοντος: ${missing.join(', ')}`);
  if (env.JWT_SECRET.length < 32) throw new Error('Το JWT_SECRET πρέπει να έχει τουλάχιστον 32 χαρακτήρες.');
}

