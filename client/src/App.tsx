import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Auth from "@/pages/auth";

import Clinics from "@/pages/clinics";
import Patients from "@/pages/patients";
import About from "@/pages/about";
import SymptomAnalysis from "@/pages/symptom-analysis";
import Profile from "@/pages/profile";
import UserDashboard from "@/pages/UserDashboard";
import PatientInfo from "@/pages/PatientInfo";
import QueueStatus from "@/pages/queue-status";

import NotFound from "@/pages/not-found";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Chatbot from "@/components/ui/chatbot";

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/patient-info/:id" component={PatientInfo} />
      <Route path="/clinics" component={Clinics} />
      <Route path="/about" component={About} />
      <Route path="/queue-status" component={QueueStatus} />
      {user ? (
        <>
          <Route path="/dashboard" component={UserDashboard} />
          <Route path="/profile" component={Profile} />
          <Route path="/patients" component={Patients} />
          <Route path="/symptom-analysis" component={SymptomAnalysis} />
        </>
      ) : (
        <Route path="*" component={Home} />
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Router />
      </main>
      <Footer />
      {user && <Chatbot />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="find-my-clinic-theme" enableSystem={false} disableTransitionOnChange>
        <AuthProvider>
          <TooltipProvider>
            <AppContent />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
