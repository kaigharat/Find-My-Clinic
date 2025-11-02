import { Link } from "wouter";
import { MapPin, Stethoscope, Mail, Phone, Twitter, Linkedin, Facebook } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "For Patients", href: "/patients" },
    { name: "For Clinics", href: "/clinics" },
    { name: "About Us", href: "/about" },
  ];

  return (
    <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <MapPin className="text-white h-5 w-5" />
                    <Stethoscope className="text-white h-3 w-3 absolute -top-0.5 -right-0.5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-400">Find My Clinic</h3>
                    <p className="text-xs text-slate-400">In need of care? We'll get you there.</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Revolutionizing healthcare access with smart queue management and real-time clinic discovery.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-blue-400">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/" className="text-slate-400 hover:text-blue-400 transition-colors">Home</Link></li>
                  <li><Link href="/patients" className="text-slate-400 hover:text-blue-400 transition-colors">Find Clinics</Link></li>
                  {/*<li><Link href="/symptom-analysis" className="text-slate-400 hover:text-blue-400 transition-colors">Symptom Analysis</Link></li>*/}
                  <li><Link href="/about" className="text-slate-400 hover:text-blue-400 transition-colors">About Us</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-blue-400">Contact</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>hello@findmyclinic.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-8 text-center">
              <p className="text-slate-400 text-sm">
                © 2025 Find My Clinic. All rights reserved. | <Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link> | <Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
  );
}
