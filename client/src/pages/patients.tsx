import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Clock, Users, Navigation, User, Star, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Clinic } from "@shared/schema";
import { useDebounce } from "@/hooks/use-debounce";
import { supabase } from "@/lib/supabase";
import loco from "@/images/loco.jpg";



const getStatusColor = (status: string) => {
  switch (status) {
    case "open": return "bg-success text-success-foreground";
    case "busy": return "bg-yellow-500 text-white";
    case "closed": return "bg-destructive text-destructive-foreground";
    default: return "bg-gray-500 text-white";
  }
};

interface ClinicWithDistance extends Clinic {
  distance?: number;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience_years: number;
  rating: number;
  is_available_today: boolean;
  consultation_fee: number;
  bio: string;
}

export default function Patients() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [selectedClinicForDoctors, setSelectedClinicForDoctors] = useState<ClinicWithDistance | null>(null);
  const [isDoctorsDialogOpen, setIsDoctorsDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [userQueueStatus, setUserQueueStatus] = useState<{
    position: number;
    clinicName: string;
    estimatedWaitTime: number;
  } | null>(null);

  // Request location on component mount
  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    setLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationLoading(false);
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        setLocationError(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Query for doctors of selected clinic
  const { data: clinicDoctors = [] } = useQuery({
    queryKey: ["clinic-doctors", selectedClinicForDoctors?.id],
    queryFn: async () => {
      if (!selectedClinicForDoctors?.id) return [];

      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('clinic_id', selectedClinicForDoctors.id)
        .order('rating', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedClinicForDoctors?.id && isDoctorsDialogOpen,
  });

  const { data: clinics = [], isLoading } = useQuery({
    queryKey: ["clinics", debouncedSearchQuery, selectedArea, userLocation],
    queryFn: async () => {
      let query = supabase
        .from('clinics')
        .select('*')
        .eq('is_active', true);

      if (debouncedSearchQuery) {
        query = query.or(`name.ilike.%${debouncedSearchQuery}%,address.ilike.%${debouncedSearchQuery}%`);
      }

      if (selectedArea) {
        query = query.ilike('address', `%${selectedArea}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Add distance calculation and random wait times if user location is available
      let clinicsWithDistance: ClinicWithDistance[] = data.map(clinic => ({
        ...clinic,
        distance: userLocation ? calculateDistance(
          userLocation.lat,
          userLocation.lng,
          parseFloat(clinic.latitude),
          parseFloat(clinic.longitude)
        ) : undefined,
        // Generate random wait time between 5-60 minutes for demo purposes
        currentWaitTime: clinic.currentWaitTime || Math.floor(Math.random() * 56) + 5,
        queueSize: clinic.queueSize || Math.floor(Math.random() * 20) + 1
      }));

      // Sort by distance if location is available, otherwise keep original order
      if (userLocation) {
        clinicsWithDistance.sort((a, b) => {
          if (a.distance === undefined && b.distance === undefined) return 0;
          if (a.distance === undefined) return 1;
          if (b.distance === undefined) return -1;
          return a.distance - b.distance;
        });
      }

      return clinicsWithDistance;
    },
  });

  const handleClinicClick = (clinic: ClinicWithDistance) => {
    setSelectedClinicForDoctors(clinic);
    setIsDoctorsDialogOpen(true);
  };

  const handleDoctorQueueJoin = async (doctor: Doctor) => {
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
          clinic_id: selectedClinicForDoctors?.id,
          patient_id: patient.id,
          token_number: Math.floor(Math.random() * 1000) + 1,
          status: 'waiting',
          estimated_wait_time: Math.max(5, selectedClinicForDoctors?.currentWaitTime ? Math.floor(selectedClinicForDoctors.currentWaitTime / 2) : 10)
        }])
        .select()
        .single();

      if (error) throw error;

      // Store token in localStorage for dashboard access
      const userTokens = JSON.parse(localStorage.getItem('userTokens') || '[]');
      userTokens.push({
        tokenNumber: token.token_number,
        clinicId: selectedClinicForDoctors?.id,
        doctorId: doctor.id,
        createdAt: token.created_at,
        bookingType: 'clinic_finder'
      });
      localStorage.setItem('userTokens', JSON.stringify(userTokens));

      // Set queue status for display
      setUserQueueStatus({
        position: 1,
        clinicName: `${selectedClinicForDoctors?.name} - Dr. ${doctor.name}`,
        estimatedWaitTime: token.estimated_wait_time
      });

      setIsDoctorsDialogOpen(false);
    } catch (error) {
      console.error('Booking error:', error);
      // Fallback to just setting status without database
      setUserQueueStatus({
        position: 1,
        clinicName: `${selectedClinicForDoctors?.name} - Dr. ${doctor.name}`,
        estimatedWaitTime: Math.max(5, selectedClinicForDoctors?.currentWaitTime ? Math.floor(selectedClinicForDoctors.currentWaitTime / 2) : 10)
      });
      setIsDoctorsDialogOpen(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${loco})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${loco})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          filter: 'brightness(0) blur(2px)',
          zIndex: -1
        }}
      ></div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div
            className="text-center mb-12"
          >
            <h1
              className="text-4xl font-bold text-gray-900 mb-6"
            >
              Find Clinics Near You
            </h1>
            <p
              className="text-xl text-gray-600 mb-8"
            >
              Real-time availability and wait times at your fingertips
            </p>

            {/* Queue Status */}
            {userQueueStatus && (
              <Card className="max-w-md mx-auto mb-6 bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">Queue Status</span>
                    </div>
                    <p className="text-blue-800 mb-2">
                      You are #{userQueueStatus.position} in queue at {userQueueStatus.clinicName}
                    </p>
                    <p className="text-sm text-blue-600 mb-3">
                      Estimated wait time: {userQueueStatus.estimatedWaitTime} minutes
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUserQueueStatus(null)}
                      className="border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      Leave Queue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location Status */}
            {locationLoading && (
              <Alert className="max-w-md mx-auto mb-4">
                <Navigation className="h-4 w-4" />
                <AlertDescription>Getting your location...</AlertDescription>
              </Alert>
            )}

            {locationError && (
              <Alert variant="destructive" className="max-w-md mx-auto mb-4">
                <AlertDescription>
                  {locationError}
                  <Button
                    variant="link"
                    className="p-0 h-auto ml-2 text-destructive underline"
                    onClick={requestLocation}
                  >
                    Try again
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {userLocation && (
              <Alert className="max-w-md mx-auto mb-4">
                <Navigation className="h-4 w-4" />
                <AlertDescription>
                  Location detected! Clinics sorted by distance from your location.
                </AlertDescription>
              </Alert>
            )}

            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search clinics by name or area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3"
                  data-testid="input-search-location"
                />
              </div>
            </div>
          </div>

          {/* Clinics Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : clinics.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No clinics found</h3>
              <p className="text-gray-600">Try adjusting your search or check back later.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clinics.map((clinic: ClinicWithDistance) => (
                <Card
                  key={clinic.id}
                  className="hover:shadow-lg border border-gray-200 cursor-pointer"
                  data-testid={`clinic-card-${clinic.id}`}
                  onClick={() => handleClinicClick(clinic)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900" data-testid={`clinic-name-${clinic.id}`}>
                          {clinic.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {clinic.address}
                        </p>
                        {clinic.distance !== undefined && (
                          <p className="text-sm text-blue-600 flex items-center mt-1">
                            <Navigation className="h-4 w-4 mr-1" />
                            {clinic.distance < 1
                              ? `${Math.round(clinic.distance * 1000)}m away`
                              : `${clinic.distance.toFixed(1)} km away`
                            }
                          </p>
                        )}
                      </div>
                      <Badge className={getStatusColor(clinic.status)} data-testid={`clinic-status-${clinic.id}`}>
                        {clinic.status.charAt(0).toUpperCase() + clinic.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="flex items-center text-lg font-bold text-primary">
                            <Clock className="h-4 w-4 mr-1" />
                            <span data-testid={`clinic-wait-time-${clinic.id}`}>{clinic.currentWaitTime} min</span>
                          </div>
                          <div className="text-xs text-gray-500">Wait Time</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center text-lg font-bold text-secondary">
                            <Users className="h-4 w-4 mr-1" />
                            <span data-testid={`clinic-queue-size-${clinic.id}`}>{clinic.queueSize}</span>
                          </div>
                          <div className="text-xs text-gray-500">In Queue</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        className="w-full bg-accent hover:bg-blue-600 text-white"
                        onClick={async (e) => {
                          e.stopPropagation();
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
                                estimated_wait_time: clinic.currentWaitTime || 15
                              }])
                              .select()
                              .single();

                            if (error) throw error;

                            // Store token in localStorage for dashboard access
                            const userTokens = JSON.parse(localStorage.getItem('userTokens') || '[]');
                            userTokens.push({
                              tokenNumber: token.token_number,
                              clinicId: clinic.id,
                              doctorId: null, // General clinic queue, no specific doctor
                              createdAt: token.created_at,
                              bookingType: 'clinic_queue'
                            });
                            localStorage.setItem('userTokens', JSON.stringify(userTokens));

                            // Set queue status for display
                            setUserQueueStatus({
                              position: (clinic.queueSize || 0) + 1,
                              clinicName: clinic.name,
                              estimatedWaitTime: token.estimated_wait_time
                            });
                          } catch (error) {
                            console.error('Booking error:', error);
                            // Fallback to just setting status without database
                            setUserQueueStatus({
                              position: (clinic.queueSize || 0) + 1,
                              clinicName: clinic.name,
                              estimatedWaitTime: clinic.currentWaitTime || 15
                            });
                          }
                        }}
                        disabled={clinic.status === "closed"}
                        data-testid={`button-join-queue-${clinic.id}`}
                      >
                        Join Queue
                      </Button>
                      <p className="text-xs text-center text-gray-500">Click card to see available doctors</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}


          {/* Doctors Dialog */}
          <Dialog open={isDoctorsDialogOpen} onOpenChange={setIsDoctorsDialogOpen}>
            <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Available Doctors at {selectedClinicForDoctors?.name}
                </DialogTitle>
              </DialogHeader>
              {selectedClinicForDoctors && (
                <div className="py-4">
                  {clinicDoctors.length === 0 ? (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No doctors available today at this clinic.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {clinicDoctors.map((doctor: Doctor) => (
                        <Card key={doctor.id} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-lg">{doctor.name}</h3>
                                  <Badge variant="secondary">{doctor.specialization}</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span>{doctor.rating}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{doctor.experience_years} years exp.</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <IndianRupee className="h-4 w-4" />
                                    <span>{doctor.consultation_fee}</span>
                                  </div>
                                </div>
                                {doctor.bio && (
                                  <p className="text-sm text-gray-600 mb-3">{doctor.bio}</p>
                                )}
                              </div>
                              <Button
                                onClick={() => handleDoctorQueueJoin(doctor)}
                                className="ml-4 bg-primary hover:bg-primary/90"
                              >
                                <Users className="h-4 w-4 mr-2" />
                                Join Queue
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <Button onClick={() => setIsDoctorsDialogOpen(false)} className="w-full" variant="outline">
                Close
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
