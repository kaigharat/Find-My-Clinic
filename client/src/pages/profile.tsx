import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, User, Heart, Phone, Shield, Pill, AlertTriangle, QrCode } from "lucide-react";
import { supabase } from "@/lib/supabase";
import QRCode from "qrcode.react";
import prof from "@/images/prof.jpg";

interface ProfileData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  bloodType: string;
  allergies: string;
  medicalConditions: string;
  medications: string;
  insuranceProvider: string;
  insuranceNumber: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    bloodType: '',
    allergies: '',
    medicalConditions: '',
    medications: '',
    insuranceProvider: '',
    insuranceNumber: ''
  });

  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      setLocation('/');
      return;
    }
    loadProfile();
  }, [user, setLocation]);

  const loadProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setProfileData(prev => ({
          ...prev,
          fullName: data.full_name || '',
          dateOfBirth: data.date_of_birth || '',
          gender: data.gender || '',
          phone: data.phone || '',
          emergencyContact: data.emergency_contact || '',
          emergencyPhone: data.emergency_phone || '',
          bloodType: data.blood_type || '',
          allergies: data.allergies || '',
          medicalConditions: data.medical_conditions || '',
          medications: data.medications || '',
          insuranceProvider: data.insurance_provider || '',
          insuranceNumber: data.insurance_number || ''
        }));

        // Generate QR code if profile is complete
        const isComplete = data.full_name && data.date_of_birth && data.phone;
        if (isComplete) {
          const patientInfoUrl = `${window.location.origin}/patient-info/${user.id}`;
          setQrCodeUrl(patientInfoUrl);
          setShowQRCode(true);
        }
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // First, try to check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let error;

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({
            full_name: profileData.fullName,
            date_of_birth: profileData.dateOfBirth,
            gender: profileData.gender,
            phone: profileData.phone,
            emergency_contact: profileData.emergencyContact,
            emergency_phone: profileData.emergencyPhone,
            blood_type: profileData.bloodType,
            allergies: profileData.allergies,
            medical_conditions: profileData.medicalConditions,
            medications: profileData.medications,
            insurance_provider: profileData.insuranceProvider,
            insurance_number: profileData.insuranceNumber,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        error = updateError;
      } else {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            full_name: profileData.fullName,
            date_of_birth: profileData.dateOfBirth,
            gender: profileData.gender,
            phone: profileData.phone,
            emergency_contact: profileData.emergencyContact,
            emergency_phone: profileData.emergencyPhone,
            blood_type: profileData.bloodType,
            allergies: profileData.allergies,
            medical_conditions: profileData.medicalConditions,
            medications: profileData.medications,
            insurance_provider: profileData.insuranceProvider,
            insurance_number: profileData.insuranceNumber
          });

        error = insertError;
      }

      if (error) throw error;

      setSuccess('Profile saved successfully!');
      // Generate QR code URL for patient info
      const patientInfoUrl = `${window.location.origin}/patient-info/${user.id}`;
      setQrCodeUrl(patientInfoUrl);
      setShowQRCode(true);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${prof})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${prof})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          filter: 'blur(2px)',
          zIndex: -1
        }}
      ></div>
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Medical Profile</h1>
          <p className="text-gray-600">Help us provide you with the best healthcare experience</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Basic information about yourself
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={profileData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select value={profileData.bloodType} onValueChange={(value) => handleInputChange('bloodType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                How to reach you in case of emergency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1234567890"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    value={profileData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    placeholder="Emergency contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={profileData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    placeholder="+1234567890"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Medical Information
              </CardTitle>
              <CardDescription>
                Important medical details for your healthcare providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={profileData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder="List any allergies (medications, foods, environmental, etc.)"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <Textarea
                  id="medicalConditions"
                  value={profileData.medicalConditions}
                  onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                  placeholder="List any chronic conditions, past surgeries, etc."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  value={profileData.medications}
                  onChange={(e) => handleInputChange('medications', e.target.value)}
                  placeholder="List current medications, dosages, and frequency"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Insurance Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Insurance Information
              </CardTitle>
              <CardDescription>
                Your health insurance details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input
                    id="insuranceProvider"
                    value={profileData.insuranceProvider}
                    onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                    placeholder="Insurance company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceNumber">Insurance Number</Label>
                  <Input
                    id="insuranceNumber"
                    value={profileData.insuranceNumber}
                    onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
                    placeholder="Policy/member ID number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error/Success Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button type="submit" size="lg" disabled={saving} className="px-8">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Profile & Continue
            </Button>
          </div>
        </form>

        {/* QR Code Section */}
        {showQRCode && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Your Medical Profile QR Code
              </CardTitle>
              <CardDescription>
                Show this QR code to receptionists for quick access to your medical information
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex justify-center mb-4">
                <QRCode value={qrCodeUrl} size={200} />
              </div>
              <p className="text-sm text-gray-600">
                This QR code contains a link to your complete medical profile for healthcare providers.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
