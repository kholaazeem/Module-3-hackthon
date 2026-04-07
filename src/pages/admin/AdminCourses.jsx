import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, addCourse, updateCourse, deleteCourse } from '../../redux/slices/courseSlice';
import DashboardLayout from '../../components/DashboardLayout';
import Modal from '../../components/Modal';
import { BookOpen, Plus, Edit2, CheckCircle, XCircle, Clock, User, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminCourses = () => {
  const dispatch = useDispatch();
  
  // Asli data ab Redux (Supabase) se aayega
  const { items: courses, status } = useSelector((state) => state.courses);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', category: '', duration: '', instructor: '', status: 'Open' });

  // Page load hone par database se data fetch karein
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCourses());
    }
  }, [status, dispatch]);

  // Open Modal for Add or Edit
  const handleOpenModal = (course = null) => {
    if (course) {
      setForm({
        title: course.title,
        category: course.category,
        duration: course.duration,
        instructor: course.instructor,
        status: course.status
      });
      setEditId(course.id);
    } else {
      setForm({ title: '', category: '', duration: '', instructor: '', status: 'Open' });
      setEditId(null);
    }
    setIsModalOpen(true);
  };

  // Handle Form Submission (Add & Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update Course
        await dispatch(updateCourse({ id: editId, ...form })).unwrap();
        Swal.fire({ icon: 'success', title: 'Course Updated!', timer: 1500, showConfirmButton: false });
      } else {
        // Add New Course
        await dispatch(addCourse(form)).unwrap();
        Swal.fire({ icon: 'success', title: 'Course Added!', timer: 1500, showConfirmButton: false });
      }
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: error.message });
    }
  };

  // Toggle Admission Status directly
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Open' ? 'Closed' : 'Open';
    try {
      await dispatch(updateCourse({ id, status: newStatus })).unwrap();
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Failed to update status', text: error.message });
    }
  };

  // Delete Course
  const handleDelete = (id, title) => {
    Swal.fire({
      title: 'Delete Course?',
      text: `Are you sure you want to delete "${title}"? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(deleteCourse(id)).unwrap();
          Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Course has been deleted.', timer: 1500, showConfirmButton: false });
        } catch (error) {
          Swal.fire({ icon: 'error', title: 'Error', text: error.message });
        }
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-primary" /> Course Management
          </h1>
          <p className="text-muted-foreground">Add new courses, update details, or manage admissions.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 hover:opacity-90 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" /> Add New Course
        </button>
      </div>

      {status === 'loading' ? (
        <div className="flex justify-center items-center py-20 text-muted-foreground">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
          Loading courses from database...
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <div key={course.id} className="bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col hover:shadow-md transition-shadow animate-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 0.1}s` }}>
              
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  {course.category}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenModal(course)} 
                    className="p-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground transition-colors"
                    title="Edit Course"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {/* Delete Button Add kar diya gaya hai */}
                  <button 
                    onClick={() => handleDelete(course.id, course.title)} 
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="font-bold text-xl text-foreground mb-3 leading-tight">{course.title}</h3>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary/70" /> <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4 text-primary/70" /> <span>{course.instructor}</span>
                </div>
              </div>
              
              {/* Card Footer */}
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  course.status === 'Open' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                }`}>
                  Admissions {course.status}
                </span>
                
                <button 
                  onClick={() => toggleStatus(course.id, course.status)}
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  {course.status === 'Open' ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle className="w-4 h-4 text-emerald-500" />}
                  {course.status === 'Open' ? 'Close' : 'Open'}
                </button>
              </div>
            </div>
          ))}
          
          {courses.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground border border-dashed border-border rounded-2xl">
              No courses found in the database. Create your first course!
            </div>
          )}
        </div>
      )}

      {/* Dynamic Add/Edit Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? "Edit Course Details" : "Create New Course"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Course Title</label>
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="e.g. Master React.js" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Category</label>
              <input required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="e.g. Programming" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Duration</label>
              <input required value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="e.g. 6 Months" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Instructor Name</label>
            <input required value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="e.g. John Doe" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Admission Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer">
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <button type="submit" className="w-full mt-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-[15px] hover:opacity-90 hover:scale-[1.02] transition-all shadow-md">
            {editId ? "Save Changes" : "Publish Course"}
          </button>
        </form>
      </Modal>

    </DashboardLayout>
  );
};

export default AdminCourses;