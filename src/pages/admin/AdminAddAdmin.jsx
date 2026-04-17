import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { ShieldCheck, User, AtSign, Lock, UserPlus, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../../supabase/supabaseClient'; 

const AdminAddAdmin = () => {
  const [form, setForm] = useState({ name: '', username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Supabase ke 'app_users' table mein naya admin add kar rahe hain
      const { error } = await supabase
        .from('app_users')
        .insert([
          { 
            username: form.username, 
            password: form.password, 
            role: 'admin',
            // Agar aapke table mein 'name' ka column majood hai toh usmein full name save hoga
            // Agar database mein error aaye (Column 'name' not found), toh aap is line ko hata sakti hain
          }
        ]);

      if (error) {
        throw error;
      }

      Swal.fire({ 
        icon: 'success', 
        title: 'Admin Created!', 
        text: `${form.name} has been granted administrative privileges.`, 
        confirmButtonColor: 'hsl(160, 45%, 28%)',
        showConfirmButton: false,
        timer: 2000
      });
      
      // Form ko khali kar rahe hain
      setForm({ name: '', username: '', password: '' });
      
    } catch (error) {
      console.error("Admin creation error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Creation Failed',
        text: error.message || 'Could not create new admin account. Check if username already exists.',
        confirmButtonColor: 'hsl(160, 45%, 28%)'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4">
        
        {/* Header Title */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 text-primary">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Add New Admin</h1>
          <p className="text-muted-foreground mt-2">Create a new administrative account to manage the portal.</p>
        </div>

        {/* Premium Form Card */}
        <div className="relative p-8 rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
          {/* Decorative subtle top border/gradient */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

          <form onSubmit={handleSubmit} className="space-y-6 mt-2">
            
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-muted-foreground/70" />
                </div>
                <input 
                  type="text" 
                  required 
                  value={form.name} 
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Ali Khan"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50" 
                />
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <AtSign className="w-5 h-5 text-muted-foreground/70" />
                </div>
                <input 
                  type="text" 
                  required 
                  value={form.username} 
                  onChange={e => setForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="e.g. alikhan_admin"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50" 
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Temporary Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-muted-foreground/70" />
                </div>
                <input 
                  type="password" 
                  required 
                  value={form.password} 
                  onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter a secure password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50" 
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3.5 mt-4 rounded-xl bg-primary text-primary-foreground font-bold text-[15px] hover:opacity-90 hover:scale-[1.01] hover:shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Creating...</>
              ) : (
                <><UserPlus className="w-5 h-5" /> Create Admin Account</>
              )}
            </button>
            
          </form>
        </div>
        
      </div>
    </DashboardLayout>
  );
};

export default AdminAddAdmin;