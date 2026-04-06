import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="gradient-dark text-primary-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg">SMIT Connect</span>
            </div>
            <p className="text-sm text-primary-foreground/60 leading-relaxed">
              Empowering students through quality IT education. Saylani Mass IT Training program — shaping the future of Pakistan's tech industry.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-primary-foreground/40">Quick Links</h4>
            <div className="space-y-2">
              {[{ label: 'Home', to: '/' }, { label: 'Courses', to: '/courses' }, { label: 'Login', to: '/login' }, { label: 'Sign Up', to: '/signup' }].map(l => (
                <Link key={l.to} to={l.to} className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-primary-foreground/40">Contact Us</h4>
            <div className="space-y-3">
              {[
                { icon: MapPin, text: 'Saylani Head Office, Bahadurabad, Karachi' },
                { icon: Phone, text: '+92-21-111-729-526' },
                { icon: Mail, text: 'info@saylaniwelfare.com' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-primary-foreground/60">
                  <item.icon className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-primary-foreground/40">Newsletter</h4>
            <p className="text-sm text-primary-foreground/60">Stay updated with new courses and announcements.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email" className="flex-1 px-3 py-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/10 text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-primary/50" />
              <button className="px-4 py-2 rounded-lg gradient-primary text-sm font-medium hover:opacity-90 transition-opacity">Go</button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/40">
          © 2026 SMIT Connect Portal. All rights reserved. Powered by Saylani Welfare.
        </div>
      </div>
    </footer>
  );
};

export default Footer;