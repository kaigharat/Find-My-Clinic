import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, User, Settings, Edit, QrCode, Ticket } from "lucide-react";
import { supabase } from "@/lib/supabase";
import QRCode from 'qrcode.react';
import DB from "@/images/DB.jpg";

interface ClinicVisit {
  id: string;
  clinic_name: string;
  visit_date: string;
  status: string;
  location: string;
}

interface QueueToken {
  id: string;
  token_number: number;
  status: string;
  estimated_wait_time: number | null;
  created_at: string;
  clinic: {
    name: string;
    address: string;
  };
}

interface UserProfile {
  fullName: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  emergencyContact: string;
  emergencyPhone: string;
  bloodType: string;
  allergies: string;
  medicalConditions: string;
  medications: string;
  insuranceProvider: string;
  insuranceNumber: string;
}

export default function UserDashboard() {
  const { user, userRole } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [visits, setVisits] = useState<ClinicVisit[]>([]);
  const [queueTokens, setQueueTokens] = useState<QueueToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    emergencyContact: '',
    emergencyPhone: '',
    bloodType: '',
    allergies: '',
    medicalConditions: '',
    medications: '',
    insuranceProvider: '',
    insuranceNumber: ''
  });
  const [saving, setSaving] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [profileComplete, setProfileComplete] = useState(false);



  useEffect(() => {
    if (user && userRole === 'patient') {
      fetchUserVisits();
      fetchUserProfile();
      fetchQueueTokens();
    }
  }, [user, userRole]);

  useEffect(() => {
    if (profileComplete && user?.id) {
      generateQRCode();
    }
  }, [profileComplete, user?.id]);

  const fetchUserVisits = async () => {
    try {
      // This would need to be implemented based on your schema
      // For now, showing mock data
      const mockVisits: ClinicVisit[] = [
        {
          id: '1',
          clinic_name: 'City Medical Center',
          visit_date: '2024-01-15',
          status: 'completed',
          location: 'Downtown'
        },
        {
          id: '2',
          clinic_name: 'Wellness Clinic',
          visit_date: '2024-01-10',
          status: 'completed',
          location: 'Midtown'
        }
      ];
      setVisits(mockVisits);
    } catch (error) {
      console.error('Error fetching visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQueueTokens = async () => {
    try {
      // Get user's tokens from localStorage
      const userTokens = JSON.parse(localStorage.getItem('userTokens') || '[]');
      const tokenNumbers = userTokens.map((token: any) => token.tokenNumber);

      if (tokenNumbers.length === 0) {
        setQueueTokens([]);
        return;
      }

      // Fetch queue tokens that belong to the current user
      const { data, error } = await supabase
        .from('queue_tokens')
        .select(`
          id,
          token_number,
          status,
          estimated_wait_time,
          created_at,
          clinic:clinics (
            name,
            address
          )
        `)
        .in('token_number', tokenNumbers)
        .in('status', ['waiting', 'called']) // Include active statuses
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format the data
      const formattedTokens = (data || []).map(token => ({
        ...token,
        clinic: Array.isArray(token.clinic) ? token.clinic[0] : token.clinic,
      }));

      setQueueTokens(formattedTokens);
    } catch (error) {
      console.error('Error fetching queue tokens:', error);
      setQueueTokens([]);
    }
  };

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          fullName: data.full_name || '',
          phone: data.phone || '',
          dateOfBirth: data.date_of_birth || '',
          gender: data.gender || '',
          emergencyContact: data.emergency_contact || '',
          emergencyPhone: data.emergency_phone || '',
          bloodType: data.blood_type || '',
          allergies: data.allergies || '',
          medicalConditions: data.medical_conditions || '',
          medications: data.medications || '',
          insuranceProvider: data.insurance_provider || '',
          insuranceNumber: data.insurance_number || ''
        });
        const isComplete = !!(data.full_name && data.phone && data.date_of_birth);
        setProfileComplete(isComplete);
        if (isComplete) {
          const patientInfoUrl = `${window.location.origin}/patient-info/${user.id}`;
          setQrCodeUrl(patientInfoUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const generateQRCode = async () => {
    if (user?.id && profileComplete) {
      try {
        // Format profile data as readable text for QR code
        const formattedProfile = `
MEDICAL PROFILE
Name: ${profile.fullName}
DOB: ${profile.dateOfBirth}
Gender: ${profile.gender}
Phone: ${profile.phone}
Blood Type: ${profile.bloodType}

EMERGENCY CONTACT
Name: ${profile.emergencyContact}
Phone: ${profile.emergencyPhone}

MEDICAL INFO
Allergies: ${profile.allergies || 'None'}
Conditions: ${profile.medicalConditions || 'None'}
Medications: ${profile.medications || 'None'}

INSURANCE
Provider: ${profile.insuranceProvider || 'None'}
Number: ${profile.insuranceNumber || 'None'}
        `.trim();

        setQrCodeUrl(formattedProfile);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Save profile to Supabase
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user?.id,
          full_name: profile.fullName,
          phone: profile.phone,
          date_of_birth: profile.dateOfBirth,
          gender: profile.gender,
          emergency_contact: profile.emergencyContact,
          emergency_phone: profile.emergencyPhone,
          blood_type: profile.bloodType,
          allergies: profile.allergies,
          medical_conditions: profile.medicalConditions,
          medications: profile.medications,
          insurance_provider: profile.insuranceProvider,
          insurance_number: profile.insuranceNumber,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Check if profile is now complete and generate QR code
      const isComplete = !!(profile.fullName && profile.phone && profile.dateOfBirth);
      setProfileComplete(isComplete);
      if (isComplete) {
        await generateQRCode();
      }

      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCancel = async (tokenId: string) => {
    try {
      const { error } = await supabase
        .from('queue_tokens')
        .update({ status: 'cancelled' })
        .eq('id', tokenId);

      if (error) throw error;

      // Refresh the queue tokens list
      await fetchQueueTokens();

      alert('Appointment cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment. Please try again.');
    }
  };



  if (userRole !== 'patient') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This dashboard is for patients only.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${DB})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${DB})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          filter: 'brightness(0) blur(2px)',
          zIndex: -1
        }}
      ></div>
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
              <p className="text-gray-600">{t('dashboard.welcome', { name: user?.user_metadata?.name || t('dashboard.welcome') })}</p>
            </div>
            <Button variant="outline" onClick={() => setLocation('/profile')}>
              <Settings className="h-4 w-4 mr-2" />
              {t('dashboard.editProfile')}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.stats.totalVisits')}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visits.length}</div>
              <p className="text-xs text-muted-foreground">{t('dashboard.stats.allTime')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.stats.activeTokens')}</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {queueTokens.filter(t => t.status === 'waiting').length}
              </div>
              <p className="text-xs text-muted-foreground">{t('dashboard.stats.inQueue')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.stats.favoriteClinic')}</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {visits.length > 0 ? visits[0].clinic_name : t('dashboard.stats.none')}
              </div>
              <p className="text-xs text-muted-foreground">{t('dashboard.stats.mostVisited')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Patient Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {t('dashboard.features.findClinics.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {t('dashboard.features.findClinics.description')}
              </p>
              <Button className="w-full" onClick={() => setLocation('/patients')}>
                {t('dashboard.features.findClinics.button')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                {t('dashboard.features.myAppointments.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {queueTokens.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Ticket className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">{t('dashboard.features.myAppointments.noAppointments')}</p>
                  <p className="text-xs">{t('dashboard.features.myAppointments.bookAppointment')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {queueTokens.map((token) => (
                    <div key={token.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Ticket className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-gray-900">{t('dashboard.features.myAppointments.token', { number: token.token_number })}</h4>
                          <p className="text-xs text-gray-500">{token.clinic.name}</p>
                          <p className="text-xs text-gray-400">{t('dashboard.features.myAppointments.generalQueue')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={token.status === 'waiting' ? 'default' : 'secondary'} className="text-xs">
                          {token.status}
                        </Badge>
                        {token.estimated_wait_time && (
                          <p className="text-xs text-gray-500 mt-1">
                            ~{token.estimated_wait_time} min
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(token.created_at).toLocaleDateString()}
                        </p>
                        {token.status === 'waiting' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="mt-2"
                            onClick={() => handleCancel(token.id)}
                          >
                            {t('dashboard.features.myAppointments.cancel')}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {t('dashboard.features.userProfile.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {t('dashboard.features.userProfile.description')}
              </p>
              <Button className="w-full" variant="outline" onClick={() => setLocation('/profile')}>
                {t('dashboard.features.userProfile.viewProfile')}
              </Button>
            </CardContent>
          </Card>


        </div>

        {/* Profile Information Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Profile Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  {t('dashboard.profile.title')}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation('/profile')}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {t('dashboard.profile.edit')}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('dashboard.profile.fields.fullName')}:</span>
                    <p className="text-sm text-gray-900">{profile.fullName || t('dashboard.profile.notProvided')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('dashboard.profile.fields.phone')}:</span>
                    <p className="text-sm text-gray-900">{profile.phone || t('dashboard.profile.notProvided')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('dashboard.profile.fields.dateOfBirth')}:</span>
                    <p className="text-sm text-gray-900">{profile.dateOfBirth || t('dashboard.profile.notProvided')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('dashboard.profile.fields.gender')}:</span>
                    <p className="text-sm text-gray-900">{profile.gender || t('dashboard.profile.notProvided')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('dashboard.profile.fields.bloodType')}:</span>
                    <p className="text-sm text-gray-900">{profile.bloodType || t('dashboard.profile.notProvided')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('dashboard.profile.fields.emergencyContact')}:</span>
                    <p className="text-sm text-gray-900">{profile.emergencyContact || t('dashboard.profile.notProvided')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('dashboard.profile.fields.emergencyPhone')}:</span>
                    <p className="text-sm text-gray-900">{profile.emergencyPhone || t('dashboard.profile.notProvided')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('dashboard.profile.fields.insuranceProvider')}:</span>
                    <p className="text-sm text-gray-900">{profile.insuranceProvider || t('dashboard.profile.notProvided')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('dashboard.profile.fields.insuranceNumber')}:</span>
                    <p className="text-sm text-gray-900">{profile.insuranceNumber || t('dashboard.profile.notProvided')}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('dashboard.profile.fields.allergies')}:</span>
                    <p className="text-sm text-gray-900">{profile.allergies || t('dashboard.profile.noneListed')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('dashboard.profile.fields.medicalConditions')}:</span>
                    <p className="text-sm text-gray-900">{profile.medicalConditions || t('dashboard.profile.noneListed')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('dashboard.profile.fields.medications')}:</span>
                    <p className="text-sm text-gray-900">{profile.medications || t('dashboard.profile.noneListed')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                {t('dashboard.qrCode.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {t('dashboard.qrCode.description')}
              </p>
              {profileComplete && qrCodeUrl ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <QRCode value={qrCodeUrl} size={200} />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    {t('dashboard.qrCode.scanInstruction')}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <QrCode className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">
                    {t('dashboard.qrCode.incompleteProfile')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>





        {/* Recent Visits */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t('dashboard.visits.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">{t('dashboard.visits.loading')}</div>
            ) : visits.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>{t('dashboard.visits.noVisits')}</p>
                <p className="text-sm">{t('dashboard.visits.noVisitsDescription')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {visits.map((visit) => (
                  <div key={visit.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{visit.clinic_name}</h3>
                        <p className="text-sm text-gray-500">{visit.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={visit.status === 'completed' ? 'default' : 'secondary'}>
                        {visit.status}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(visit.visit_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
