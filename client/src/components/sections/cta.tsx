import { User, Hospital } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CTA() {
  return (
    <section className="py-20 gradient-glow text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h3 className="text-responsive-xl font-bold mb-6">Ready to Transform Healthcare Visits?</h3>
          <p className="text-responsive mb-10 opacity-90 leading-relaxed">
            Join thousands of patients and hundreds of clinics already using Find My Clinic
            to make healthcare more accessible and efficient.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/patients">
              <Button
                size="lg"
                className="glass bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover-lift px-8 py-4 text-lg font-semibold btn-modern"
                data-testid="button-patient-signup-cta"
              >
                <User className="h-5 w-5 mr-2" />
                Get Started as Patient
              </Button>
            </Link>
            <Link href="/clinics">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 hover-lift px-8 py-4 text-lg font-semibold btn-modern"
                data-testid="button-clinic-signup-cta"
              >
                <Hospital className="h-5 w-5 mr-2" />
                Register Your Clinic
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-sm opacity-75 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p>Have questions? <a href="mailto:yashodhan.rajapkar@gmail.com" className="underline hover:no-underline hover:text-white transition-colors">Contact our team</a></p>
          </div>
        </div>
      </div>
    </section>
  );
}
