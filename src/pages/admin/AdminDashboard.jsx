import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Users, BookOpen, CalendarDays, TrendingUp, Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '../../redux/slices/courseSlice';
import { fetchAllLeaves } from '../../redux/slices/leaveSlice';
import { supabase } from '../../supabase/supabaseClient';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Redux se data
  const { items: courses, status: coursesStatus } = useSelector((state) => state.courses);
  const { items: leaveRequests, status: leavesStatus } = useSelector((state) => state.leaves);

  // Local state un cheezon ke liye jinka Redux slice nahi hai
  const [students, setStudents] = useState([]);
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [isFetchingLocal, setIsFetchingLocal] = useState(true);

  useEffect(() => {
    // 1. Redux Actions Dispatch karein
    dispatch(fetchCourses());
    dispatch(fetchAllLeaves());

    // 2. Direct Supabase se Students aur Enrollments fetch karein
    const fetchLocalStats = async () => {
      setIsFetchingLocal(true);
      try {
        // Fetch recent 5 students from app_users
        const { data: studentsData, error: studentError } = await supabase
          .from('app_users')
          .select('*')
          .eq('role', 'student')
          .limit(5);

        if (!studentError && studentsData) {
          setStudents(studentsData);
        }

        // Fetch total count of enrollments
        const { count, error: countError } = await supabase
          .from('enrollments')
          .select('*', { count: 'exact', head: true });

        if (!countError && count !== null) {
          setTotalEnrollments(count);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsFetchingLocal(false);
      }
    };

    fetchLocalStats();
  }, [dispatch]);

  // Loading state combine kar lein
  const isLoading = coursesStatus === 'loading' || leavesStatus === 'loading' || isFetchingLocal;

  // Stats Calculate karein
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;
  const activeCourses = courses.filter(c => c.status === 'Open').length;

  const metrics = [
    { label: 'Total Students', value: students.length > 0 ? students.length : 0, icon: Users, color: 'bg-primary/10 text-primary' },
    { label: 'Active Courses', value: activeCourses, icon: BookOpen, color: 'bg-accent/20 text-accent-foreground' },
    { label: 'Pending Leaves', value: pendingLeaves, icon: CalendarDays, color: 'bg-red-500/10 text-red-500' },
    { label: 'Total Enrollments', value: totalEnrollments, icon: TrendingUp, color: 'bg-emerald-100 text-emerald-700' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Overview</h1>
          {isLoading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
        </div>
        
        {/* 4-Column Metrics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="p-5 rounded-2xl bg-card border border-border shadow-soft hover:shadow-medium transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.color}`}>
                  <m.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? <span className="text-muted-foreground/30 text-lg">...</span> : m.value}
              </div>
              <div className="text-sm text-muted-foreground">{m.label}</div>
            </div>
          ))}
        </div>

        {/* 2-Column Lists */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Recent Students */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
            <h3 className="font-semibold text-foreground mb-4">Recent Students</h3>
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-sm text-muted-foreground text-center py-4">Loading students...</div>
              ) : students.length > 0 ? (
                students.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/50">
                    <div>
                      {/* Database mein apka column 'username' hai is liye s.username use kiya hai */}
                      <div className="font-medium text-sm text-foreground">{s.username}</div>
                      <div className="text-xs text-muted-foreground">CNIC/ID: {s.cnic || 'N/A'}</div>
                    </div>
                    <span className="px-2 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary">Student</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">No students registered yet.</div>
              )}
            </div>
          </div>

          {/* Recent Leave Requests */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
            <h3 className="font-semibold text-foreground mb-4">Recent Leave Requests</h3>
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-sm text-muted-foreground text-center py-4">Loading requests...</div>
              ) : leaveRequests.length > 0 ? (
                leaveRequests.slice(0, 5).map(l => (
                  <div key={l.id} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/50">
                    <div>
                      <div className="font-medium text-sm text-foreground">{l.student_name}</div>
                      <div className="text-xs text-muted-foreground max-w-[200px] truncate">{l.reason}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                      l.status === 'Pending' ? 'bg-orange-500/10 text-orange-600' :
                      l.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                    }`}>{l.status}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">No leave requests found.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;