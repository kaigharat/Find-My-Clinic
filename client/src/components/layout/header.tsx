import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "framer-motion";
import { Link, useLocation } from "wouter";
import {

  Hospital,
  LogIn,
  User,
  Clock,
  UserX,
  AlertTriangle,
  MapPin,
  Smartphone,
  QrCode,
  CheckCircle,
  Bell,
  TrendingUp,
  Users,
  Settings,
  Server,
  Zap,
  Mail,
  Phone,
  Twitter,
  Linkedin,
  Facebook,
  Menu,
  X,
  Stethoscope,
  Ambulance,
  ArrowRight,
  Star,
  Shield,
  Heart,
  Brain,
  MessageSquare,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

// Custom hook for scroll animations
function useScrollAnimation() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1, once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("animate");
    }
  }, [controls, isInView]);

  return [ref, controls];
}

export default function Header() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [location] = useLocation();
  const { signOut, userRole } = useAuth();

  const getNavigation = () => {
    if (userRole === 'patient') {
      return [
        { name: "Home", href: "/" },
        { name: "Find Clinics", href: "/patients" },
        { name: "Symptom Analysis", href: "/symptom-analysis" },
        { name: "My Profile", href: "/profile" },
        //{ name: "Dashboard", href: "/dashboard" },
        { name: "About", href: "/about" },
      ];
    } else {
      return [
        { name: "Home", href: "/" },
        { name: "For Clinics", href: "/clinics" },
        //{ name: "Symptom Analysis", href: "/symptom-analysis" },
        { name: "About", href: "/about" },
      ];
    }
  };

  const navigation = getNavigation();

  const emergencyServices = [
    { name: "Ambulance", number: "108", description: "Emergency medical services" },
    { name: "Police", number: "100", description: "Law enforcement emergency" },
    { name: "Fire Brigade", number: "101", description: "Fire emergency services" },
    { name: "Women Helpline", number: "1091", description: "Women's safety and support" },
    { name: "Child Helpline", number: "1098", description: "Child protection services" },
  ];

  const handleEmergencyCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-lg"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <MapPin className="text-white h-5 w-5" />
              <Stethoscope className="text-white h-3 w-3 absolute -top-0.5 -right-0.5" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Find My Clinic
              </h1>
              <p className="text-xs text-slate-600">In need of care? We'll get you there.</p>
            </div>
          </Link>



          {/* Desktop Navigation */}
          <motion.div
            className="hidden md:flex items-center space-x-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {navigation.map((item) => (
              <motion.div
                key={item.name}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium px-3 py-2 rounded-lg",
                    location === item.href && "text-blue-600 font-semibold bg-blue-50"
                  )}
                  data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2 rounded-full font-semibold">
                    Go to Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={signOut}
                  variant="outline"
                  className="border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all duration-300 px-4 py-2 rounded-full font-semibold"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2 rounded-full font-semibold">
                  Login / Sign Up
                </Button>
              </Link>
            )}

            {/* Emergency Button - Desktop */}
            <div className="hidden md:flex items-center">
              <Dialog open={isEmergencyOpen} onOpenChange={setIsEmergencyOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 animate-pulse"
                    data-testid="emergency-button"
                  >
                    <Ambulance className="h-4 w-4 mr-2" />
                    Emergency
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                      Emergency Services
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      In case of emergency, contact the appropriate service immediately.
                    </p>
                    <div className="grid gap-3">
                      {emergencyServices.map((service) => (
                        <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-semibold text-gray-900">{service.name}</h4>
                            <p className="text-sm text-gray-600">{service.description}</p>
                          </div>
                          <Button
                            onClick={() => handleEmergencyCall(service.number)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            size="sm"
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            {service.number}
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-4">
                      Emergency services are available 24/7
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-slate-700" />
            ) : (
              <Menu className="h-6 w-6 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-slate-200"
          >
            <div className="pt-4 space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block text-slate-700 hover:text-blue-600 transition-colors py-2",
                    location === item.href && "text-blue-600 font-medium"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                  data-testid={`mobile-nav-${item.name.toLowerCase().replace(' ', '-')}`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-3 mt-4">
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full">
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full">
                      Login / Sign Up
                    </Button>
                  </Link>
                )}

              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
