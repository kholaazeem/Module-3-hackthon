import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FileQuestion, ArrowLeft } from 'lucide-react';

// ==========================================
// Pages Import
// ==========================================
import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminCourses from './pages/admin/AdminCourses';
import AdminLeaves from './pages/admin/AdminLeaves';
import AdminAddAdmin from './pages/admin/AdminAddAdmin';
import AdminAnnouncements from './pages/admin/AdminAnnouncements'; // <-- Added

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses'; 
import StudentLeaves from './pages/student/StudentLeaves';   
import Announcements from './pages/student/Announcements';
import CoursesPage from './pages/CoursesPage';

// ==========================================
// 1. PUBLIC ROUTE (For Login/Signup)
// ==========================================
const PublicRoute = ({ children }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin' : '/student'} replace />;
  }
  
  return children;
};

// ==========================================
// 2. PROTECTED ROUTE (For Dashboards)
// ==========================================
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'admin' ? '/admin' : '/student'} replace />;
  }

  return children;
};

// ==========================================
// 3. MAIN APP ROUTER
// ==========================================
function App() {
  // Common 404 Component for Premium Look
  const NotFoundPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="max-w-md w-full text-center p-8 bg-card rounded-3xl border border-border shadow-lg animate-in fade-in zoom-in-95 duration-500">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
          <FileQuestion className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-foreground mb-2">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* === Public Routes === */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/courses" element={<PublicRoute><CoursesPage /></PublicRoute>} />

        {/* === Admin Routes === */}
        <Route 
          path="/admin" 
          element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/students" 
          element={<ProtectedRoute allowedRole="admin"><AdminStudents /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/courses" 
          element={<ProtectedRoute allowedRole="admin"><AdminCourses /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/leaves" 
          element={<ProtectedRoute allowedRole="admin"><AdminLeaves /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/add-admin" 
          element={<ProtectedRoute allowedRole="admin"><AdminAddAdmin /></ProtectedRoute>} 
        />
        {/* New Admin Route Registered Here */}
        <Route 
          path="/admin/announcements" 
          element={<ProtectedRoute allowedRole="admin"><AdminAnnouncements /></ProtectedRoute>} 
        />

        {/* === Student Routes === */}
        <Route 
          path="/student" 
          element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/student/courses" 
          element={<ProtectedRoute allowedRole="student"><StudentCourses /></ProtectedRoute>} 
        />
        <Route 
          path="/student/leave" 
          element={<ProtectedRoute allowedRole="student"><StudentLeaves /></ProtectedRoute>} 
        />
         <Route 
          path="/student/announcements" 
          element={<ProtectedRoute allowedRole="student"><Announcements /></ProtectedRoute>} 
        />

        {/* === Catch-All (404 Page Not Found) === */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;