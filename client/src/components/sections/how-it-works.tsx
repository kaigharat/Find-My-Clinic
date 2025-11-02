import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "framer-motion";
import { Search, Clock, Bell, CheckCircle, LogIn, Users, RefreshCw, MessageCircle, QrCode, ScanLine, Hospital } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { amount: 0.1, once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("animate");
    }
  }, [controls, isInView]);

  return { ref, controls };
}

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"patient" | "clinic">("patient");
  const { ref, controls } = useScrollAnimation();

  const patientSteps = [
    {
      icon: Search,
      title: "Find Clinics",
      description: "Search and discover nearby clinics with real-time information",
      color: "bg-primary",
    },
    {
      icon: Users,
      title: "Join Queue",
      description: "Click 'Join Queue' to get in line and receive queue position",
      color: "bg-primary",
    },
    {
      icon: Clock,
      title: "View Queue Status",
      description: "See your position and estimated wait time in real-time",
      color: "bg-primary",
    },
    {
      icon: Bell,
      title: "Get Notifications",
      description: "Receive alerts when it's almost your turn",
      color: "bg-primary",
    },
    {
      icon: QrCode,
      title: "Check-in with QR",
      description: "Present your personal QR code for instant check-in",
      color: "bg-success",
    },
  ];

  const clinicSteps = [
    {
      icon: LogIn,
      title: "Login to Dashboard",
      description: "Access your clinic admin panel to manage operations",
      color: "bg-secondary",
    },
    {
      icon: Users,
      title: "Manage Queue",
      description: "View and update patient queue in real-time",
      color: "bg-secondary",
    },
    {
      icon: QrCode,
      title: "Scan Patient QR",
      description: "Scan patient QR codes for instant check-in",
      color: "bg-secondary",
    },
    {
      icon: RefreshCw,
      title: "Update Wait Times",
      description: "Keep wait times accurate with simple updates",
      color: "bg-secondary",
    },
    {
      icon: Bell,
      title: "Send Notifications",
      description: "Communicate with patients about their queue status",
      color: "bg-success",
    },
  ];

  const currentSteps = activeTab === "patient" ? patientSteps : clinicSteps;

  return (
    <motion.section
      ref={ref}
      initial="initial"
      animate={controls}
      variants={fadeInUp}
      className="py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h3 className="text-responsive-lg font-bold text-gray-900 mb-6">How It Works</h3>
          </motion.div>
          {/* Tab Navigation */}
          <motion.div
            variants={staggerContainer}
            className="flex justify-center mb-12"
          >
            <div className="glass p-1 rounded-lg">
              <Button
                variant={activeTab === "patient" ? "default" : "ghost"}
                onClick={() => setActiveTab("patient")}
                className={cn(
                  "px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 hover-lift",
                  activeTab === "patient" ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg" : "text-gray-700 hover:text-primary hover:bg-white/50"
                )}
                data-testid="tab-patient"
              >
                <Users className="h-4 w-4 mr-2" />
                For Patients
              </Button>
              <Button
                variant={activeTab === "clinic" ? "default" : "ghost"}
                onClick={() => setActiveTab("clinic")}
                className={cn(
                  "px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 hover-lift",
                  activeTab === "clinic" ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg" : "text-gray-700 hover:text-primary hover:bg-white/50"
                )}
                data-testid="tab-clinic"
              >
                <Hospital className="h-4 w-4 mr-2" />
                For Clinics
              </Button>
            </div>
          </motion.div>

          {/* Steps */}
          <motion.div
            variants={staggerContainer}
            className="space-y-8"
          >
            <div className={cn(
              "grid gap-6",
              "md:grid-cols-3 lg:grid-cols-5"
            )}>
              {currentSteps.map((step, index) => (
                <motion.div key={index} variants={scaleIn}>
                  <Card className={`text-center group hover:shadow-lg transition-all duration-300 flex flex-col ${index === currentSteps.length - 1 ? '' : 'h-[220px]'}`} data-testid={`step-${activeTab}-${index}`}>
                    <CardHeader className="pb-4">
                      <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 hover-glow`}>
                        <step.icon className="text-white h-4 w-4" />
                      </div>
                      <div className={`w-full h-1 ${step.color} rounded mb-4 transition-all duration-500 group-hover:h-2`}></div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-center justify-center px-4">
                      <CardDescription className="text-sm leading-relaxed">{step.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
