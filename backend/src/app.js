/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { swaggerDocument } from './config/swagger.js';
import { createAuthenticate } from './middleware/auth.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { AuthController } from './controllers/AuthController.js';
import { AttendanceController } from './controllers/AttendanceController.js';
import { LeaveController } from './controllers/LeaveController.js';
import { AdminController } from './controllers/AdminController.js';
import { DashboardController } from './controllers/DashboardController.js';
import { authRoutes } from './routes/authRoutes.js';
import { attendanceRoutes } from './routes/attendanceRoutes.js';
import { leaveRoutes } from './routes/leaveRoutes.js';
import { adminRoutes } from './routes/adminRoutes.js';
import { dashboardRoutes } from './routes/dashboardRoutes.js';

export function createApp({ services, userRepository, jwtSecret = env.JWT_SECRET, enableLogging = env.NODE_ENV !== 'test' }) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: env.CLIENT_URL, methods: ['GET', 'POST', 'PATCH', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
  app.use(express.json({ limit: '32kb' }));
  if (enableLogging) app.use(morgan('dev'));

  app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'worktrack-api' }));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { customSiteTitle: 'WorkTrack API' }));
  app.get('/openapi.json', (_req, res) => res.json(swaggerDocument));

  const authenticate = createAuthenticate(userRepository, jwtSecret);
  const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: env.RATE_LIMIT_MAX, standardHeaders: 'draft-7', legacyHeaders: false });
  app.use('/api/auth', loginLimiter, authRoutes(new AuthController(services.auth), authenticate));
  app.use('/api/attendance', attendanceRoutes(new AttendanceController(services.attendance), authenticate));
  app.use('/api/leaves', leaveRoutes(new LeaveController(services.leave), authenticate));
  app.use('/api/admin', adminRoutes(new AdminController(services.admin), authenticate));
  app.use('/api/dashboard', dashboardRoutes(new DashboardController(services.dashboard), authenticate));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

