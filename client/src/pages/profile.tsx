import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
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
  profilePicture: string;
}

export default function Profile() {
  const { t } = useTranslation();
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
    insuranceNumber: '',
    profilePicture: ''
  });

  const [uploadingImage, setUploadingImage] = useState(false);
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
          insuranceNumber: data.insurance_number || '',
          profilePicture: data.profile_picture || ''
        }));

        // Generate QR code if profile is complete
        const isComplete = data.full_name && data.date_of_birth && data.phone;
        if (isComplete) {
          // Format profile data as readable text for QR code
          const formattedProfile = `
${t('profile.qrCode.medicalProfile')}
${t('profile.qrCode.name')}: ${data.full_name}
${t('profile.qrCode.dob')}: ${data.date_of_birth}
${t('profile.qrCode.gender')}: ${data.gender || t('profile.qrCode.notSpecified')}
${t('profile.qrCode.phone')}: ${data.phone}
${t('profile.qrCode.bloodType')}: ${data.blood_type || t('profile.qrCode.notSpecified')}

${t('profile.qrCode.emergencyContact')}
${t('profile.qrCode.name')}: ${data.emergency_contact || t('profile.qrCode.notSpecified')}
${t('profile.qrCode.phone')}: ${data.emergency_phone || t('profile.qrCode.notSpecified')}

${t('profile.qrCode.medicalInfo')}
${t('profile.qrCode.allergies')}: ${data.allergies || t('profile.qrCode.none')}
${t('profile.qrCode.conditions')}: ${data.medical_conditions || t('profile.qrCode.none')}
${t('profile.qrCode.medications')}: ${data.medications || t('profile.qrCode.none')}

${t('profile.qrCode.insurance')}
${t('profile.qrCode.provider')}: ${data.insurance_provider || t('profile.qrCode.none')}
${t('profile.qrCode.number')}: ${data.insurance_number || t('profile.qrCode.none')}
          `.trim();

          setQrCodeUrl(formattedProfile);
          setShowQRCode(true);
        }
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(t('profile.actions.loadError'));
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
            profile_picture: profileData.profilePicture,
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
            insurance_number: profileData.insuranceNumber,
            profile_picture: profileData.profilePicture
          });

        error = insertError;
      }

      if (error) throw error;

      setSuccess(t('profile.actions.success'));
      // Generate QR code with formatted profile text
      const formattedProfile = `
${t('profile.qrCode.medicalProfile')}
${t('profile.qrCode.name')}: ${profileData.fullName}
${t('profile.qrCode.dob')}: ${profileData.dateOfBirth}
${t('profile.qrCode.gender')}: ${profileData.gender || t('profile.qrCode.notSpecified')}
${t('profile.qrCode.phone')}: ${profileData.phone}
${t('profile.qrCode.bloodType')}: ${profileData.bloodType || t('profile.qrCode.notSpecified')}

${t('profile.qrCode.emergencyContact')}
${t('profile.qrCode.name')}: ${profileData.emergencyContact || t('profile.qrCode.notSpecified')}
${t('profile.qrCode.phone')}: ${profileData.emergencyPhone || t('profile.qrCode.notSpecified')}

${t('profile.qrCode.medicalInfo')}
${t('profile.qrCode.allergies')}: ${profileData.allergies || t('profile.qrCode.none')}
${t('profile.qrCode.conditions')}: ${profileData.medicalConditions || t('profile.qrCode.none')}
${t('profile.qrCode.medications')}: ${profileData.medications || t('profile.qrCode.none')}

${t('profile.qrCode.insurance')}
${t('profile.qrCode.provider')}: ${profileData.insuranceProvider || t('profile.qrCode.none')}
${t('profile.qrCode.number')}: ${profileData.insuranceNumber || t('profile.qrCode.none')}
      `.trim();

      setQrCodeUrl(formattedProfile);
      setShowQRCode(true);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(t('profile.actions.error'));
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('profile.title')}</h1>
          <p className="text-gray-600">{t('profile.subtitle')}</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('profile.personalInfo.title')}
              </CardTitle>
              <CardDescription>
                {t('profile.personalInfo.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('profile.personalInfo.fullName')} *</Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder={t('profile.personalInfo.enterFullName')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">{t('profile.personalInfo.dateOfBirth')} *</Label>
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
                  <Label htmlFor="gender">{t('profile.personalInfo.gender')}</Label>
                  <Select value={profileData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('profile.personalInfo.selectGender')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t('profile.personalInfo.male')}</SelectItem>
                      <SelectItem value="female">{t('profile.personalInfo.female')}</SelectItem>
                      <SelectItem value="other">{t('profile.personalInfo.other')}</SelectItem>
                      <SelectItem value="prefer-not-to-say">{t('profile.personalInfo.preferNotToSay')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodType">{t('profile.personalInfo.bloodType')}</Label>
                  <Select value={profileData.bloodType} onValueChange={(value) => handleInputChange('bloodType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('profile.personalInfo.selectBloodType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">{t('profile.bloodTypes.A+')}</SelectItem>
                      <SelectItem value="A-">{t('profile.bloodTypes.A-')}</SelectItem>
                      <SelectItem value="B+">{t('profile.bloodTypes.B+')}</SelectItem>
                      <SelectItem value="B-">{t('profile.bloodTypes.B-')}</SelectItem>
                      <SelectItem value="AB+">{t('profile.bloodTypes.AB+')}</SelectItem>
                      <SelectItem value="AB-">{t('profile.bloodTypes.AB-')}</SelectItem>
                      <SelectItem value="O+">{t('profile.bloodTypes.O+')}</SelectItem>
                      <SelectItem value="O-">{t('profile.bloodTypes.O-')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profilePicture">{t('profile.personalInfo.profilePicture')}</Label>
                <Input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        handleInputChange('profilePicture', e.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {profileData.profilePicture && (
                  <div className="mt-2">
                    <img src={profileData.profilePicture} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                {t('profile.contactInfo.title')}
              </CardTitle>
              <CardDescription>
                {t('profile.contactInfo.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t('profile.contactInfo.phone')} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder={t('profile.contactInfo.enterPhone')}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">{t('profile.contactInfo.emergencyContact')}</Label>
                  <Input
                    id="emergencyContact"
                    value={profileData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    placeholder={t('profile.contactInfo.enterEmergencyContact')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">{t('profile.contactInfo.emergencyPhone')}</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={profileData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    placeholder={t('profile.contactInfo.enterEmergencyPhone')}
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
                {t('profile.medicalInfo.title')}
              </CardTitle>
              <CardDescription>
                {t('profile.medicalInfo.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="allergies">{t('profile.medicalInfo.allergies')}</Label>
                <Textarea
                  id="allergies"
                  value={profileData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder={t('profile.medicalInfo.enterAllergies')}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalConditions">{t('profile.medicalInfo.medicalConditions')}</Label>
                <Textarea
                  id="medicalConditions"
                  value={profileData.medicalConditions}
                  onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                  placeholder={t('profile.medicalInfo.enterMedicalConditions')}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medications">{t('profile.medicalInfo.medications')}</Label>
                <Textarea
                  id="medications"
                  value={profileData.medications}
                  onChange={(e) => handleInputChange('medications', e.target.value)}
                  placeholder={t('profile.medicalInfo.enterMedications')}
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
                {t('profile.insuranceInfo.title')}
              </CardTitle>
              <CardDescription>
                {t('profile.insuranceInfo.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insuranceProvider">{t('profile.insuranceInfo.insuranceProvider')}</Label>
                  <Input
                    id="insuranceProvider"
                    value={profileData.insuranceProvider}
                    onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                    placeholder={t('profile.insuranceInfo.enterInsuranceProvider')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceNumber">{t('profile.insuranceInfo.insuranceNumber')}</Label>
                  <Input
                    id="insuranceNumber"
                    value={profileData.insuranceNumber}
                    onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
                    placeholder={t('profile.insuranceInfo.enterInsuranceNumber')}
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
              {t('profile.actions.saveProfile')}
            </Button>
          </div>
        </form>

        {/* QR Code Section */}
        {showQRCode && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                {t('profile.qrCode.title')}
              </CardTitle>
              <CardDescription>
                {t('profile.qrCode.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex justify-center mb-4">
                <QRCode value={qrCodeUrl} size={200} />
              </div>
              <p className="text-sm text-gray-600">
                {t('profile.qrCode.info')}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
