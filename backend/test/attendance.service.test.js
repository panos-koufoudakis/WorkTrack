/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { describe, expect, it, vi } from 'vitest';
import { AttendanceService } from '../src/services/AttendanceService.js';

describe('AttendanceService', () => {
  it('δημιουργεί check-in όταν δεν υπάρχει ενεργή παρουσία', async () => {
    const repository = {
      findOpenByUser: vi.fn().mockResolvedValue(null),
      checkIn: vi.fn().mockResolvedValue({ id: 'record-1', userId: 'user-1' })
    };
    const service = new AttendanceService(repository);

    await expect(service.checkIn('user-1', 'Γραφείο')).resolves.toMatchObject({ id: 'record-1' });
    expect(repository.checkIn).toHaveBeenCalledWith('user-1', 'Γραφείο');
  });

  it('απορρίπτει δεύτερο check-in', async () => {
    const repository = { findOpenByUser: vi.fn().mockResolvedValue({ id: 'open-1' }) };
    const service = new AttendanceService(repository);

    await expect(service.checkIn('user-1')).rejects.toMatchObject({ statusCode: 409, code: 'ALREADY_CHECKED_IN' });
  });

  it('κλείνει μόνο το ενεργό record του ίδιου χρήστη', async () => {
    const repository = {
      findOpenByUser: vi.fn().mockResolvedValue({ id: 'open-1', userId: 'user-1' }),
      checkOut: vi.fn().mockResolvedValue({ id: 'open-1', checkOut: new Date() })
    };
    const service = new AttendanceService(repository);

    await service.checkOut('user-1');
    expect(repository.checkOut).toHaveBeenCalledWith('open-1');
  });
});

