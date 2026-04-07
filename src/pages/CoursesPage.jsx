import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import { BookOpen, Clock, User, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const CoursesPage = () => {
  // Mock Data (Jab aap context ya database connect karengi toh isko replace kar dijiyega)
  const [courses] = useState([
    { id: '1', title: 'Web Development Bootcamp', category: 'Programming', description: 'Master the MERN stack from scratch. Build real-world projects with React and Node.js.', duration: '6 Months', instructor: 'Ali Khan', status: 'Open' },
    { id: '2', title: 'Data Science & AI', category: 'Data Science', description: 'Deep dive into Python, Machine Learning, and Neural Networks with practical datasets.', duration: '8 Months', instructor: 'Sara Ahmed', status: 'Closed' },
    { id: '3', title: 'UI/UX Design Masterclass', category: 'Design', description: 'Learn Figma, user research, wireframing, and modern web design principles.', duration: '3 Months', instructor: 'Zainab', status: 'Open' },
    { id: '4', title: 'Mobile App Development', category: 'Programming', description: 'Build cross-platform mobile applications using React Native and Firebase.', duration: '4 Months', instructor: 'Usman', status: 'Open' },
  ]);

  const [applyModal, setApplyModal] = useState(null);
  const [filter, setFilter] = useState('All');
  const [formData, setFormData] = useState({ name: '', email: '' });

  const categories = ['All', ...new Set(courses.map(c => c.category))];
  const filtered = filter === 'All' ? courses : courses.filter(c => c.category === filter);
  const selectedCourse = courses.find(c => c.id === applyModal);

  const handleApply = (e) => {
    e.preventDefault();
    setApplyModal(null);
    setFormData({ name: '', email: '' });
    
    Swal.fire({
      icon: 'success',
      title: 'Application Submitted!',
      text: `Thank you, ${formData.name}. You have successfully applied for ${selectedCourse?.title}. We'll contact you soon.`,
      confirmButtonColor: 'hsl(160, 45%, 28%)',
      timer: 3000
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-7xl animate-in fade-in duration-700">
          
          {/* Header Section */}
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight">Our Premium Courses</h1>
            <p className="text-lg text-muted-foreground">Explore our comprehensive IT training programs designed to launch your tech career.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  filter === cat 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105' 
                    : 'bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((course, i) => (
              <div 
                key={course.id} 
                className="group flex flex-col p-1 rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2" 
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="p-6 flex flex-col h-full bg-card rounded-[15px]">
                  
                  {/* Decorative Banner inside Card */}
                  <div className="w-full h-32 rounded-xl bg-gradient-to-br from-primary/80 to-primary mb-6 flex items-center justify-center relative overflow-hidden shadow-inner">
                    <BookOpen className="w-12 h-12 text-white/30 group-hover:scale-125 transition-transform duration-500" />
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                      course.status === 'Open' ? 'bg-white text-emerald-600' : 'bg-white/90 text-red-600'
                    }`}>
                      {course.status === 'Open' ? 'Admissions Open' : 'Closed'}
                    </span>
                  </div>

                  {/* Course Details */}
                  <span className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">{course.category}</span>
                  <h3 className="font-bold text-xl text-foreground mb-2 leading-tight">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-3">{course.description}</p>
                  
                  {/* Meta Info */}
                  <div className="mt-auto space-y-3 mb-6 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" /> {course.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <User className="w-4 h-4 text-primary" /> Instructor: {course.instructor}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    disabled={course.status === 'Closed'}
                    onClick={() => setApplyModal(course.id)}
                    className={`w-full py-3.5 rounded-xl text-[15px] font-bold transition-all flex justify-center items-center gap-2 ${
                      course.status === 'Open'
                        ? 'bg-primary text-primary-foreground hover:opacity-90 hover:scale-[1.02] shadow-md'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    {course.status === 'Open' ? 'Apply Now' : 'Registration Closed'}
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-muted-foreground text-lg">No courses found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Modern Application Modal */}
      <Modal open={!!applyModal} onClose={() => setApplyModal(null)} title="Apply for Course">
        {selectedCourse && (
          <form onSubmit={handleApply} className="space-y-6">
            
            <div className="p-5 rounded-xl bg-primary/5 border border-primary/20 flex gap-4 items-start">
              <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-foreground text-lg">{selectedCourse.title}</div>
                <div className="text-sm text-muted-foreground mt-1 font-medium">{selectedCourse.duration} • Taught by {selectedCourse.instructor}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Full Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50" 
                  placeholder="e.g. Ali Khan" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Email Address</label>
                <input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50" 
                  placeholder="e.g. ali@example.com" 
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 mt-2 rounded-xl bg-primary text-primary-foreground font-bold text-[15px] hover:opacity-90 hover:scale-[1.01] transition-all shadow-md">
              Confirm Application
            </button>
          </form>
        )}
      </Modal>

    </div>
  );
};

export default CoursesPage;