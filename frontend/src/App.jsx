/**
 * WorkTrack — Τελικό Project για το Coding Factory του ΚΕΔΙΒΙΜ του ΟΠΑ.
 * Δημιουργός: Παναγιώτης Κουφουδάκης <pkoufoudakis@outlook.com>.
 * Φοιτητής στο Τμήμα Ηλεκτρολόγων Μηχανικών & Τεχνολογίας Υπολογιστών του Πανεπιστημίου Πατρών.
 */

import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AttendancePage from './pages/AttendancePage.jsx';
import LeavesPage from './pages/LeavesPage.jsx';
import ApprovalsPage from './pages/ApprovalsPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

export default function App() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
      <Route index element={<DashboardPage />} />
      <Route path="attendance" element={<AttendancePage />} />
      <Route path="leaves" element={<LeavesPage />} />
      <Route path="approvals" element={<ProtectedRoute roles={['MANAGER', 'ADMIN']}><ApprovalsPage /></ProtectedRoute>} />
      <Route path="admin" element={<ProtectedRoute roles={['ADMIN']}><AdminPage /></ProtectedRoute>} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}

