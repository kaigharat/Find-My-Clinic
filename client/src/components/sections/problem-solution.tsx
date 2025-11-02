import { Clock, UserX, AlertTriangle, MapPin, Smartphone, QrCode } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FeatureCard from "@/components/ui/feature-card";

export default function ProblemSolution() {
  const problems = [
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
      color: "bg-blue-100",
      iconColor: "text-blue-500",
    },
  ];

  const solutions = [
    {
      icon: MapPin,
      title: "Real-Time Clinic Discovery",
      description: "Find nearby clinics instantly with live wait times and availability status.",
      color: "bg-primary",
    },
    {
      icon: Smartphone,
      title: "Digital Queue Management",
      description: "Get your queue token remotely and receive notifications when it's your turn.",
      color: "bg-secondary",
    },
    {
      icon: QrCode,
      title: "Personal QR Code Generator",
      description: "Generate a personal QR code to instantly share your details and speed up access.",
      color: "bg-success",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* The Problem */}
          <div className="text-center mb-16 animate-fade-in">
            <h3 className="text-responsive-lg font-bold text-gray-900 mb-6">The Problem with Current Clinic Visits</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {problems.map((problem, index) => (
                <Card key={index} className="glass-card hover-lift animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }} data-testid={`problem-card-${index}`}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 ${problem.color} rounded-lg flex items-center justify-center mb-4 mx-auto hover:scale-110 transition-transform duration-300`}>
                      <problem.icon className={`${problem.iconColor} h-6 w-6`} />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{problem.title}</h4>
                    <p className="text-gray-600">{problem.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Our Solution */}
          <Card className="glass-card p-8 md:p-12 hover-lift animate-fade-in">
            <div className="text-center mb-12">
              <h3 className="text-responsive-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">Our Smart Solution</h3>
              <p className="text-responsive text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Find My Clinic bridges the information gap in local healthcare with real-time queue management
                and intelligent wait time predictions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-up">
                <img
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                  alt="Smartphone displaying healthcare app interface"
                  className="rounded-xl shadow-lg w-full object-cover hover:shadow-2xl transition-shadow duration-500"
                />
              </div>

              <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {solutions.map((solution, index) => (
                  <div key={index} className="flex items-start space-x-4 group" data-testid={`solution-item-${index}`}>
                    <div className={`w-8 h-8 ${solution.color} rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300 hover-glow`}>
                      <solution.icon className="text-white h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">{solution.title}</h4>
                      <p className="text-gray-600">{solution.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
