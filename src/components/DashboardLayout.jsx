import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { 
  LayoutDashboard, Users, BookOpen, CalendarDays, UserPlus, 
  LogOut, Menu, X, GraduationCap, Home, ChevronLeft, ChevronRight, FileText
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const { role, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = role === 'admin';

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  // Admin Links (Updated per your TS code)
  const adminLinks = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Students', path: '/admin/students', icon: Users },
    { label: 'Courses', path: '/admin/courses', icon: BookOpen },
    { label: 'Leave Requests', path: '/admin/leaves', icon: CalendarDays },
    { label: 'Add Admin', path: '/admin/add-admin', icon: UserPlus },
  ];

  // Student Links (Updated per your TS code)
  const studentLinks = [
    { label: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { label: 'Course Portal', path: '/student/courses', icon: BookOpen },
    { label: 'Announcements', path: '/student/announcements', icon: FileText },
    { label: 'Leave ', path: '/student/leave', icon: CalendarDays },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    /* Root container set to 100vh and full width to prevent layout collapsing */
    <div className="flex h-screen w-full bg-background overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      {/* Sidebar (Dark Gradient) */}
      <aside 
        className={`fixed lg:static top-0 left-0 z-50 h-full gradient-dark flex flex-col transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? 'w-16' : 'w-64'} 
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo Section */}
        <div className="h-16 p-4 border-b border-white/10 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0 shadow-glow">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          {!collapsed && <span className="font-bold text-sm text-white truncate tracking-wide">SMIT Connect</span>}
          
          {/* Mobile Close Button */}
          <button className="lg:hidden ml-auto text-white/60 hover:text-white" onClick={() => setMobileOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {links.map((l) => {
            const active = location.pathname === l.path;
            return (
              <Link 
                key={l.path} 
                to={l.path} 
                onClick={() => setMobileOpen(false)}
                title={collapsed ? l.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active 
                    ? 'bg-primary text-white shadow-soft' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <l.icon className={`w-5 h-5 shrink-0 ${active ? 'text-white' : ''}`} />
                {!collapsed && <span>{l.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions Area */}
        <div className="p-3 space-y-1 border-t border-white/10 shrink-0">
          <Link 
            to="/" 
            title={collapsed ? "Home" : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Home className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Home</span>}
          </Link>
          
          <button 
            onClick={handleLogout} 
            title={collapsed ? "Logout" : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
          
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="hidden w-full lg:flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-5 h-5 shrink-0" /> : <ChevronLeft className="w-5 h-5 shrink-0" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 rounded-lg bg-muted text-foreground hover:bg-primary/10 transition-colors" 
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-semibold text-foreground text-sm sm:text-base tracking-wide">
              {isAdmin ? '🛡️ Admin Dashboard' : '🎓 Student Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-sm text-muted-foreground hidden sm:block">
                Hi, <span className="font-medium text-foreground">{user?.name || 'User'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-background">
          <div className="max-w-6xl mx-auto animate-fade-in w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;