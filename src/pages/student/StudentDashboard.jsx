import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { BookOpen, CalendarDays, Clock, User, ChevronRight, Loader2 } from 'lucide-react';
import { fetchMyLeaves } from '../../redux/slices/leaveSlice';
import { fetchMyEnrollments } from '../../redux/slices/enrollmentSlice';
import { fetchCourses } from '../../redux/slices/courseSlice';

const StudentDashboard = () => {
  const dispatch = useDispatch();

  // Redux se saara required data fetch kar rahe hain
  const { user } = useSelector((state) => state.auth);
  const { items: allCourses, status: coursesStatus } = useSelector((state) => state.courses);
  const { items: myEnrollments, status: enrollmentsStatus } = useSelector((state) => state.enrollments);
  const { items: myLeaves, status: leavesStatus } = useSelector((state) => state.leaves);

  // Page load hone par real data database se mangwana
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchMyLeaves(user.id));
      dispatch(fetchMyEnrollments(user.id));
      dispatch(fetchCourses()); // Ye is liye zaroori hai taake hum courses ke titles aur details nikal sakein
    }
  }, [dispatch, user]);

  // 1. Leave Stats calculate karna
  const pendingLeavesCount = myLeaves.filter(l => l.status === 'Pending').length;
  const totalLeavesCount = myLeaves.length;

  // 2. Enrolled Courses map karna (Enrollment ID se Course ki details nikalna)
  const enrolledCoursesData = myEnrollments
    .map(enrollment => {
      const courseDetail = allCourses.find(c => c.id === enrollment.course_id);
      return courseDetail ? { ...courseDetail, applicationStatus: enrollment.status } : null;
    })
    .filter(Boolean); // Null values remove karne ke liye

  // Loading state check
  const isLoading = coursesStatus === 'loading' || enrollmentsStatus === 'loading' || leavesStatus === 'loading';

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* Premium Welcome Banner */}
        <div className="relative p-8 rounded-3xl bg-gradient-to-r from-primary/90 to-primary text-primary-foreground overflow-hidden shadow-lg border border-primary/20">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 right-20 w-24 h-24 rounded-full bg-black/10 blur-xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2 tracking-tight">Welcome back, {user?.name || 'Student'}! 👋</h1>
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
              <div className="text-sm font-semibold text-muted-foreground mb-1">Applied Courses</div>
              <div className="text-3xl font-black text-foreground">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-primary mt-1" /> : enrolledCoursesData.length}
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-5 hover:shadow-md transition-all group">
            <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 group-hover:scale-105 transition-transform">
              <CalendarDays className="w-8 h-8" />
            </div>
            <div>
              <div className="text-sm font-semibold text-muted-foreground mb-1">Total Leaves</div>
              <div className="text-3xl font-black text-foreground">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-primary mt-1" /> : totalLeavesCount}
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-5 hover:shadow-md transition-all group">
            <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-600 group-hover:scale-105 transition-transform">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <div className="text-sm font-semibold text-muted-foreground mb-1">Pending Leaves</div>
              <div className="text-3xl font-black text-foreground">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-primary mt-1" /> : pendingLeavesCount}
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="p-8 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">My Applications</h3>
            <Link to="/student/courses" className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-5">
            {isLoading ? (
              <div className="col-span-2 py-8 text-center bg-muted/20 rounded-xl border border-dashed border-border flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                <p className="text-muted-foreground font-medium">Loading your applications...</p>
              </div>
            ) : enrolledCoursesData.length > 0 ? (
              enrolledCoursesData.map(c => (
                <div key={c.id} className="p-5 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-colors flex flex-col justify-between">
                  
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-foreground text-lg">{c.title}</h4>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary/10 text-primary">
                      {c.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground pt-4 border-t border-border/50">
                    <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {c.instructor}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {c.duration}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-8 text-center bg-muted/20 rounded-xl border border-dashed border-border">
                <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">You haven't applied to any courses yet.</p>
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