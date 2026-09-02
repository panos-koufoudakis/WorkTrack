/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { User } from '../src/domain/User.js';

const secret = 'integration-test-secret-with-32-characters';
const employee = new User({
  id: '70c10b83-2e5a-421f-bc80-a674a120c342', email: 'employee@test.local', passwordHash: 'hidden',
  firstName: 'Ελένη', lastName: 'Δοκιμή', role: 'EMPLOYEE', active: true, departmentId: '60e418db-baa7-4fe7-b7a6-58efb41c9400'
});
const manager = new User({
  id: '11360f45-09aa-43b4-83c3-ac1ec042defb', email: 'manager@test.local', passwordHash: 'hidden',
  firstName: 'Μάριος', lastName: 'Δοκιμή', role: 'MANAGER', active: true, departmentId: employee.departmentId
});

function buildApp() {
  const services = {
    auth: { login: vi.fn(), getCurrentUser: vi.fn() },
    attendance: { getMine: vi.fn().mockResolvedValue({ records: [], isCheckedIn: false }) },
    leave: {
      listTypes: vi.fn().mockResolvedValue([]), listMine: vi.fn().mockResolvedValue([]),
      create: vi.fn(), listForReviewer: vi.fn().mockResolvedValue([]), review: vi.fn().mockResolvedValue({ id: 'reviewed' })
    },
    admin: { listUsers: vi.fn().mockResolvedValue([]) },
    dashboard: { getSummary: vi.fn().mockResolvedValue({ pendingLeaves: 0 }) }
  };
  const userRepository = {
    findById: vi.fn().mockImplementation(async (id) => [employee, manager].find((user) => user.id === id) || null)
  };
  return { app: createApp({ services, userRepository, jwtSecret: secret, enableLogging: false }), services };
}

const tokenFor = (user) => jwt.sign({ sub: user.id, role: user.role }, secret, { expiresIn: '1h' });

describe('WorkTrack HTTP API', () => {
  beforeEach(() => vi.clearAllMocks());

  it('εκθέτει health endpoint', async () => {
    const { app } = buildApp();
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', service: 'worktrack-api' });
  });

  it('επιστρέφει συνεπές validation error στο login', async () => {
    const { app } = buildApp();
    const response = await request(app).post('/api/auth/login').send({ email: 'bad', password: 'x' });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.details.length).toBeGreaterThan(0);
  });

  it('απορρίπτει request χωρίς JWT', async () => {
    const { app } = buildApp();
    const response = await request(app).get('/api/attendance/mine');
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('employee δεν αποκτά πρόσβαση στα admin endpoints', async () => {
    const { app } = buildApp();
    const response = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${tokenFor(employee)}`);
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('FORBIDDEN');
  });

  it('manager μπορεί να δει αιτήματα του τμήματος', async () => {
    const { app, services } = buildApp();
    const response = await request(app).get('/api/leaves/department').set('Authorization', `Bearer ${tokenFor(manager)}`);
    expect(response.status).toBe(200);
    expect(services.leave.listForReviewer).toHaveBeenCalledWith(expect.objectContaining({ id: manager.id, role: 'MANAGER' }));
  });

  it('δεν διαρρέει stack trace σε άγνωστη διαδρομή', async () => {
    const { app } = buildApp();
    const response = await request(app).get('/api/does-not-exist');
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('ROUTE_NOT_FOUND');
    expect(response.body.stack).toBeUndefined();
  });
});

