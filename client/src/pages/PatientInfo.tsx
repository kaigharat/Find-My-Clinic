import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Heart, Phone, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

export default function PatientInfo() {
  const [match, params] = useRoute("/patient-info/:id");
  const userId = params?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (userId) {
      loadPatientInfo(userId);
    }
  }, [userId]);

  const loadPatientInfo = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', id)
        .single();

      if (error) throw error;

      if (data) {
        setProfileData({
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
        });
      } else {
        setError('Patient information not found');
      }
    } catch (err) {
      console.error('Error loading patient info:', err);
      setError('Failed to load patient information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Patient Not Found</h1>
          <p className="text-gray-600">The requested patient information could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Information</h1>
          <p className="text-gray-600">Medical profile details</p>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <p className="text-sm text-gray-600">{profileData.fullName}</p>
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <p className="text-sm text-gray-600">{profileData.dateOfBirth}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Gender</Label>
                  <p className="text-sm text-gray-600">{profileData.gender}</p>
                </div>
                <div>
                  <Label>Blood Type</Label>
                  <p className="text-sm text-gray-600">{profileData.bloodType}</p>
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
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Phone Number</Label>
                <p className="text-sm text-gray-600">{profileData.phone}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Emergency Contact</Label>
                  <p className="text-sm text-gray-600">{profileData.emergencyContact}</p>
                </div>
                <div>
                  <Label>Emergency Phone</Label>
                  <p className="text-sm text-gray-600">{profileData.emergencyPhone}</p>
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
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Allergies</Label>
                <p className="text-sm text-gray-600">{profileData.allergies || 'None specified'}</p>
              </div>
              <div>
                <Label>Medical Conditions</Label>
                <p className="text-sm text-gray-600">{profileData.medicalConditions || 'None specified'}</p>
              </div>
              <div>
                <Label>Current Medications</Label>
                <p className="text-sm text-gray-600">{profileData.medications || 'None specified'}</p>
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
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Insurance Provider</Label>
                  <p className="text-sm text-gray-600">{profileData.insuranceProvider || 'Not specified'}</p>
                </div>
                <div>
                  <Label>Insurance Number</Label>
                  <p className="text-sm text-gray-600">{profileData.insuranceNumber || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}