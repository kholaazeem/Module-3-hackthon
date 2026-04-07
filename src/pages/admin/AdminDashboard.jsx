import DashboardLayout from '../../components/DashboardLayout';
import { Users, BookOpen, CalendarDays, TrendingUp } from 'lucide-react';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // Dummy data added temporarily to match the exact UI until we connect Supabase
  const students = [
    { id: 1, name: 'Khola Azeem', rollNo: '1001', course: 'Web Development' },
    { id: 2, name: 'Ayesha Ahmed', rollNo: '1002', course: 'Data Science' },
    { id: 3, name: 'Usman Ali', rollNo: '1003', course: 'App Development' },
    { id: 4, name: 'Fatima Bilal', rollNo: '1004', course: 'Web Development' },
  ];

  const courses = [
    { id: 1, status: 'Open' }, { id: 2, status: 'Open' }, { id: 3, status: 'Closed' }
  ];

  const leaveRequests = [
    { id: 1, studentName: 'Khola Azeem', reason: 'Medical Leave', status: 'Pending' },
    { id: 2, studentName: 'Sara Khan', reason: 'Family Event', status: 'Approved' },
    { id: 3, studentName: 'Zainab Bibi', reason: 'Out of City', status: 'Rejected' },
  ];

  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;

  const metrics = [
    { label: 'Total Students', value: students.length, icon: Users, color: 'bg-primary/10 text-primary' },
    { label: 'Active Courses', value: courses.filter(c => c.status === 'Open').length, icon: BookOpen, color: 'bg-accent/20 text-accent-foreground' },
    { label: 'Pending Leaves', value: pendingLeaves, icon: CalendarDays, color: 'bg-red-500/10 text-red-500' },
    { label: 'Total Enrollments', value: 15, icon: TrendingUp, color: 'bg-emerald-100 text-emerald-700' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Overview</h1>
        
        {/* 4-Column Metrics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="p-5 rounded-2xl bg-card border border-border shadow-soft hover:shadow-medium transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.color}`}>
                  <m.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{m.value}</div>
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
              {students.slice(0, 5).map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/50">
                  <div>
                    <div className="font-medium text-sm text-foreground">{s.name}</div>
                    <div className="text-xs text-muted-foreground">Roll: {s.rollNo}</div>
                  </div>
                  <span className="px-2 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary">{s.course}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Leave Requests */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
            <h3 className="font-semibold text-foreground mb-4">Recent Leave Requests</h3>
            <div className="space-y-3">
              {leaveRequests.slice(0, 5).map(l => (
                <div key={l.id} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/50">
                  <div>
                    <div className="font-medium text-sm text-foreground">{l.studentName}</div>
                    <div className="text-xs text-muted-foreground">{l.reason}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                    l.status === 'Pending' ? 'bg-accent/20 text-accent-foreground' :
                    l.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-500/10 text-red-500'
                  }`}>{l.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;