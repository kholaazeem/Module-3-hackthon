import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';
import Swal from 'sweetalert2';
import { Shield, GraduationCap, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { supabase } from '../supabase/supabaseClient';

const LoginPage = () => {
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Attempting Login for:", { role, username, password });

    try {
      // Supabase search query
      const { data: userRecord, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('role', role)
        .eq('username', username)
        .eq('password', password)
        .maybeSingle(); // Single record dhoondein

      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }

      console.log("Database response:", userRecord);

      if (!userRecord) {
        Swal.fire({
          title: 'Invalid Credentials!',
          text: 'Check if you selected the right Role and entered correct ID/Password.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
        });
        setLoading(false);
        return;
      }

      // Success logic (Yahan ID add ki gayi hai taake Student Panel mein error na aaye)
      dispatch(loginSuccess({ 
        user: { 
          id: userRecord.id, // <-- YE LINE ADD KI HAI
          name: userRecord.username, 
          cnic: userRecord.cnic, 
          username: userRecord.username 
        }, 
        role: userRecord.role 
      }));
      
      Swal.fire({
        title: 'Login Successful!',
        text: `Welcome, ${userRecord.username}!`,
        icon: 'success',
        confirmButtonColor: 'hsl(160, 45%, 28%)',
      }).then(() => {
        navigate(`/${role}`); 
      });

    } catch (err) {
      console.error("Full Error Object:", err);
      Swal.fire('System Error', 'Could not connect to database. Check your internet or Supabase Keys.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6 mt-16">
        <div className="w-full max-w-md glass p-8 rounded-3xl shadow-medium animate-scale-in">
          <div className="text-center mb-8">
            <h2 className="heading-display text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
            <p className="text-muted-foreground text-sm">Sign in to SMIT Connect Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="flex gap-4 p-1 bg-muted rounded-xl">
              <button type="button" onClick={() => setRole('student')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${role === 'student' ? 'bg-background shadow-soft text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                <GraduationCap className="w-4 h-4" /> Student
              </button>
              <button type="button" onClick={() => setRole('admin')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${role === 'admin' ? 'bg-background shadow-soft text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                <Shield className="w-4 h-4" /> Admin
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {role === 'admin' ? 'Admin Username' : 'Roll Number'}
                </label>
                <input required type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none text-sm"
                  placeholder={role === 'admin' ? "e.g. admin" : "e.g. 1001"} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none text-sm"
                  placeholder="Enter Password" />
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full py-3.5 rounded-xl gradient-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-glow">
              {loading ? 'Verifying...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {role === 'student' && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              New here? <Link to="/signup" className="text-primary font-medium hover:underline">Create an account</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;