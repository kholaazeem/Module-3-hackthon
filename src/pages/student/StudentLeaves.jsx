import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyForLeave, fetchMyLeaves } from '../../redux/slices/leaveSlice';
import DashboardLayout from '../../components/DashboardLayout';
import { CalendarDays, Upload, Send, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

const StudentLeaves = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ reason: '', startDate: '', endDate: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { items: leaves, status } = useSelector((state) => state.leaves);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchMyLeaves(user.id));
    }
  }, [dispatch, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.id) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'User ID is missing. Please log in again.',
        confirmButtonColor: 'hsl(160, 45%, 28%)'
      });
      return;
    }

    setIsSubmitting(true);
    
    // Payload matching your exact Supabase table schema
    const leaveData = {
      student_id: user.id,
      student_name: user.name || user.username || 'Student',
      reason: form.reason,
      start_date: form.startDate,
      end_date: form.endDate,
      status: 'Pending'
      // 'created_at' is handled automatically by Supabase
    };

    try {
      await dispatch(applyForLeave(leaveData)).unwrap();
      
      setForm({ reason: '', startDate: '', endDate: '' });
      
      Swal.fire({ 
        icon: 'success', 
        title: 'Application Sent!', 
        text: 'Your leave request has been submitted to the administration.', 
        confirmButtonColor: 'hsl(160, 45%, 28%)' 
      });
    } catch (error) {
      Swal.fire({ 
        icon: 'error', 
        title: 'Submission Failed', 
        text: error.message || 'Could not send the leave request.', 
        confirmButtonColor: 'hsl(160, 45%, 28%)' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
        
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
            <CalendarDays className="w-8 h-8 text-primary" /> Leave Application
          </h1>
          <p className="text-muted-foreground">Submit a new leave request or track your previous applications.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Apply Leave Form */}
          <div className="p-8 rounded-2xl bg-card border border-border shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6">New Request</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Reason for Leave</label>
                <textarea 
                  value={form.reason} 
                  onChange={e => setForm({ ...form, reason: e.target.value })} 
                  required 
                  rows={3}
                  placeholder="Explain why you need leave..."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">From Date</label>
                  <input 
                    type="date" 
                    value={form.startDate} 
                    onChange={e => setForm({ ...form, startDate: e.target.value })} 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-text" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">To Date</label>
                  <input 
                    type="date" 
                    value={form.endDate} 
                    onChange={e => setForm({ ...form, endDate: e.target.value })} 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-text" 
                  />
                </div>
              </div>

              {/* Fake Upload Box for UI */}
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors group">
                <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary mx-auto mb-2 transition-colors" />
                <p className="text-sm font-medium text-foreground">Attach document (Optional)</p>
                <p className="text-xs text-muted-foreground mt-1">Medical certificate etc. (PDF, JPG)</p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3.5 mt-2 rounded-xl bg-primary text-primary-foreground font-bold text-[15px] hover:opacity-90 hover:scale-[1.01] transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                ) : (
                  <><Send className="w-5 h-5" /> Submit Application</>
                )}
              </button>
            </form>
          </div>

          {/* Leave History List */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-6 lg:mt-0 mt-4">Application History</h2>
            
            {status === 'loading' ? (
              <div className="p-10 text-center rounded-2xl bg-card border border-border flex flex-col items-center justify-center">
                 <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                 <p className="text-muted-foreground font-medium">Fetching history...</p>
              </div>
            ) : leaves.length === 0 ? (
              <div className="p-10 text-center rounded-2xl bg-card border border-border border-dashed">
                <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">No leave requests found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leaves.map((l) => (
                  <div key={l.id} className="p-5 rounded-2xl bg-card border border-border shadow-sm flex items-start justify-between gap-4 hover:border-primary/30 transition-colors">
                    
                    <div className="flex-1">
                      <div className="font-bold text-foreground text-[15px] mb-1">{l.reason}</div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {l.start_date} to {l.end_date}</span>
                      </div>
                      <div className="text-xs text-muted-foreground/70 mt-3 font-medium">
                        {/* Formatting the timestamp to just show the date */}
                        Applied on: {new Date(l.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 ${
                      l.status === 'Pending' ? 'bg-orange-500/10 text-orange-600' :
                      l.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                    }`}>
                      {l.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                      {l.status === 'Approved' && <CheckCircle className="w-3.5 h-3.5" />}
                      {l.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                      {l.status}
                    </span>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentLeaves;