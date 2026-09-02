/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

export class DashboardService {
  constructor(userRepository, departmentRepository, leaveTypeRepository, leaveRepository, attendanceRepository) {
    this.users = userRepository;
    this.departments = departmentRepository;
    this.leaveTypes = leaveTypeRepository;
    this.leaves = leaveRepository;
    this.attendance = attendanceRepository;
  }

  async getSummary(user) {
    if (user.role === 'ADMIN') {
      const [activeUsers, departments, activeLeaveTypes, pendingLeaves] = await Promise.all([
        this.users.countActive(), this.departments.count(), this.leaveTypes.countActive(), this.leaves.countPending()
      ]);
      return { activeUsers, departments, activeLeaveTypes, pendingLeaves };
    }
    if (user.role === 'MANAGER') {
      const [pendingLeaves, openRecord] = await Promise.all([
        user.departmentId ? this.leaves.countPending({ employee: { departmentId: user.departmentId } }) : 0,
        this.attendance.findOpenByUser(user.id)
      ]);
      return { pendingLeaves, isCheckedIn: Boolean(openRecord) };
    }
    const [requests, openRecord] = await Promise.all([
      this.leaves.listByEmployee(user.id), this.attendance.findOpenByUser(user.id)
    ]);
    return {
      pendingLeaves: requests.filter((item) => item.status === 'PENDING').length,
      approvedLeaves: requests.filter((item) => item.status === 'APPROVED').length,
      isCheckedIn: Boolean(openRecord)
    };
  }
}
