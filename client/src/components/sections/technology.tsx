import { Server, Zap, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Technology() {
  const techFeatures = [
    {
      icon: Server,
      title: "Microservices Architecture",
      description: "Scalable and reliable system architecture ensuring 99.9% uptime and seamless performance.",
    },
    {
      icon: Zap,
      title: "Real-time Communication",
      description: "WebSockets and Twilio integration for instant notifications via SMS and WhatsApp.",
    },
    {
      icon: Smartphone,
      title: "Modern Tech Stack",
      description: "React Native, Node.js, Python, and MongoDB powering a fast, responsive platform.",
    },
  ];

  const techStack = [
    { name: "React Native", icon: "⚛️" },
    { name: "Node.js", icon: "🟢" },
    { name: "Python", icon: "🐍" },
    { name: "MongoDB", icon: "🍃" },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center animate-fade-in">
          <h3 className="text-responsive-lg font-bold mb-6">Built on Robust Technology</h3>
          <p className="text-responsive text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Enterprise-grade architecture designed for scalability, reliability, and seamless user experience
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {techFeatures.map((feature, index) => (
              <Card key={index} className="glass-card bg-gray-800/50 border-gray-700/50 hover-lift animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }} data-testid={`tech-feature-${index}`}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300 hover-glow">
                    <feature.icon className="text-white h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-semibold mb-3 text-white">{feature.title}</h4>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tech Stack Icons */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-8 border-t border-gray-800/50 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {techStack.map((tech, index) => (
              <div key={index} className="text-center opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300 group" data-testid={`tech-stack-${index}`}>
                <div className="text-3xl mb-2 group-hover:animate-bounce">{tech.icon}</div>
                <div className="text-sm text-gray-300 group-hover:text-white transition-colors">{tech.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
