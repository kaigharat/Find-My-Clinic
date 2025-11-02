import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SymptomInput from "@/components/ui/symptom-input";
import DoctorRecommendation from "@/components/ui/doctor-recommendation";
import type { Symptom, SymptomAnalysis, Doctor, Clinic } from "@shared/schema";
import { supabase } from "@/lib/supabase";
import { analyzeSymptomsWithGemini } from "@/lib/gemini";
import AI from "@/images/AI.jpg";

export default function SymptomAnalysis() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState<"input" | "analyzing" | "results">("input");
  const [symptomData, setSymptomData] = useState<Symptom | null>(null);
  const [analysisData, setAnalysisData] = useState<SymptomAnalysis | null>(null);
  const [rawGeminiResponse, setRawGeminiResponse] = useState<string>("");

  // Submit symptom mutation
  const submitSymptomMutation = useMutation({
    mutationFn: async (data: {
      description: string;
      severity: string;
      duration?: string;
      image?: File;
      additionalNotes?: string;
    }) => {
      // Create symptom record
      const { data: symptom, error: symptomError } = await supabase
        .from('symptoms')
        .insert([{
          description: data.description,
          severity: data.severity,
          duration: data.duration,
          additional_notes: data.additionalNotes,
        }])
        .select()
        .single();

      if (symptomError) throw symptomError;
      setSymptomData(symptom);

      // Call Gemini API for analysis
      const geminiResult = await analyzeSymptomsWithGemini(
        data.description,
        data.severity,
        data.duration,
        data.additionalNotes,
        data.image
      );

      console.log('Gemini analysis result:', geminiResult);

      // Store raw Gemini response for UI display
      setRawGeminiResponse(geminiResult.rawResponse || '');

      // Create analysis record with Gemini results
      const analysisData = {
        id: crypto.randomUUID(),
        symptom_id: symptom.id,
        analysis_result: geminiResult.analysis,
        confidence: geminiResult.confidence,
        urgency: geminiResult.urgency,
        recommendations: geminiResult.recommendations,
        possible_conditions: geminiResult.possibleConditions,
        recommended_specialty: geminiResult.recommendedSpecialty,
        created_at: new Date().toISOString(),
      };

      const { data: analysis, error: analysisError } = await supabase
        .from('symptom_analyses')
        .insert([analysisData])
        .select()
        .single();

      if (analysisError) throw analysisError;
      setAnalysisData(analysis);

      return { symptom, analysis };
    },
    onSuccess: () => {
      setCurrentStep("results");
    },
    onError: (error) => {
      console.error('Symptom analysis error:', error);
      setCurrentStep("input");
    },
  });

  // Get doctor based on recommended specialty from analysis
  const { data: doctor } = useQuery({
    queryKey: ["recommended-doctor", analysisData?.recommended_specialty],
    queryFn: async () => {
      if (!analysisData?.recommended_specialty) return null;

      // Get a doctor that matches the recommended specialty
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('specialization', analysisData.recommended_specialty)
        .eq('is_active', true)
        .limit(1)
        .single();

      if (error) {
        // Fallback: Get any active doctor if no match found
        console.log(`No doctor found for specialty ${analysisData.recommended_specialty}, getting any active doctor`);
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('doctors')
          .select('*')
          .eq('is_active', true)
          .limit(1)
          .single();

        if (fallbackError) {
          // Return mock data if no doctors exist
          return {
            id: 'mock-doctor',
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@example.com',
            phone: '+1-555-0123',
            clinic_id: 'mock-clinic',
            specialization: analysisData.recommended_specialty,
            bio: `Experienced ${analysisData.recommended_specialty.toLowerCase()} specialist with 15+ years in patient care.`,
            experience_years: 15,
            rating: 4.8,
            is_active: true,
            created_at: new Date().toISOString(),
          };
        }
        return fallbackData;
      }
      return data;
    },
    enabled: !!analysisData,
  });

  const { data: clinic } = useQuery({
    queryKey: ["clinic", doctor?.clinic_id],
    queryFn: async () => {
      if (!doctor?.clinic_id || doctor.clinic_id === 'mock-clinic') {
        return {
          id: 'mock-clinic',
          name: 'City General Hospital',
          address: '123 Main Street, Downtown',
          phone: '+1-555-0123',
          email: 'info@citygeneral.com',
          latitude: '40.7128',
          longitude: '-74.0060',
          current_wait_time: 15,
          queue_size: 3,
          status: 'open',
          is_active: true,
          created_at: new Date().toISOString(),
        };
      }

      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', doctor.clinic_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!doctor,
  });

  const handleSymptomSubmit = (data: {
    description: string;
    severity: string;
    duration?: string;
    image?: File;
    additionalNotes?: string;
  }) => {
    setCurrentStep("analyzing");
    submitSymptomMutation.mutate(data);
  };

  const handleBookAppointment = (doctorId: string) => {
    // Navigate to clinic page with doctor parameter for booking
    navigate(`/clinics?doctor=${doctorId}&book=true`);
  };

  const handleStartOver = () => {
    setCurrentStep("input");
    setSymptomData(null);
    setAnalysisData(null);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${AI})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${AI})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          filter: 'brightness(0) blur(2px)',
          zIndex: -1
        }}
      ></div>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Symptom Analysis & Doctor Recommendations
            </h1>
            <p className="text-gray-600">
              Describe your symptoms and get personalized healthcare recommendations
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === "input" && (
            <div className="animate-fade-in">
              <SymptomInput
                onSubmit={handleSymptomSubmit}
                isLoading={submitSymptomMutation.isPending}
              />

              {/* Disclaimer */}
              <div className="mt-6">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This tool provides general recommendations based on your symptoms.
                    It is not a substitute for professional medical advice, diagnosis, or treatment.
                    Always consult with a qualified healthcare provider for medical concerns.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}

          {currentStep === "analyzing" && (
            <div className="text-center py-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Analyzing Your Symptoms
              </h2>
              <p className="text-gray-600">
                Please wait while we process your information and find the best healthcare recommendations...
              </p>
            </div>
          )}

          {currentStep === "results" && analysisData && doctor && clinic && (
            <div className="animate-fade-in space-y-6">
              {/* Success Message */}
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Analysis complete! Here are our recommendations based on your symptoms.
                </AlertDescription>
              </Alert>

              {/* Symptom Summary */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Your Symptoms</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="font-medium">{symptomData?.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Severity</p>
                    <p className="font-medium capitalize">{symptomData?.severity}</p>
                  </div>
                  {symptomData?.duration && (
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium">{symptomData.duration}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Gemini Analysis Results */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  AI Analysis Results
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-green-800"><strong>Analysis:</strong> {analysisData.analysisResult}</p>
                    <p className="text-green-800"><strong>Confidence:</strong> {analysisData.confidence}%</p>
                    <p className="text-green-800"><strong>Urgency:</strong> {analysisData.urgency}</p>
                    {analysisData.recommended_specialty && (
                      <p className="text-green-800"><strong>Recommended Specialty:</strong> {analysisData.recommended_specialty}</p>
                    )}
                    {analysisData.recommendations && (
                      <p className="text-green-800"><strong>Recommendations:</strong> {analysisData.recommendations}</p>
                    )}
                    {analysisData.possibleConditions && analysisData.possibleConditions.length > 0 && (
                      <p className="text-green-800"><strong>Possible Conditions:</strong> {analysisData.possibleConditions.join(', ')}</p>
                    )}
                  </div>

                  {/* Raw Gemini Response */}
                  {rawGeminiResponse && (
                    <div className="border-t border-green-200 pt-4">
                      <h4 className="text-md font-semibold text-green-900 mb-2">
                        Raw Gemini API Response
                      </h4>
                      <div className="space-y-2">
                        {(() => {
                          try {
                            const parsed = JSON.parse(rawGeminiResponse);
                            return (
                              <>
                                <p className="text-green-800"><strong>Analysis:</strong> {parsed.analysis}</p>
                                  <p className="text-green-800"><strong>Confidence:</strong> {parsed.confidence}</p>
                                  <p className="text-green-800"><strong>Urgency:</strong> {parsed.urgency}</p>
                                  <p className="text-green-800"><strong>Recommended Specialty:</strong> {parsed.recommendedSpecialty}</p>
                                  <p className="text-green-800"><strong>Recommendations:</strong> {parsed.recommendations}</p>
                                  <p className="text-green-800"><strong>Possible Conditions:</strong> {Array.isArray(parsed.possibleConditions) ? parsed.possibleConditions.join(', ') : parsed.possibleConditions}</p>
                              </>
                            );
                          } catch (e) {
                            return <p className="text-green-800">Unable to parse response</p>;
                          }
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Doctor Recommendation */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Recommended Healthcare Professional</h3>
                <DoctorRecommendation
                  doctor={doctor}
                  clinic={clinic}
                  confidence={analysisData.confidence || 0}
                  analysisResult={analysisData.analysisResult}
                  urgency={analysisData.urgency}
                  onBookAppointment={handleBookAppointment}
                />
              </div>

              {/* Additional Recommendations */}
              {analysisData.recommendations && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Additional Recommendations
                  </h3>
                  <p className="text-blue-800">{analysisData.recommendations}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={handleStartOver}>
                  Analyze Different Symptoms
                </Button>
                <Button onClick={() => navigate("/clinics")}>
                  Browse All Clinics
                </Button>
              </div>
            </div>
          )}

          {/* Error State */}
          {submitSymptomMutation.isError && (
            <div className="text-center py-12">
              <Alert variant="destructive" className="max-w-md mx-auto">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {submitSymptomMutation.error?.message ||
                    "Sorry, we encountered an error analyzing your symptoms. This could be due to API connectivity issues or invalid input. Please try again or contact support if the problem persists."}
                </AlertDescription>
              </Alert>
              <Button
                onClick={() => setCurrentStep("input")}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
