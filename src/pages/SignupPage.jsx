import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { UserPlus, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { supabase } from '../supabase/supabaseClient'; // Supabase Import

const SignupPage = () => {
  const [cnic, setCnic] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Check if student is added by Admin in 'pre_registered_students'
      const { data: preRegistered, error: checkError } = await supabase
        .from('pre_registered_students')
        .select('*')
        .eq('cnic', cnic)
        .eq('rollNo', rollNo);

      if (checkError) throw checkError;

      if (preRegistered.length === 0) {
        Swal.fire({
          title: 'Signup Failed!',
          text: 'Record not found. Only students added by Admin can register.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
        });
        setLoading(false);
        return;
      }

      // 2. Check if account already exists in 'app_users'
      const { data: existingUser } = await supabase
        .from('app_users')
        .select('*')
        .eq('cnic', cnic);

      if (existingUser && existingUser.length > 0) {
        Swal.fire('Already Registered!', 'An account with this CNIC already exists.', 'warning');
        setLoading(false);
        return;
      }

      // 3. Insert student into 'app_users'
      const { error: insertError } = await supabase
        .from('app_users')
        .insert([
          { role: 'student', username: rollNo, cnic: cnic, password: password }
        ]);

      if (insertError) throw insertError;

      // Success
      Swal.fire({
        title: 'Account Created!',
        text: 'Your student account has been set up successfully.',
        icon: 'success',
        confirmButtonColor: 'hsl(160, 45%, 28%)',
      }).then(() => {
        navigate('/login');
      });

    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6 mt-16">
        <div className="w-full max-w-md glass p-8 rounded-3xl shadow-medium animate-slide-in">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-6 h-6 text-primary-foreground" />
            </div>
            <h2 className="heading-display text-3xl font-bold text-foreground mb-2">Create Account</h2>
            <p className="text-muted-foreground text-sm">Register as an enrolled SMIT student</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">CNIC Number</label>
              <input required type="text" value={cnic} onChange={(e) => setCnic(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none transition-all text-sm"
                placeholder="12345-1234567-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Roll Number</label>
              <input required type="text" value={rollNo} onChange={(e) => setRollNo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none transition-all text-sm"
                placeholder="1001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Create Password</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none transition-all text-sm"
                placeholder="••••••••" />
            </div>

            <button disabled={loading} type="submit" className="w-full py-3.5 mt-2 rounded-xl gradient-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-glow">
              {loading ? 'Registering...' : <>Register <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;