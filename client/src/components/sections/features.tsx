import { QrCode, Brain, MessageSquare } from "lucide-react";
import FeatureCard from "@/components/ui/feature-card";
import type { FeatureItem } from "@/lib/types";

export default function Features() {
  const features: FeatureItem[] = [
    {
      icon: "qrcode",
      title: "Hybrid QR System",
      description: "A dual-QR system: scan a clinic's public QR to join the queue, then use your personal, encrypted QR code for a fast, contactless check-in.",
      badge: "Digital + Physical Access",
      gradient: "from-primary to-secondary",
    },
    {
      icon: "brain",
      title: "Smart Predictions",
      description: "AI-powered predictive intelligence analyzes historical data and current patterns to provide the most accurate wait time estimates.",
      badge: "95%+ Accuracy Rate",
      gradient: "from-secondary to-success",
    },
    {
      icon: "message-square",
      title: "Lite Mode Available",
      description: "WhatsApp and SMS integration for clinics with limited tech infrastructure, making our platform accessible to every healthcare provider.",
      badge: "No App Required",
      gradient: "from-success to-accent",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-primary/5 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h3 className="text-responsive-lg font-bold text-gray-900 mb-6">What Makes Us Different</h3>
            <p className="text-responsive text-gray-600">Smart, inclusive, and accessible healthcare technology</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
