import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Megaphone, Bell, Calendar, Info, Search, ChevronRight } from 'lucide-react';

const Announcements = () => {
  // Mock Data: Portal ki announcements
  const [announcements] = useState([
    {
      id: '1',
      title: 'Final Examination Schedule Released',
      content: 'Module 3 ke final exams May 15th se shuru ho rahe hain. Meharbani karke portal se date sheet download karlein.',
      category: 'Exam',
      priority: 'High',
      date: 'April 05, 2026',
      icon: Bell
    },
    {
      id: '2',
      title: 'Eid-ul-Fitr Holidays Notice',
      content: 'Eid ki chuttiyon ki wajah se institute April 10th se April 14th tak band rahega.',
      category: 'Holiday',
      priority: 'Medium',
      date: 'April 03, 2026',
      icon: Calendar
    },
    {
      id: '3',
      title: 'New MERN Stack Workshop',
      content: 'Is Sunday subah 10 baje Advanced Node.js concepts par ek special workshop organize ki ja rahi hai.',
      category: 'Event',
      priority: 'Low',
      date: 'April 02, 2026',
      icon: Megaphone
    },
    {
      id: '4',
      title: 'LMS Server Maintenance',
      content: 'Portal aaj raat (12 AM - 2 AM) maintenance ki wajah se band rahega.',
      category: 'General',
      priority: 'Medium',
      date: 'April 01, 2026',
      icon: Info
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredAnnouncements = announcements.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Megaphone className="w-8 h-8 text-primary" /> Announcements
            </h1>
            <p className="text-muted-foreground mt-1">Campus ki latest updates aur news yahan dekhein.</p>
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
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((item) => (
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
                    <item.icon className="w-6 h-6" />
                  </div>

                  {/* Content Area */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.category === 'Exam' ? 'bg-purple-500/10 text-purple-600' :
                        item.category === 'Holiday' ? 'bg-emerald-500/10 text-emerald-600' :
                        'bg-slate-500/10 text-slate-600'
                      }`}>
                        {item.category}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">• {item.date}</span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.content}
                    </p>
                  </div>

                  {/* Action Link */}
                  <button className="md:self-center p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-primary transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Koi update nahi mili</h3>
              <p className="text-muted-foreground text-sm">Alag keyword se search karke dekhein.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Announcements;