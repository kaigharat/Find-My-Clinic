
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowLeft, MapPin, Phone, Star, Award, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { Doctor, Clinic } from "@shared/schema";
import Doc from "@/images/Doc.jpg";

export default function Doctors() {
   const { t } = useTranslation();
   const [, navigate] = useLocation();
   const { user } = useAuth();
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
   const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
   const [isConflictDialogOpen, setIsConflictDialogOpen] = useState(false);
   const [existingAppointment, setExistingAppointment] = useState<any>(null);
   const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
   const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
   const [lastBookingToken, setLastBookingToken] = useState<number | null>(null);

  // Get all doctors
  const { data: doctors, isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  // Get clinics for doctors
  const { data: clinics } = useQuery({
    queryKey: ["clinics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
  });

  // Get unique specialties
  const specialties = doctors ? Array.from(new Set(doctors.map((d: Doctor) => d.specialization).filter(Boolean))) : [];

  // Filter doctors based on search and specialty
  const filteredDoctors = doctors?.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "all" || doctor.specialization === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const getClinicForDoctor = (doctorId: string) => {
    return clinics?.find((c: Clinic) => c.id === doctorId);
  };

  const handleBookAppointment = async (doctor: Doctor) => {
    const clinic = getClinicForDoctor(doctor.clinic_id);
    if (!clinic) {
      toast({
        title: t('doctors.bookingError'),
        description: t('doctors.noClinicFound'),
        variant: "destructive",
      });
      return;
    }

    setSelectedDoctor(doctor);
    setSelectedClinic(clinic);
    setIsBookingDialogOpen(true);
  };

  const checkExistingAppointment = async () => {
    if (user) {
      // For authenticated users, check database for active appointments
      const { data, error } = await supabase
        .from('queue_tokens')
        .select('*, clinic:clinics(name, address)')
        .eq('patient_id', user.id)
        .in('status', ['waiting', 'called'])
        .single();

      if (!error && data) {
        return data;
      }
    } else {
      // For anonymous users, check localStorage
      const userTokens = JSON.parse(localStorage.getItem('userTokens') || '[]');
      if (userTokens.length > 0) {
        // Check if any token is still active (not completed or cancelled)
        for (const token of userTokens) {
          try {
            const { data, error } = await supabase
              .from('queue_tokens')
              .select('*, clinic:clinics(name, address)')
              .eq('clinic_id', token.clinicId)
              .eq('token_number', token.tokenNumber)
              .in('status', ['waiting', 'called'])
              .single();

            if (!error && data) {
              return data;
            }
          } catch (e) {
            // Continue checking other tokens
          }
        }
      }
    }
    return null;
  };

  const confirmBooking = async () => {
    if (!selectedDoctor || !selectedClinic) return;

    try {
      // Check for existing active appointment
      const existing = await checkExistingAppointment();
      if (existing) {
        setExistingAppointment(existing);
        setIsConflictDialogOpen(true);
        return;
      }
      let patientId: string;

      if (user) {
        // For authenticated users, ensure a patient record exists
        // First, try to get existing patient record
        let { data: existingPatient, error: fetchError } = await supabase
          .from('patients')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        if (!existingPatient) {
          // Get user profile data to populate patient record
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          // Create or update patient record with profile data or defaults
          const patientData = {
            id: user.id,
            name: profile?.full_name || user.user_metadata?.name || user.email || 'Patient',
            phone: profile?.phone || '0000000000',
            email: user.email || null,
          };

          const { data: newPatient, error: patientError } = await supabase
            .from('patients')
            .upsert([patientData], { onConflict: 'id' })
            .select()
            .single();

          if (patientError) throw patientError;
          existingPatient = newPatient;
        }

        patientId = user.id;
      } else {
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
        patientId = patient.id;
      }

      // Get the next sequential token number for this clinic
      const { data: existingTokens, error: countError } = await supabase
        .from('queue_tokens')
        .select('token_number')
        .eq('clinic_id', selectedClinic.id)
        .order('token_number', { ascending: false })
        .limit(1);

      if (countError) throw countError;

      const nextTokenNumber = existingTokens && existingTokens.length > 0
        ? existingTokens[0].token_number + 1
        : 1;

      // Calculate real-time wait time based on current queue
      const { data: queueTokens, error: queueError } = await supabase
        .from('queue_tokens')
        .select('id')
        .eq('clinic_id', selectedClinic.id)
        .eq('status', 'waiting');

      if (queueError) throw queueError;

      // Estimate 10 minutes per patient in queue
      const queueLength = queueTokens?.length || 0;
      const estimatedWaitTime = Math.max(5, queueLength * 10);

      // Create queue token
      const { data: token, error: tokenError } = await supabase
        .from('queue_tokens')
        .insert([{
          clinic_id: selectedClinic.id,
          patient_id: patientId,
          token_number: nextTokenNumber,
          status: 'waiting',
          estimated_wait_time: estimatedWaitTime,
        }])
        .select(`
          *,
          clinic:clinics(name, address, phone)
        `)
        .single();

      if (tokenError) throw tokenError;

      // Store in localStorage if not logged in (for dashboard access)
      if (!user) {
        const userTokens = JSON.parse(localStorage.getItem('userTokens') || '[]');
        userTokens.push({
          tokenNumber: token.token_number,
          clinicId: selectedClinic.id,
          doctorId: selectedDoctor.id,
          createdAt: token.created_at,
          bookingType: 'doctor_booking'
        });
        localStorage.setItem('userTokens', JSON.stringify(userTokens));
      }

      // Store the booking token for status display
      setLastBookingToken(token.token_number);

      // Show success message with token details
      toast({
        title: t('doctors.bookingSuccess'),
        description: `${t('doctors.tokenNumber')} ${token.token_number}. ${t('doctors.estimatedWait')} ${token.estimated_wait_time} ${t('doctors.minutes')}.`,
        duration: 10000, // Show longer
      });

      // Close dialog and reset state
      setIsBookingDialogOpen(false);
      setSelectedDoctor(null);
      setSelectedClinic(null);

    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: t('doctors.bookingFailed'),
        description: error.message || t('doctors.unableToBook'),
        variant: "destructive",
      });
    }
  };

  const handleConflictResolution = async (action: 'cancel_previous' | 'keep_previous') => {
    if (action === 'cancel_previous') {
      try {
        const { error } = await supabase
          .from('queue_tokens')
          .update({ status: 'cancelled' })
          .eq('id', existingAppointment.id);

        if (error) throw error;

        // Remove from localStorage if it exists there
        if (!user) {
          const userTokens = JSON.parse(localStorage.getItem('userTokens') || '[]');
          const filteredTokens = userTokens.filter((token: any) =>
            !(token.clinicId === existingAppointment.clinic_id &&
              token.tokenNumber === existingAppointment.token_number)
          );
          localStorage.setItem('userTokens', JSON.stringify(filteredTokens));
        }

        // Now proceed with the new booking
        setIsConflictDialogOpen(false);
        setExistingAppointment(null);
        await confirmBooking();
      } catch (error) {
        console.error('Error cancelling previous appointment:', error);
        toast({
          title: 'Error',
          description: 'Failed to cancel previous appointment. Please try again.',
          variant: "destructive",
        });
      }
    } else {
      // Keep previous appointment
      setIsConflictDialogOpen(false);
      setExistingAppointment(null);
      setIsBookingDialogOpen(false);
      setSelectedDoctor(null);
      setSelectedClinic(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${Doc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${Doc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          filter: 'brightness(50) blur(2px)',
          zIndex: -1
        }}
      ></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('doctors.backToHome')}
          </Button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('doctors.title')}
            </h1>
            <p className="text-gray-600">
              {t('doctors.subtitle')}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder={t('doctors.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t('doctors.allSpecialties')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('doctors.allSpecialties')}</SelectItem>
                {specialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Last Booking Status */}
        {lastBookingToken && (
          <Card className="max-w-2xl mx-auto mb-8 bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <User className="h-5 w-5" />
                {t('doctors.bookingConfirmed')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">
                        Token #{lastBookingToken}
                      </h3>
                      <p className="text-sm text-green-700">
                        {t('doctors.bookingConfirmedDesc')}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    {t('doctors.waiting')}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/queue-status?token=${lastBookingToken}`)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {t('doctors.checkStatus')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setLastBookingToken(null)}
                    className="flex-1"
                  >
                    {t('doctors.dismiss')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Doctors Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors?.map(doctor => {
              const clinic = getClinicForDoctor(doctor.clinic_id);
              return (
                <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{doctor.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {doctor.specialization}
                        </Badge>
                        <div className="flex items-center mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < (doctor.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-sm text-gray-600">
                            ({doctor.rating || 0})
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Clinic Info */}
                    {clinic && (
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{clinic.name}</p>
                          <p className="text-sm text-gray-600">{clinic.address}</p>
                        </div>
                      </div>
                    )}

                    {/* Experience */}
                    {doctor.experience_years && (
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {doctor.experience_years} years experience
                        </span>
                      </div>
                    )}

                    {/* Bio */}
                    {doctor.bio && (
                      <p className="text-sm text-gray-600 line-clamp-2">{doctor.bio}</p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1">
                            {t('doctors.viewDetails')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>{doctor.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">{t('doctors.specialty')}</h4>
                              <p className="text-sm text-gray-600">{doctor.specialization}</p>
                            </div>

                            {clinic && (
                              <div>
                                <h4 className="font-medium mb-2">{t('doctors.clinicInfo')}</h4>
                                <p className="text-sm text-gray-600">{clinic.name}</p>
                                <p className="text-sm text-gray-600">{clinic.address}</p>
                                <p className="text-sm text-gray-600">{clinic.phone}</p>
                              </div>
                            )}

                            {doctor.bio && (
                              <div>
                                <h4 className="font-medium mb-2">{t('doctors.about')}</h4>
                                <p className="text-sm text-gray-600">{doctor.bio}</p>
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-1">{t('doctors.experience')}</h4>
                                <p className="text-sm text-gray-600">{doctor.experience_years || 0} years</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-1">{t('doctors.rating')}</h4>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < (doctor.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        onClick={() => handleBookAppointment(doctor)}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        {t('doctors.bookAppointment')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredDoctors?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">{t('doctors.noDoctorsFound')}</p>
            </div>
          )}
        </div>

        {/* Booking Dialog */}
        <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('doctors.confirmBooking')}</DialogTitle>
            </DialogHeader>
            {selectedDoctor && selectedClinic && (
              <div className="space-y-4">
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>{t('doctors.doctor')}:</strong> {selectedDoctor.name}</p>
                  <p><strong>{t('doctors.specialty')}:</strong> {selectedDoctor.specialization}</p>
                  <p><strong>{t('doctors.clinic')}:</strong> {selectedClinic.name}</p>
                  <p><strong>{t('doctors.address')}:</strong> {selectedClinic.address}</p>
                  <p><strong>{t('doctors.phone')}:</strong> {selectedClinic.phone}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsBookingDialogOpen(false)}
                    className="flex-1"
                  >
                    {t('doctors.cancel')}
                  </Button>
                  <Button
                    onClick={confirmBooking}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    {t('doctors.confirm')}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Conflict Dialog */}
        <Dialog open={isConflictDialogOpen} onOpenChange={setIsConflictDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-amber-600">
                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 text-sm">⚠️</span>
                </div>
                {t('doctors.existingAppointment')}
              </DialogTitle>
            </DialogHeader>
            {existingAppointment && (
              <div className="space-y-6">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800 mb-4 font-medium">
                    {t('doctors.existingAppointmentMessage')}
                  </p>
                  <div className="bg-white p-3 rounded-md border border-amber-200">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">{t('doctors.tokenNumber')}:</span>
                        <span className="font-semibold ml-1">#{existingAppointment.token_number}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('doctors.status')}:</span>
                        <span className="font-semibold ml-1 capitalize">{existingAppointment.status}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">{t('doctors.clinic')}:</span>
                        <span className="font-semibold ml-1">{existingAppointment.clinic?.name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-600 text-center">
                    What would you like to do?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleConflictResolution('keep_previous')}
                      className="flex-1 border-gray-300 hover:bg-gray-50"
                    >
                      {t('doctors.keepPrevious')}
                    </Button>
                    <Button
                      onClick={() => handleConflictResolution('cancel_previous')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {t('doctors.cancelPrevious')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
