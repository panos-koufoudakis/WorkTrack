/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { validateEnv, env } from './config/env.js';
import { prisma } from './config/prisma.js';
import { createContainer } from './container.js';
import { createApp } from './app.js';

validateEnv();
const container = createContainer();
const app = createApp({ ...container });
const server = app.listen(env.PORT, () => {
  console.log(`WorkTrack API: http://localhost:${env.PORT}`);
  console.log(`Swagger UI: http://localhost:${env.PORT}/api-docs`);
});

async function shutdown(signal) {
  console.log(`${signal}: τερματισμός...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

