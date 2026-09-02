/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

const errorSchema = {
  type: 'object',
  properties: {
    error: {
      type: 'object',
      properties: { code: { type: 'string' }, message: { type: 'string' }, details: { type: 'array', items: { type: 'object' } } }
    }
  }
};

export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'WorkTrack API',
    version: '1.0.0',
    description: 'REST API για παρουσίες, άδειες, τμήματα και εργαζομένους.'
  },
  servers: [{ url: 'http://localhost:3001/api', description: 'Local development' }],
  tags: [
    { name: 'Authentication' }, { name: 'Attendance' }, { name: 'Leaves' },
    { name: 'Dashboard' }, { name: 'Administration' }
  ],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      Error: errorSchema,
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }, email: { type: 'string', format: 'email' },
          firstName: { type: 'string' }, lastName: { type: 'string' },
          role: { type: 'string', enum: ['EMPLOYEE', 'MANAGER', 'ADMIN'] }, active: { type: 'boolean' }
        }
      },
      AttendanceRecord: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }, checkIn: { type: 'string', format: 'date-time' },
          checkOut: { type: 'string', format: 'date-time', nullable: true }, notes: { type: 'string', nullable: true }
        }
      },
      LeaveRequest: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }, startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' }, totalDays: { type: 'integer' },
          status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] }
        }
      }
    }
  },
  paths: {
    '/auth/login': {
      post: {
        tags: ['Authentication'], summary: 'Σύνδεση χρήστη',
        requestBody: { required: true, content: { 'application/json': { schema: {
          type: 'object', required: ['email', 'password'], properties: { email: { type: 'string' }, password: { type: 'string', format: 'password' } }
        } } } },
        responses: { 200: { description: 'JWT και χρήστης' }, 401: { description: 'Λάθος στοιχεία', content: { 'application/json': { schema: errorSchema } } } }
      }
    },
    '/auth/me': { get: { tags: ['Authentication'], summary: 'Τρέχων χρήστης', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Στοιχεία χρήστη' } } } },
    '/auth/logout': { post: { tags: ['Authentication'], summary: 'Αποσύνδεση', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Επιτυχία' } } } },
    '/attendance/mine': { get: { tags: ['Attendance'], summary: 'Προσωπικό ιστορικό', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Λίστα παρουσιών' } } } },
    '/attendance/check-in': { post: { tags: ['Attendance'], summary: 'Έναρξη παρουσίας', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Check-in' }, 409: { description: 'Ήδη ενεργό' } } } },
    '/attendance/check-out': { post: { tags: ['Attendance'], summary: 'Λήξη παρουσίας', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Check-out' }, 409: { description: 'Δεν υπάρχει ενεργό' } } } },
    '/leaves/types': { get: { tags: ['Leaves'], summary: 'Ενεργοί τύποι αδειών', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Λίστα' } } } },
    '/leaves/mine': { get: { tags: ['Leaves'], summary: 'Προσωπικά αιτήματα', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Λίστα' } } } },
    '/leaves': {
      post: {
        tags: ['Leaves'], summary: 'Νέο αίτημα άδειας', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: {
          type: 'object', required: ['leaveTypeId', 'startDate', 'endDate'],
          properties: { leaveTypeId: { type: 'string', format: 'uuid' }, startDate: { type: 'string', format: 'date' }, endDate: { type: 'string', format: 'date' }, reason: { type: 'string' } }
        } } } }, responses: { 201: { description: 'Δημιουργήθηκε' } }
      }
    },
    '/leaves/department': { get: { tags: ['Leaves'], summary: 'Αιτήματα τμήματος (Manager/Admin)', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Λίστα' }, 403: { description: 'Απαγορεύεται' } } } },
    '/leaves/{id}/status': {
      patch: {
        tags: ['Leaves'], summary: 'Έγκριση/απόρριψη (Manager/Admin)', security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['APPROVED', 'REJECTED'] }, reviewComment: { type: 'string' } } } } } },
        responses: { 200: { description: 'Αξιολογήθηκε' }, 403: { description: 'Απαγορεύεται' } }
      }
    },
    '/dashboard/summary': { get: { tags: ['Dashboard'], summary: 'Σύνοψη ανά ρόλο', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Μετρικές' } } } },
    '/admin/users': {
      get: { tags: ['Administration'], summary: 'Εργαζόμενοι (Admin)', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Λίστα' } } },
      post: { tags: ['Administration'], summary: 'Νέος εργαζόμενος (Admin)', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Δημιουργήθηκε' } } }
    },
    '/admin/users/{id}': { patch: { tags: ['Administration'], summary: 'Ενημέρωση εργαζομένου (Admin)', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }], responses: { 200: { description: 'Ενημερώθηκε' } } } },
    '/admin/departments': {
      get: { tags: ['Administration'], summary: 'Τμήματα (Admin)', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Λίστα' } } },
      post: { tags: ['Administration'], summary: 'Νέο τμήμα (Admin)', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Δημιουργήθηκε' } } }
    },
    '/admin/leave-types': {
      get: { tags: ['Administration'], summary: 'Τύποι αδειών (Admin)', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Λίστα' } } },
      post: { tags: ['Administration'], summary: 'Νέος τύπος άδειας (Admin)', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Δημιουργήθηκε' } } }
    }
  }
};

