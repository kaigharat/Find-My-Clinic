import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
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
import LanguageSwitcher from "@/components/ui/language-switcher";

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
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  const [location] = useLocation();
  const { signOut, userRole } = useAuth();

  const getNavigation = () => {
    if (userRole === 'patient') {
      return [
        { name: t('nav.home'), href: "/" },
        { name: t('nav.findClinics'), href: "/patients" },
        { name: t('nav.symptomAnalysis'), href: "/symptom-analysis" },
        { name: t('nav.myProfile'), href: "/profile" },
        //{ name: "Dashboard", href: "/dashboard" },
        { name: t('nav.about'), href: "/about" },
      ];
    } else {
      return [
        { name: t('nav.home'), href: "/" },
        { name: t('nav.forClinics'), href: "/clinics" },
        //{ name: "Symptom Analysis", href: "/symptom-analysis" },
        { name: t('nav.about'), href: "/about" },
      ];
    }
  };

  const navigation = getNavigation();

  const emergencyServices = [
    { name: t('emergency.ambulance'), number: "108", description: t('emergency.ambulance') + " - " + t('emergency.description') },
    { name: t('emergency.police'), number: "100", description: t('emergency.police') + " - " + t('emergency.description') },
    { name: t('emergency.fire'), number: "101", description: t('emergency.fire') + " - " + t('emergency.description') },
    { name: t('emergency.helpline'), number: "1091", description: t('emergency.helpline') + " - " + t('emergency.description') },
    { name: t('emergency.childline'), number: "1098", description: t('emergency.childline') + " - " + t('emergency.description') },
  ];

  const handleEmergencyCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-white shadow-lg"
    >
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group mr-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <MapPin className="text-white h-5 w-5" />
              <Stethoscope className="text-white h-3 w-3 absolute -top-0.5 -right-0.5" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">
                Find My Clinic
              </h1>
              <p className="text-xs text-gray-700">Find clinics near you</p>
            </div>
          </Link>

          {/* Emergency Button - Desktop */}
          <div className="hidden md:flex items-center mr-6">
            <Dialog open={isEmergencyOpen} onOpenChange={setIsEmergencyOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 animate-pulse"
                  data-testid="emergency-button"
                >
                  <Ambulance className="h-4 w-4 mr-2" />
                  {t('emergency.title')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    {t('emergency.title')}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    {t('emergency.description')}
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
                    {t('emergency.available')}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Desktop Navigation */}
          <motion.div
            className="hidden md:flex items-center justify-center space-x-6 flex-1"
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
                    "text-gray-900 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium px-3 py-2 rounded-lg",
                    location === item.href && "text-blue-600 font-semibold bg-blue-100"
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
                  <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2 rounded-full font-semibold">
                    {t('nav.goToDashboard')}
                  </Button>
                </Link>
                <Button
                  onClick={signOut}
                  variant="outline"
                  className="border-gray-300 text-gray-900 hover:bg-gray-100 hover:text-blue-600 transition-all duration-300 px-4 py-2 rounded-full font-semibold"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2 rounded-full font-semibold">
                  {t('nav.loginSignup')}
                </Button>
              </Link>
            )}

            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <Menu className="h-6 w-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-gray-300"
          >
            <div className="pt-4 space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block text-gray-900 hover:text-blue-600 transition-colors py-2",
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
                      <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-full">
                        {t('nav.goToDashboard')}
                      </Button>
                    </Link>
                    <Button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-gray-300 text-gray-900 hover:bg-gray-100 hover:text-blue-600 rounded-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('nav.logout')}
                    </Button>
                  </>
                ) : (
                  <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-full">
                      {t('nav.loginSignup')}
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
