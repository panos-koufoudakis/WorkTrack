/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { describe, expect, it, vi } from 'vitest';
import { LeaveService } from '../src/services/LeaveService.js';

const activeType = { id: 'd934454c-7290-4f5e-99fc-6925e723ed75', active: true };

describe('LeaveService', () => {
  it('υπολογίζει συμπεριληπτικά τις ημέρες άδειας', async () => {
    const leaves = {
      hasOverlap: vi.fn().mockResolvedValue(false),
      create: vi.fn().mockImplementation((data) => data)
    };
    const types = { findById: vi.fn().mockResolvedValue(activeType) };
    const service = new LeaveService(leaves, types);

    const result = await service.create('employee-1', {
      leaveTypeId: activeType.id,
      startDate: '2099-04-10',
      endDate: '2099-04-12',
      reason: 'Ταξίδι'
    });

    expect(result.totalDays).toBe(3);
    expect(leaves.create).toHaveBeenCalledOnce();
  });

  it('απορρίπτει επικαλυπτόμενο αίτημα', async () => {
    const leaves = { hasOverlap: vi.fn().mockResolvedValue(true) };
    const types = { findById: vi.fn().mockResolvedValue(activeType) };
    const service = new LeaveService(leaves, types);

    await expect(service.create('employee-1', {
      leaveTypeId: activeType.id, startDate: '2099-04-10', endDate: '2099-04-11'
    })).rejects.toMatchObject({ statusCode: 409, code: 'LEAVE_OVERLAP' });
  });

  it('manager δεν αξιολογεί αίτημα άλλου τμήματος', async () => {
    const leaves = {
      findById: vi.fn().mockResolvedValue({
        id: 'leave-1', employeeId: 'employee-1', status: 'PENDING', employee: { departmentId: 'department-b' }
      })
    };
    const service = new LeaveService(leaves, {});

    await expect(service.review(
      { id: 'manager-1', role: 'MANAGER', departmentId: 'department-a' },
      'leave-1', { status: 'APPROVED' }
    )).rejects.toMatchObject({ statusCode: 403, code: 'FORBIDDEN' });
  });

  it('απαγορεύει την αυτο-έγκριση', async () => {
    const leaves = {
      findById: vi.fn().mockResolvedValue({
        id: 'leave-1', employeeId: 'manager-1', status: 'PENDING', employee: { departmentId: 'department-a' }
      })
    };
    const service = new LeaveService(leaves, {});

    await expect(service.review(
      { id: 'manager-1', role: 'MANAGER', departmentId: 'department-a' },
      'leave-1', { status: 'APPROVED' }
    )).rejects.toMatchObject({ statusCode: 403, code: 'SELF_REVIEW' });
  });
});

