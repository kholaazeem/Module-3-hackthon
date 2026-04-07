import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { BookOpen, CalendarDays, Clock, User, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  // Demo Data (Context ki jagah local data for testing UI)
  const currentUser = { name: 'Khola Azeem' };
  const enrolledCourses = [
    { id: 1, title: 'Web Development Bootcamp', instructor: 'Ali Khan', duration: '6 Months' },
    { id: 2, title: 'UI/UX Design Masterclass', instructor: 'Zainab', duration: '3 Months' }
  ];
  const myLeaves = [
    { id: 1, status: 'Approved' },
    { id: 2, status: 'Pending' }
  ];

  const pendingLeavesCount = myLeaves.filter(l => l.status === 'Pending').length;

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* Premium Welcome Banner */}
        <div className="relative p-8 rounded-3xl bg-gradient-to-r from-primary/90 to-primary text-primary-foreground overflow-hidden shadow-lg border border-primary/20">
          {/* Decorative background circles */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 right-20 w-24 h-24 rounded-full bg-black/10 blur-xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2 tracking-tight">Welcome back, {currentUser?.name}! 👋</h1>
            <p className="text-primary-foreground/80 font-medium text-[15px]">Here's your academic overview for today.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-5 hover:shadow-md transition-all group">
            <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-600 group-hover:scale-105 transition-transform">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <div className="text-sm font-semibold text-muted-foreground mb-1">Enrolled Courses</div>
              <div className="text-3xl font-black text-foreground">{enrolledCourses.length}</div>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-5 hover:shadow-md transition-all group">
            <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 group-hover:scale-105 transition-transform">
              <CalendarDays className="w-8 h-8" />
            </div>
            <div>
              <div className="text-sm font-semibold text-muted-foreground mb-1">Total Leaves</div>
              <div className="text-3xl font-black text-foreground">{myLeaves.length}</div>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-5 hover:shadow-md transition-all group">
            <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-600 group-hover:scale-105 transition-transform">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <div className="text-sm font-semibold text-muted-foreground mb-1">Pending Leaves</div>
              <div className="text-3xl font-black text-foreground">{pendingLeavesCount}</div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="p-8 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">My Courses</h3>
            <Link to="/student/courses" className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-5">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map(c => (
                <div key={c.id} className="p-5 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-colors flex flex-col justify-between">
                  <h4 className="font-bold text-foreground text-lg mb-4">{c.title}</h4>
                  <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground pt-4 border-t border-border/50">
                    <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {c.instructor}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {c.duration}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-8 text-center bg-muted/20 rounded-xl border border-dashed border-border">
                <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">You haven't enrolled in any courses yet.</p>
                <Link to="/student/courses" className="text-primary font-semibold mt-2 inline-block hover:underline">Browse Courses</Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;