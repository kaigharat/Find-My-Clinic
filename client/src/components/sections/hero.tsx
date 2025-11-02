import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Hospital, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import type { ClinicStats } from "@/lib/types";
import { supabase } from "@/lib/supabase";

export default function Hero() {
  const { user } = useAuth();
  const { data: stats } = useQuery<ClinicStats>({
    queryKey: ["stats"],
    queryFn: async () => {
      // Get clinics count
      const { count: clinicsConnected, error: clinicsError } = await supabase
        .from('clinics')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (clinicsError) throw clinicsError;

      // Get queue tokens count (patients served)
      const { count: patientsServed, error: tokensError } = await supabase
        .from('queue_tokens')
        .select('*', { count: 'exact', head: true });

      if (tokensError) throw tokensError;

      // Get average wait time
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
    <section className="gradient-mesh py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-responsive-xl font-bold text-gray-900 mb-6 leading-tight">
              Stop Waiting,<br />
              <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Start Healing</span>
            </h2>
            <p className="text-responsive text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Find nearby clinics, view real-time wait times, and join queues digitally.
              Make healthcare visits predictable and stress-free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105 transition-all duration-300 text-lg px-8 py-4 btn-modern"
                      data-testid="button-dashboard-hero"
                    >
                      <User className="h-5 w-5 mr-2" />
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/patients">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white text-lg px-8 py-4 transition-all duration-300 hover-lift"
                      data-testid="button-find-clinic-hero"
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Find a Clinic Now
                    </Button>
                  </Link>
                  <Link href="/symptom-analysis">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-primary text-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white hover:border-transparent text-lg px-8 py-4 transition-all duration-300 hover-lift"
                      data-testid="button-symptom-analysis-hero"
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Analyze Symptoms
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105 transition-all duration-300 text-lg px-8 py-4 btn-modern"
                      data-testid="button-login-hero"
                    >
                      <LogIn className="h-5 w-5 mr-2" />
                      Login / Sign Up
                    </Button>
                  </Link>
                  <Link href="/patients">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white text-lg px-8 py-4 transition-all duration-300 hover-lift"
                      data-testid="button-find-clinic-hero"
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Find a Clinic Now
                    </Button>
                  </Link>
                  <Link href="/symptom-analysis">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-primary text-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white hover:border-transparent text-lg px-8 py-4 transition-all duration-300 hover-lift"
                      data-testid="button-symptom-analysis-hero"
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Analyze Symptoms
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative animate-slide-up">
            <img
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600"
              alt="Modern clinic waiting room with comfortable seating"
              className="rounded-2xl shadow-2xl w-full object-cover h-[400px] hover:shadow-3xl transition-shadow duration-500"
            />

            {/* Overlay stats */}
            <div className="absolute -bottom-6 left-6 right-6">
              <div className="glass-card rounded-xl p-6 grid grid-cols-3 gap-4 hover-lift">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary animate-scale-in" data-testid="stat-clinics">
                    {stats?.clinicsConnected || 0}+
                  </div>
                  <div className="text-sm text-gray-600">Clinics Connected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success animate-scale-in" style={{ animationDelay: '0.1s' }} data-testid="stat-time-saved">
                    {stats?.avgTimeSaved || "0 min"}
                  </div>
                  <div className="text-sm text-gray-600">Avg. Time Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary animate-scale-in" style={{ animationDelay: '0.2s' }} data-testid="stat-patients">
                    {stats?.patientsServed || 0}+
                  </div>
                  <div className="text-sm text-gray-600">Patients Served</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
