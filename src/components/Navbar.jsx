import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, GraduationCap, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Redux se state aur dispatch le rahe hain
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/student');

  if (isDashboard) return null; // Dashboard mein apna sidebar/navbar hoga

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Courses', to: '/courses' },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl rounded-2xl transition-all duration-500 ${
      scrolled ? 'glass-solid shadow-medium' : 'glass'
    }`}>
      <div className="flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">SMIT <span className="text-gradient">Connect</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-primary/10 ${
              location.pathname === l.to ? 'bg-primary/10 text-primary' : 'text-foreground/70'
            }`}>{l.label}</Link>
          ))}
          
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-medium text-foreground/70 hover:bg-primary/10 transition-colors">Login</Link>
              <Link to="/signup" className="px-4 py-2 rounded-xl text-sm font-medium text-foreground/70 hover:bg-primary/10 transition-colors">Signup</Link>
            </>
          ) : (
            <>
              <Link to={role === 'admin' ? '/admin' : '/student'}
                className="ml-2 px-4 py-2 rounded-xl text-sm font-medium gradient-primary text-primary-foreground transition-all duration-300 hover:opacity-90">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="ml-2 p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-xl hover:bg-muted transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border px-6 py-4 space-y-1 animate-fade-in bg-background rounded-b-2xl">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/10 transition-colors">{l.label}</Link>
          ))}
          
          {!isAuthenticated ? (
            <>
               <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/10 transition-colors">Login</Link>
               <Link to="/signup" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/10 transition-colors">Signup</Link>
            </>
          ) : (
            <>
              <Link to={role === 'admin' ? '/admin' : '/student'} onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium gradient-primary text-primary-foreground">Dashboard</Link>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 mt-2">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;