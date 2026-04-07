import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../redux/slices/courseSlice';
import { applyForCourse, fetchMyEnrollments } from '../../redux/slices/enrollmentSlice';
import DashboardLayout from '../../components/DashboardLayout';
import Modal from '../../components/Modal';
import { BookOpen, Clock, User, CheckCircle2, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const StudentCourses = () => {
  const dispatch = useDispatch();
  
  // Extracting data from Redux
  const { items: courses, status: coursesStatus } = useSelector((state) => state.courses);
  const { items: myEnrollments, status: enrollmentsStatus } = useSelector((state) => state.enrollments);
  const { user } = useSelector((state) => state.auth);

  const [applyModal, setApplyModal] = useState(null);
  const selected = courses.find(c => c.id === applyModal);

  // Fetch fresh courses and student enrollments on page load
  useEffect(() => {
    dispatch(fetchCourses());
    if (user?.id) {
      dispatch(fetchMyEnrollments(user.id));
    }
  }, [dispatch, user]);

  const handleApply = async () => {
    // BUG FIX: Alert the user if the ID is missing instead of failing silently
    if (!user?.id) {
      Swal.fire({ 
        icon: 'error', 
        title: 'Authentication Error', 
        text: 'User ID is missing. If you are testing, please add an "id" to your fake user in authSlice.',
        confirmButtonColor: 'hsl(160, 45%, 28%)' 
      });
      return;
    }

    if (applyModal) {
      try {
        // Sending data to Supabase
        await dispatch(applyForCourse({
          course_id: applyModal,
          student_id: user.id,
          status: 'Pending'
        })).unwrap();

        Swal.fire({ 
          icon: 'success', 
          title: 'Application Sent!', 
          text: `Your application for ${selected?.title} has been successfully submitted.`, 
          timer: 2000, 
          showConfirmButton: false 
        });
        setApplyModal(null);
      } catch (error) {
        Swal.fire({ 
          icon: 'error', 
          title: 'Submission Failed', 
          text: error.message,
          confirmButtonColor: 'hsl(160, 45%, 28%)'
        });
      }
    }
  };

  // Helper function to check if the student is already applied/enrolled
  const hasApplied = (courseId) => {
    return myEnrollments.some(enrollment => enrollment.course_id === courseId);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-primary" /> Course Portal
          </h1>
          <p className="text-muted-foreground">Browse and apply for available courses.</p>
        </div>

        {coursesStatus === 'loading' ? (
          <div className="flex justify-center items-center py-20 text-muted-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
            Loading courses...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(c => {
              const applied = hasApplied(c.id);

              return (
                <div key={c.id} className="relative p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
                  
                  {applied && <div className="absolute top-0 left-0 w-full h-1 bg-primary" />}

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      c.status === 'Open' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                    }`}>{c.status === 'Open' ? 'Admissions Open' : 'Closed'}</span>
                    
                    {applied && (
                      <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2 leading-tight">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{c.category}</p>
                  
                  <div className="mt-auto space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary/70" /> <span>{c.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4 text-primary/70" /> <span>{c.instructor}</span>
                    </div>
                  </div>

                  <button 
                    disabled={c.status === 'Closed' || applied} 
                    onClick={() => setApplyModal(c.id)}
                    className={`w-full py-3 rounded-xl font-bold text-[15px] transition-all flex justify-center items-center gap-2 ${
                      applied ? 'bg-primary/10 text-primary cursor-not-allowed' :
                      c.status === 'Open' ? 'bg-primary text-primary-foreground hover:opacity-90 hover:scale-[1.02] shadow-md' :
                      'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    {applied ? 'Already Applied' : c.status === 'Open' ? 'Apply Now' : 'Admissions Closed'}
                  </button>
                </div>
              );
            })}
            
            {courses.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground border border-dashed border-border py-10 rounded-xl">
                No courses available at the moment.
              </div>
            )}
          </div>
        )}
      </div>

      <Modal open={!!applyModal} onClose={() => setApplyModal(null)} title="Confirm Enrollment">
        {selected && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 flex gap-4 items-start">
              <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-foreground text-lg">{selected.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">Are you sure you want to submit your application for this course?</p>
              </div>
            </div>
            <button onClick={handleApply} className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-[15px] shadow-md hover:opacity-90 transition-all">
              Yes, Submit Application
            </button>
          </div>
        )}
      </Modal>

    </DashboardLayout>
  );
};

export default StudentCourses;