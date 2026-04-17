import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnnouncements } from '../../redux/slices/announcementSlice';
import DashboardLayout from '../../components/DashboardLayout';
import { Megaphone, Bell, Calendar, Info, Search, ChevronRight, Loader2 } from 'lucide-react';

const Announcements = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch dynamic data from Redux
  const { items: announcements, status } = useSelector((state) => state.announcements);

  // Load announcements on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAnnouncements());
    }
  }, [dispatch, status]);

  // Search filter logic
  const filteredAnnouncements = announcements.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (a.category && a.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Helper function to assign icons based on category
  const getIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'exam': return Bell;
      case 'holiday': return Calendar;
      case 'event': return Megaphone;
      default: return Info;
    }
  };

  // Helper function to format the timestamp from Supabase
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Megaphone className="w-8 h-8 text-primary" /> Announcements
            </h1>
            <p className="text-muted-foreground mt-1">View the latest campus updates and news here.</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search updates..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {status === 'loading' ? (
            <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-dashed border-border">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Loading Announcements...</h3>
            </div>
          ) : filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((item) => {
              const IconComponent = getIcon(item.category);

              return (
                <div key={item.id} className="group relative bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all overflow-hidden">
                  
                  {/* Priority Indicator Line */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    item.priority === 'High' ? 'bg-red-500' : 
                    item.priority === 'Medium' ? 'bg-orange-500' : 'bg-blue-500'
                  }`} />

                  <div className="flex flex-col md:flex-row gap-5 items-start">
                    {/* Icon Box */}
                    <div className={`p-3 rounded-xl shrink-0 ${
                      item.priority === 'High' ? 'bg-red-500/10 text-red-600' : 
                      item.priority === 'Medium' ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-500/10 text-blue-600'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          item.category === 'Exam' ? 'bg-purple-500/10 text-purple-600' :
                          item.category === 'Holiday' ? 'bg-emerald-500/10 text-emerald-600' :
                          'bg-slate-500/10 text-slate-600'
                        }`}>
                          {item.category || 'General'}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">• {formatDate(item.created_at)}</span>
                      </div>

                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                        {item.content}
                      </p>
                    </div>

                    {/* Action Link */}
                    <button className="md:self-center p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-primary transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No updates found</h3>
              <p className="text-muted-foreground text-sm">Try searching with a different keyword.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Announcements;