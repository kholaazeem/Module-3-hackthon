import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnnouncements, addAnnouncement } from '../../redux/slices/announcementSlice';
import DashboardLayout from '../../components/DashboardLayout';
import Modal from '../../components/Modal'; 
import { Megaphone, Plus, Bell, Calendar, Info, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminAnnouncements = () => {
  const dispatch = useDispatch();
  const { items: announcements, status } = useSelector((state) => state.announcements);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'Medium'
  });

  // Page load hone par purani announcements fetch karein
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAnnouncements());
    }
  }, [dispatch, status]);

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Supabase mein data bhej rahe hain
      await dispatch(addAnnouncement(form)).unwrap();
      
      Swal.fire({
        icon: 'success',
        title: 'Announcement Published!',
        text: 'The announcement is now visible to all students.',
        confirmButtonColor: 'hsl(160, 45%, 28%)', // Matching theme color
        timer: 2000,
        showConfirmButton: false
      });
      
      setIsModalOpen(false);
      setForm({ title: '', content: '', category: 'General', priority: 'Medium' }); // Form reset
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Publish',
        text: error.message || 'Something went wrong.',
        confirmButtonColor: 'hsl(160, 45%, 28%)'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function for Icons
  const getIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'exam': return Bell;
      case 'holiday': return Calendar;
      case 'event': return Megaphone;
      default: return Info;
    }
  };

  // Date formatter helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
            <Megaphone className="w-8 h-8 text-primary" /> Manage Announcements
          </h1>
          <p className="text-muted-foreground">Create and broadcast updates to all students.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-2 hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" /> Post Announcement
        </button>
      </div>

      {/* Announcements List for Admin */}
      <div className="space-y-4">
        {status === 'loading' ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-dashed border-border">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Loading Announcements...</h3>
          </div>
        ) : announcements.length > 0 ? (
          announcements.map((item) => {
            const IconComponent = getIcon(item.category);

            return (
              <div key={item.id} className="relative bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-5 items-start overflow-hidden hover:border-primary/30 transition-colors">
                
                {/* Priority Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  item.priority === 'High' ? 'bg-red-500' : 
                  item.priority === 'Medium' ? 'bg-orange-500' : 'bg-blue-500'
                }`} />

                {/* Icon Box */}
                <div className={`p-3 rounded-xl shrink-0 ${
                  item.priority === 'High' ? 'bg-red-500/10 text-red-600' : 
                  item.priority === 'Medium' ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-500/10 text-blue-600'
                }`}>
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.category === 'Exam' ? 'bg-purple-500/10 text-purple-600' :
                        item.category === 'Holiday' ? 'bg-emerald-500/10 text-emerald-600' :
                        'bg-slate-500/10 text-slate-600'
                      }`}>
                        {item.category || 'General'}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">• {formatDate(item.created_at)}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                    {item.content}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
            <Megaphone className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground">No Announcements Yet</h3>
            <p className="text-muted-foreground text-sm">Click the button above to create your first post.</p>
          </div>
        )}
      </div>

      {/* Add Announcement Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Announcement">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Announcement Title</label>
            <input 
              required 
              value={form.title} 
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
              placeholder="e.g. Final Exams Schedule" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Category</label>
              <select 
                value={form.category} 
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
              >
                <option value="General">General</option>
                <option value="Exam">Exam</option>
                <option value="Holiday">Holiday</option>
                <option value="Event">Event</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Priority Level</label>
              <select 
                value={form.priority} 
                onChange={e => setForm({ ...form, priority: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Details / Content</label>
            <textarea 
              required 
              rows={4}
              value={form.content} 
              onChange={e => setForm({ ...form, content: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" 
              placeholder="Write the full announcement details here..." 
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full mt-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-[15px] hover:opacity-90 hover:scale-[1.02] transition-all shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Announcement"}
          </button>
        </form>
      </Modal>

    </DashboardLayout>
  );
};

export default AdminAnnouncements;