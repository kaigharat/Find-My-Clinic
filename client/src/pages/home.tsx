import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
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
  Github
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import type { ClinicStats } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import yashodhanPhoto from "@/images/yash.jpeg";
import kaiPhoto from "@/images/Kai.jpeg";
import swaraPhoto from "@/images/swara.jpeg";
import img1 from "@/images/pic 1.jpeg";
import phoneImg from "@/images/phone.png";
import HowItWorks from "@/components/sections/how-it-works";

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

export default function Home() {
  const { user } = useAuth();
  const { ref: heroRef, controls: heroControls } = useScrollAnimation();
  const { ref: problemRef, controls: problemControls } = useScrollAnimation();
  const { ref: solutionRef, controls: solutionControls } = useScrollAnimation();
  const { ref: clinicFinderRef, controls: clinicFinderControls } = useScrollAnimation();
  const { ref: featuresRef, controls: featuresControls } = useScrollAnimation();
  const { ref: forClinicsRef, controls: forClinicsControls } = useScrollAnimation();
  const { ref: technologyRef, controls: technologyControls } = useScrollAnimation();
  const { ref: teamRef, controls: teamControls } = useScrollAnimation();

  const { data: stats } = useQuery<ClinicStats>({
    queryKey: ["stats"],
    queryFn: async () => {
      const { count: clinicsConnected, error: clinicsError } = await supabase
        .from('clinics')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (clinicsError) throw clinicsError;

      const { count: patientsServed, error: tokensError } = await supabase
        .from('queue_tokens')
        .select('*', { count: 'exact', head: true });

      if (tokensError) throw tokensError;

      const { data: clinics, error: avgError } = await supabase
        .from('clinics')
        .select('current_wait_time')
        .eq('is_active', true);

      if (avgError) throw avgError;

      const avgWaitTime = clinics && clinics.length > 0
        ? Math.round(clinics.reduce((sum, clinic) => sum + (clinic.current_wait_time || 0), 0) / clinics.length)
        : 0;

      return {
        clinicsConnected: clinicsConnected || 0,
        patientsServed: patientsServed || 0,
        avgTimeSaved: `${Math.max(120 - avgWaitTime, 0)} min`
      };
    },
  });

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0" style={{ backgroundImage: `url(${img1})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed', filter: 'blur(5px)' }}></div>
      <div className="relative z-10">

      {/* ===== HERO SECTION ===== */}
      <motion.section
        ref={heroRef}
        initial="initial"
        animate={heroControls}
        variants={fadeInUp}
        className="relative py-20 lg:py-32 overflow-hidden"
      >


        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate={heroControls}
              className="text-center mb-16"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight"
              >
                Stop Waiting,<br />
                <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                  Start Healing
                </span>
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                Find nearby clinics, view real-time wait times, and join queues digitally.
                Make healthcare visits predictable and stress-free.
              </motion.p>

              <motion.div
                variants={staggerContainer}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              >
                {user ? (
                  <>
                    <motion.div variants={scaleIn}>
                      <Link href="/dashboard">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-4 rounded-full font-semibold hover:scale-105"
                        >
                          <User className="h-5 w-5 mr-2" />
                          Go to Dashboard
                        </Button>
                      </Link>
                    </motion.div>
                    <motion.div variants={scaleIn}>
                      <Link href="/patients">
                        <Button
                          //variant="outline"
                          size="lg"
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-4 rounded-full font-semibold hover:scale-105"
                          //className="border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                          <Search className="h-5 w-5 mr-2" />
                          Find a Clinic Now
                        </Button>
                      </Link>
                    </motion.div>
                    <motion.div variants={scaleIn}>
                      <Link href="/symptom-analysis">
                        <Button
                          //variant="outline"
                          size="lg"
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-4 rounded-full font-semibold hover:scale-105"
                          //className="border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                          <Search className="h-5 w-5 mr-2" />
                          Analyze Symptoms
                        </Button>
                      </Link>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div variants={scaleIn}>
                      <Link href="/auth">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-4 rounded-full font-semibold hover:scale-105"
                        >
                          <LogIn className="h-5 w-5 mr-2" />
                          Login / Sign Up
                        </Button>
                      </Link>
                    </motion.div>
                    <motion.div variants={scaleIn}>
                      <Link href="/clinics">
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-2 border-slate-300 text-slate-900 hover:bg-slate-900 hover:text-white text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                          <Search className="h-5 w-5 mr-2" />
                          For Clinics
                        </Button>
                      </Link>
                    </motion.div>
                    <motion.div variants={scaleIn}>
                      <Link href="/about">
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-2 border-slate-300 text-slate-900 hover:bg-slate-900 hover:text-white text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                          <Search className="h-5 w-5 mr-2" />
                          About
                        </Button>
                      </Link>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              variants={scaleIn}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats?.clinicsConnected || 0}+
                  </div>
                  <div className="text-sm text-slate-600">Clinics Connected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats?.avgTimeSaved || "0 min"}
                  </div>
                  <div className="text-sm text-slate-600">Avg. Time Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-700">
                    {stats?.patientsServed || 0}+
                  </div>
                  <div className="text-sm text-slate-600">Patients Served</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ===== THE PROBLEM SECTION ===== */}
      <motion.section
        ref={problemRef}
        initial="initial"
        animate={problemControls}
        variants={fadeInUp}
        className="py-20 relative"
      >

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                The Problem with Current Clinic Visits
              </h2>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: Clock,
                  title: "Wasted Time in Queues",
                  description: "Hours spent waiting in crowded clinics with no idea when you'll be seen.",
                  color: "bg-red-100",
                  iconColor: "text-red-500",
                },
                {
                  icon: UserX,
                  title: "Staff Burnout",
                  description: "Healthcare workers overwhelmed by manual queue management and administrative chaos.",
                  color: "bg-orange-100",
                  iconColor: "text-orange-500",
                },
                {
                  icon: AlertTriangle,
                  title: "Poor Patient Experience",
                  description: "Unpredictable wait times leading to stress and frustration for patients seeking care.",
                  color: "bg-yellow-100",
                  iconColor: "text-yellow-600",
                },
              ].map((problem, index) => (
                <motion.div key={index} variants={scaleIn}>
                  <Card className="bg-white border border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group min-h-[350px]">
                    <CardContent className="p-8 text-center">
                      <div className={`w-16 h-16 ${problem.color} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                        <problem.icon className={`${problem.iconColor} h-8 w-8`} />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-4">{problem.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{problem.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ===== OUR SMART SOLUTION ===== */}
      <motion.section
        ref={solutionRef}
        initial="initial"
        animate={solutionControls}
        variants={fadeInUp}
        className="py-20 relative"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Our Smart Solution
              </h2>
              <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
                Find My Clinic bridges the information gap in local healthcare with real-time queue management
                and intelligent wait time predictions.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <motion.div variants={fadeInUp}>
                <img
                  src={phoneImg}
                  alt="Smartphone displaying healthcare app interface"
                  className="rounded-3xl shadow-2xl w-full object-cover hover:shadow-3xl transition-shadow duration-500"
                />
              </motion.div>

              <motion.div variants={staggerContainer} className="space-y-8">
                {[
                  {
                    icon: MapPin,
                    title: "Real-Time Clinic Discovery",
                    description: "Find nearby clinics instantly with live wait times and availability status.",
                    color: "bg-teal-500",
                  },
                  {
                    icon: Smartphone,
                    title: "Digital Queue Management",
                    description: "Get your queue token remotely and receive notifications when it's your turn.",
                    color: "bg-blue-500",
                  },
                  {
                    icon: QrCode,
                    title: "Personal QR Code Generator",
                    description: "Generate a personal QR code to instantly share your details and speed up access.",
                    color: "bg-slate-600",
                  },
                ].map((solution, index) => (
                  <motion.div key={index} variants={fadeInUp}>
                    <Card className="bg-white border border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 ${solution.color} rounded-xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                            <solution.icon className="text-white h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{solution.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{solution.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ===== HOW IT WORKS ===== */}
      <HowItWorks />

      {/* ===== FIND CLINICS NEAR YOU ===== */}
      <motion.section
        ref={clinicFinderRef}
        initial="initial"
        animate={clinicFinderControls}
        variants={fadeInUp}
        className="py-20 relative"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Find Clinics Near You</h2>
              <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">Real-time availability and wait times at your fingertips</p>
            </motion.div>

            <motion.div
              variants={scaleIn}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200"
            >
              {/*<div className="p-8 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Enter your location..."
                      className="w-full border-2 border-slate-300 focus:border-blue-500 transition-colors rounded-xl px-4 py-3 text-lg"
                    />
                  </div>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 rounded-xl font-semibold hover:scale-105"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>*/}

              {/* Mock Map Interface */}
              <div className="relative h-96 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600"
                  alt="City map view with healthcare facility markers"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ===== WHAT MAKES US DIFFERENT ===== */}
      <motion.section
        ref={featuresRef}
        initial="initial"
        animate={featuresControls}
        variants={fadeInUp}
        className="py-20 relative"
      >

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">What Makes Us Different</h2>
              <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">Smart, inclusive, and accessible healthcare technology</p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: "qrcode",
                  title: "Personal QR Code Generator",
                  description: "Generate a personal QR code to instantly share your details and speed up access.",
                  badge: "Digital + Physical Access",
                  gradient: "from-teal-500 to-blue-500",
                },
                {
                  icon: "brain",
                  title: "Smart Predictions",
                  description: "AI-powered predictive intelligence analyzes historical data and current patterns to provide the most accurate wait time estimates.",
                  badge: "95%+ Accuracy Rate",
                  gradient: "from-blue-500 to-teal-500",
                },
                {
                  icon: "message-square",
                  title: "Lite Mode Available",
                  description: "WhatsApp and SMS integration for clinics with limited tech infrastructure, making our platform accessible to every healthcare provider.",
                  badge: "No App Required",
                  gradient: "from-slate-600 to-teal-500",
                },
              ].map((feature, index) => (
                <motion.div key={index} variants={scaleIn}>
                  <Card className="bg-white border border-slate-200 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 group overflow-hidden min-h-[350px]">
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          {feature.icon === "qrcode" && <QrCode className="text-white h-7 w-7" />}
                          {feature.icon === "brain" && <Brain className="text-white h-7 w-7" />}
                          {feature.icon === "message-square" && <MessageSquare className="text-white h-7 w-7" />}
                        </div>
                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                          {feature.badge}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ===== TRANSFORM YOUR CLINIC OPERATIONS ===== */}
      <motion.section
        ref={forClinicsRef}
        initial="initial"
        animate={forClinicsControls}
        variants={fadeInUp}
        className="py-20 relative"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Transform Your Clinic Operations</h2>
              <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">Reduce administrative burden and improve patient satisfaction</p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid lg:grid-cols-2 gap-12 items-start"
            >
              <motion.div variants={fadeInUp} className="flex items-end justify-center">
                <img
                  src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Modern clinic reception area with digital check-in system"
                  className="rounded-3xl shadow-2xl w-full object-cover hover:shadow-3xl transition-shadow duration-500"
                />
              </motion.div>

              <motion.div variants={staggerContainer} className="space-y-8">
                {[
                  {
                    icon: TrendingUp,
                    title: "Efficient Digital Management",
                    description: "Simple admin panel or WhatsApp bot to manage queues, update wait times, and scan patient QR codes for instant check-in.",
                    color: "bg-teal-500",
                  },
                  {
                    icon: Users,
                    title: "Reduced Staff Burnout",
                    description: "Eliminate manual queue management stress and reduce administrative chaos with automated patient flow.",
                    color: "bg-green-500",
                  },
                  {
                    icon: Settings,
                    title: "Better Resource Allocation",
                    description: "Optimize staff scheduling and improve operational efficiency with predictive patient flow data.",
                    color: "bg-blue-500",
                  },
                ].map((benefit, index) => (
                  <motion.div key={index} variants={fadeInUp}>
                    <Card className="bg-white border border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 ${benefit.color} rounded-xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                            <benefit.icon className="text-white h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{benefit.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                <motion.div variants={scaleIn} className="pt-6">
                  <Link href="/clinics">
                    <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 rounded-full font-semibold hover:scale-105">
                      Request a Demo
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ===== BUILT ON ROBUST TECHNOLOGY ===== */}
      <motion.section
        ref={technologyRef}
        initial="initial"
        animate={technologyControls}
        variants={fadeInUp}
        className="py-20"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Built on Robust Technology</h2>
              <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
                Enterprise-grade architecture designed for scalability, reliability, and seamless user experience
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8 mb-12"
            >
              {[
                {
                  icon: Server,
                  title: "Microservices Architecture",
                  description: "Scalable and reliable system architecture ensuring 99.9% uptime and seamless performance.",
                },
                {
                  icon: Zap,
                  title: "Real-Time Processing",
                  description: "Lightning-fast data processing with sub-second response times for live queue updates.",
                },
                {
                  icon: Shield,
                  title: "Enterprise Security",
                  description: "Bank-grade security with end-to-end encryption and compliance with healthcare data standards.",
                },
              ].map((tech, index) => (
                <motion.div key={index} variants={scaleIn}>
                  <Card className="bg-white border border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                    <CardContent className="p-8 text-center">
                      <div className={`w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <tech.icon className="text-white h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">{tech.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{tech.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ===== OUR TEAM ===== */}
      <motion.section
        ref={teamRef}
        initial="initial"
        animate={teamControls}
        variants={fadeInUp}
        className="py-20 relative"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Our Team</h2>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">Meet the passionate team behind Find My Clinic</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Yashodhan Rajapkar",
                role: "Founder & Lead Developer",
                image: yashodhanPhoto,
                bio: "Innovative founder and lead developer with a passion for creating impactful technology solutions.",
              },
              {
                name: "Kaivalya Gharat",
                role: "Co-Founder & Developer",
                image: kaiPhoto,
                bio: "Creative co-founder and developer dedicated to building user-friendly applications that solve real-world problems.",
              },
              {
                name: "Swarali Mahishi",
                role: "Co-Founder & Developer",
                image: swaraPhoto,
                bio: "Dedicated co-founder and developer focused on developing accessible and inclusive technology for everyone.",
              },
            ].map((member, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="bg-white border border-slate-200 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-slate-900 mb-1">{member.name}</h3>
                      <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                      <div className="flex gap-2 justify-center">
                        {(member.name === "Yashodhan Rajapkar" || member.name === "Kaivalya Gharat" || member.name === "Swarali Mahishi") && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                            onClick={() => {
                              const urls = {
                                "Yashodhan Rajapkar": "https://www.linkedin.com/in/yashodhan-rajapkar-807014284",
                                "Kaivalya Gharat": "https://www.linkedin.com/in/kaivalya-gharat-296704202/",
                                "Swarali Mahishi": "https://www.linkedin.com/in/swarali-a-mahishi-2759262a9/"
                              };
                              window.open(urls[member.name as keyof typeof urls], '_blank');
                            }}
                          >
                            <Linkedin className="h-4 w-4 mr-2" />
                            LinkedIn
                          </Button>
                        )}
                        {(member.name === "Yashodhan Rajapkar" || member.name === "Kaivalya Gharat" || member.name === "Swarali Mahishi") && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                            onClick={() => {
                              const githubUrls = {
                                "Yashodhan Rajapkar": "https://github.com/yash9769",
                                "Kaivalya Gharat": "https://github.com/kaigharat",
                                "Swarali Mahishi": "https://github.com/swara2402"
                              };
                              window.open(githubUrls[member.name as keyof typeof githubUrls], '_blank');
                            }}
                          >
                            <Github className="h-4 w-4 mr-2" />
                            GitHub
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      </div>
    </div>
  );
}
