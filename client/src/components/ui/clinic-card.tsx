import { MapPin, Clock, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Clinic } from "@shared/schema";

interface ClinicCardProps {
  clinic: Clinic;
}

export default function ClinicCard({ clinic }: ClinicCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-success text-success-foreground";
      case "busy": return "bg-yellow-500 text-white";
      case "closed": return "bg-destructive text-destructive-foreground";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <Card className="glass-card border border-gray-200/50 hover-lift animate-scale-in" data-testid={`map-clinic-card-${clinic.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-semibold text-gray-900 hover:text-primary transition-colors" data-testid={`map-clinic-name-${clinic.id}`}>
              {clinic.name}
            </h4>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1 text-primary" />
              {clinic.address}
            </p>
          </div>
          <Badge className={`${getStatusColor(clinic.status)} hover-glow transition-all duration-300`} data-testid={`map-clinic-status-${clinic.id}`}>
            {clinic.status.charAt(0).toUpperCase() + clinic.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="flex items-center text-lg font-bold text-primary hover:scale-105 transition-transform">
                  <Clock className="h-3 w-3 mr-1" />
                  <span data-testid={`map-clinic-wait-time-${clinic.id}`}>{clinic.currentWaitTime} min</span>
                </div>
                <div className="text-xs text-gray-500">Wait Time</div>
              </div>
              <div className="text-center">
                <div className="flex items-center text-lg font-bold text-secondary hover:scale-105 transition-transform">
                  <Users className="h-3 w-3 mr-1" />
                  <span data-testid={`map-clinic-queue-size-${clinic.id}`}>{clinic.queueSize}</span>
                </div>
                <div className="text-xs text-gray-500">In Queue</div>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-accent to-blue-500 hover:shadow-lg text-white text-xs px-3 py-2 btn-modern hover-lift"
              disabled={clinic.status === "closed"}
              data-testid={`map-button-join-queue-${clinic.id}`}
            >
              Join Queue
            </Button>
          </div>

          {clinic.doctors && clinic.doctors.length > 0 && (
            <div className="border-t border-gray-200/50 pt-3">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <User className="h-3 w-3 mr-1" />
                <span className="font-medium">Available Doctors ({clinic.doctors.filter(d => d.isActive).length})</span>
              </div>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {clinic.doctors.filter(d => d.isActive).slice(0, 3).map((doctor) => (
                  <div key={doctor.id} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-900">{doctor.name}</span>
                    {doctor.rating && (
                      <span className="text-yellow-600">★ {doctor.rating.toFixed(1)}</span>
                    )}
                  </div>
                ))}
                {clinic.doctors.filter(d => d.isActive).length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{clinic.doctors.filter(d => d.isActive).length - 3} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
