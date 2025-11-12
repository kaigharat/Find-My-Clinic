import { useState, useEffect } from "react";
import { MapPin, Clock, Users, User, Navigation, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";
import { getTranslatedName, getTranslatedAddress } from "@/lib/utils";
import type { Clinic } from "@shared/schema";

interface ClinicCardProps {
  clinic: Clinic;
}

export default function ClinicCard({ clinic }: ClinicCardProps) {
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const [isInQueue, setIsInQueue] = useState(false);

  // Check if user has already joined this clinic's queue
  const checkQueueStatus = () => {
    const userTokens = JSON.parse(localStorage.getItem('userTokens') || '[]');
    return userTokens.some((token: any) => token.clinicId === clinic.id);
  };

  useEffect(() => {
    setIsInQueue(checkQueueStatus());
  }, [clinic.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-success text-success-foreground";
      case "busy": return "bg-yellow-500 text-white";
      case "closed": return "bg-destructive text-destructive-foreground";
      default: return "bg-gray-500 text-white";
    }
  };

  const handleJoinQueue = async () => {
    if (isInQueue) {
      toast({
        title: "Already in Queue",
        description: "Already in Queue - You have already joined the queue for this clinic",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create an anonymous patient record
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .insert([{
          name: 'Anonymous Patient',
          phone: '0000000000',
          email: null,
        }])
        .select()
        .single();

      if (patientError) throw patientError;

      // Create a queue token for the patient
      const { data: token, error } = await supabase
        .from('queue_tokens')
        .insert([{
          clinic_id: clinic.id,
          patient_id: patient.id,
          token_number: Math.floor(Math.random() * 1000) + 1,
          status: 'waiting',
          estimated_wait_time: clinic.currentWaitTime || 30,
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Joined Queue Successfully!",
        description: `Your token number is ${token.token_number}. Estimated wait time: ${token.estimated_wait_time} minutes.`,
      });

      // Store token in localStorage for dashboard access
      const userTokens = JSON.parse(localStorage.getItem('userTokens') || '[]');
      userTokens.push({
        tokenNumber: token.token_number,
        clinicId: clinic.id,
        doctorId: null, // No specific doctor selected
        createdAt: token.created_at
      });
      localStorage.setItem('userTokens', JSON.stringify(userTokens));

      // Update state to reflect queue status
      setIsInQueue(true);

    } catch (error) {
      console.error('Queue joining error:', error);
      toast({
        title: "Failed to Join Queue",
        description: "Unable to join the queue. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGetDirections = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const clinicLat = parseFloat(clinic.latitude);
          const clinicLng = parseFloat(clinic.longitude);

          // Open Google Maps with directions
          const googleMapsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${clinicLat},${clinicLng}`;
          window.open(googleMapsUrl, '_blank');
        },
        (error) => {
          console.error('Error getting user location:', error);
          // Fallback: open Google Maps to clinic location only
          const clinicLat = parseFloat(clinic.latitude);
          const clinicLng = parseFloat(clinic.longitude);
          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${clinicLat},${clinicLng}`;
          window.open(googleMapsUrl, '_blank');
        }
      );
    } else {
      // Fallback: open Google Maps to clinic location only
      const clinicLat = parseFloat(clinic.latitude);
      const clinicLng = parseFloat(clinic.longitude);
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${clinicLat},${clinicLng}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  return (
    <Card className="glass-card border border-gray-200/50 hover-lift animate-scale-in" data-testid={`map-clinic-card-${clinic.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-semibold text-gray-900 hover:text-primary transition-colors" data-testid={`map-clinic-name-${clinic.id}`}>
              {getTranslatedName(clinic, i18n)}
            </h4>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1 text-primary" />
              {getTranslatedAddress(clinic, i18n)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Lat: {clinic.latitude}, Lng: {clinic.longitude}
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
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-primary border-primary hover:bg-primary hover:text-white text-xs px-3 py-2"
                onClick={handleGetDirections}
                data-testid={`map-button-get-directions-${clinic.id}`}
              >
                <Navigation className="h-3 w-3 mr-1" />
                Get Directions
              </Button>
              <Button
                size="sm"
                className={`bg-gradient-to-r from-accent to-blue-500 hover:shadow-lg text-white text-xs px-3 py-2 btn-modern hover-lift ${isInQueue ? 'bg-green-500 hover:bg-green-600' : ''}`}
                disabled={clinic.status === "closed"}
                onClick={handleJoinQueue}
                data-testid={`map-button-join-queue-${clinic.id}`}
              >
                {isInQueue ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    In Queue
                  </>
                ) : (
                  'Join Queue'
                )}
              </Button>
            </div>
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
