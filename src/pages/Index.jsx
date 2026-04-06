import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { GraduationCap, Users, BookOpen, Award, ArrowRight, MessageCircle, ExternalLink } from 'lucide-react';

const stats = [
  { icon: Users, label: 'Active Students', value: '15,000+' },
  { icon: BookOpen, label: 'Courses Offered', value: '50+' },
  { icon: Award, label: 'Graduates', value: '10,000+' },
  { icon: GraduationCap, label: 'Campuses', value: '12' },
];

const featuredCourses = [
  { title: 'Web Development', desc: 'React, Node.js, and full-stack mastery', duration: '6 Months' },
  { title: 'Data Science & AI', desc: 'Python, ML, and artificial intelligence', duration: '8 Months' },
  { title: 'App Development', desc: 'React Native & Flutter cross-platform', duration: '6 Months' },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-dark" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 30% 50%, hsl(160, 45%, 28%) 0%, transparent 50%), radial-gradient(circle at 70% 80%, hsl(45, 90%, 55%) 0%, transparent 40%)'
        }} />
        <div className="relative z-10 container mx-auto px-6 text-center mt-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-sm font-medium text-emerald-200 mb-6 animate-fade-in">
            <GraduationCap className="w-4 h-4" /> Saylani Mass IT Training
          </div>
          <h1 className="heading-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Shape Your <span className="text-accent">Future</span><br />With Technology
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/60 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Free IT training for everyone. Join Pakistan's largest IT training program and transform your career with cutting-edge skills.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/signup" className="px-8 py-3.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-glow flex items-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/courses" className="px-8 py-3.5 rounded-xl border border-primary-foreground/20 text-primary-foreground font-semibold text-sm hover:bg-primary-foreground/10 transition-all">
              View Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="heading-display text-3xl md:text-4xl font-bold text-foreground mb-3">Our Impact</h2>
            <p className="text-muted-foreground">Transforming lives through technology education</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-background border border-border shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <s.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Feed Placeholder */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="heading-display text-3xl md:text-4xl font-bold text-foreground mb-3">SMIT Official Updates</h2>
            <p className="text-muted-foreground">Stay connected with our latest news and events</p>
          </div>
          <div className="max-w-2xl mx-auto p-8 rounded-2xl border border-border bg-card shadow-soft">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                {/* Changed Facebook to MessageCircle here */}
                <MessageCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-semibold text-foreground">Saylani Mass IT Training</div>
                <div className="text-xs text-muted-foreground">Official Page • 500K+ Followers</div>
              </div>
              <a href="#" className="ml-auto text-primary text-sm font-medium flex items-center gap-1 hover:underline">
                Follow <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            {[
              { text: '🎉 New batch of Web Development starting April 15! Register now at saylaniwelfare.com', time: '2 hours ago', likes: 234 },
              { text: '📢 Congratulations to Batch 12 graduates! 85% placement rate achieved!', time: '1 day ago', likes: 892 },
              { text: '🚀 SMIT x Google partnership for cloud certifications announced!', time: '3 days ago', likes: 1205 },
            ].map((post, i) => (
              <div key={i} className="py-4 border-b last:border-0 border-border">
                <p className="text-sm text-foreground mb-2">{post.text}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{post.time}</span>
                  <span>❤️ {post.likes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Courses */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="heading-display text-3xl md:text-4xl font-bold text-foreground mb-3">Featured Courses</h2>
            <p className="text-muted-foreground">Start your journey with our most popular programs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredCourses.map((c, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-background border border-border shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-full h-40 rounded-xl gradient-primary mb-5 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-primary-foreground/40 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{c.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">{c.duration}</span>
                  <Link to="/courses" className="text-sm font-medium text-primary hover:underline">Learn More →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;