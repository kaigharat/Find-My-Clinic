import { useState, useEffect } from "react";
import { MapPin, Navigation, Phone, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LocationSelectorProps {
  onLocationSelect: (area: string) => void;
  onLocationDetect: (coords: { latitude: number; longitude: number }) => void;
  selectedArea?: string;
}

export default function LocationSelector({ 
  onLocationSelect, 
  onLocationDetect, 
  selectedArea 
}: LocationSelectorProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const popularAreas = [
    { name: "South Mumbai", areas: ["Fort", "Colaba", "Marine Drive", "Tardeo", "Grant Road"] },
    { name: "Central Mumbai", areas: ["Dadar", "Parel", "Matunga", "Sion", "Kurla"] },
    { name: "Bandra & Khar", areas: ["Bandra West", "Bandra East", "Khar West", "Linking Road"] },
    { name: "Andheri", areas: ["Andheri West", "Andheri East", "Versova", "Lokhandwala", "Oshiwara"] },
    { name: "Western Suburbs", areas: ["Juhu", "Vile Parle", "Santacruz", "Goregaon", "Malad", "Borivali"] },
    { name: "Eastern Suburbs", areas: ["Powai", "Vikhroli", "Ghatkopar", "Mulund", "Chembur"] },
    { name: "Navi Mumbai", areas: ["Vashi", "CBD Belapur", "Nerul", "Kharghar", "Panvel", "Airoli"] },
  ];

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }

    setIsDetecting(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetecting(false);
        onLocationDetect({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        setIsDetecting(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access denied. Please allow location access and try again.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out. Please try again.");
            break;
          default:
            setLocationError("An unknown error occurred while detecting location.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const callAmbulance = () => {
    // In a real app, this would integrate with emergency services
    const emergencyNumber = "108"; // Mumbai Emergency Number
    if (window.confirm(`This will call Mumbai Emergency Services (108). Continue?`)) {
      window.location.href = `tel:${emergencyNumber}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Location Detection */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Navigation className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Auto-Detect Location</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Get clinics near your current location</p>
              </div>
            </div>
            <Button
              onClick={detectLocation}
              disabled={isDetecting}
              className="bg-primary hover:bg-primary/90"
              data-testid="button-detect-location"
            >
              {isDetecting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Detecting...
                </div>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Use My Location
                </>
              )}
            </Button>
          </div>
          
          {locationError && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{locationError}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Ambulance */}
      <Card className="border-2 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-red-700 dark:text-red-300">Emergency Ambulance</h3>
                <p className="text-sm text-red-600 dark:text-red-400">Call 108 for immediate medical assistance</p>
              </div>
            </div>
            <Button
              onClick={callAmbulance}
              className="bg-red-500 hover:bg-red-600 text-white"
              data-testid="button-call-ambulance"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call 108
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Area Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Or choose your area</h3>
        <div className="space-y-4">
          {popularAreas.map((region, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">{region.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {region.areas.map((area, areaIndex) => (
                    <Badge
                      key={areaIndex}
                      variant={selectedArea === area ? "default" : "secondary"}
                      className={`cursor-pointer transition-colors ${
                        selectedArea === area 
                          ? "bg-primary text-white hover:bg-primary/90" 
                          : "hover:bg-primary/10 hover:text-primary"
                      }`}
                      onClick={() => onLocationSelect(area)}
                      data-testid={`area-${area.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {area}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}