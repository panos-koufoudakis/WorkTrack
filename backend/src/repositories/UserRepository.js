/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { User } from '../domain/User.js';

const include = { department: { select: { id: true, name: true, code: true } } };
const map = (value) => (value ? new User(value) : null);

export class UserRepository {
  constructor(prisma) { this.prisma = prisma; }

  async findByEmail(email) {
    return map(await this.prisma.user.findUnique({ where: { email: email.toLowerCase() }, include }));
  }

  async findById(id) {
    return map(await this.prisma.user.findUnique({ where: { id }, include }));
  }

  async list() {
    return (await this.prisma.user.findMany({ include, orderBy: [{ active: 'desc' }, { lastName: 'asc' }] })).map(map);
  }

  async create(data) {
    return map(await this.prisma.user.create({ data: { ...data, email: data.email.toLowerCase() }, include }));
  }

  async update(id, data) {
    const normalized = data.email ? { ...data, email: data.email.toLowerCase() } : data;
    return map(await this.prisma.user.update({ where: { id }, data: normalized, include }));
  }

  countActive() { return this.prisma.user.count({ where: { active: true } }); }
}

