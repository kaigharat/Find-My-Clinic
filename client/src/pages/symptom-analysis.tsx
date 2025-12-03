import React from "react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowLeft, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SymptomInput from "@/components/ui/symptom-input";
import DoctorRecommendation from "@/components/ui/doctor-recommendation";
import type { Symptom, SymptomAnalysis as SymptomAnalysisDB, Doctor, Clinic } from "@shared/schema";
import { supabase } from "@/lib/supabase";
import { analyzeSymptomsWithGemini } from "@/lib/gemini";
import AI from "@/images/AI.jpg";

// Utility to convert snake_case keys to camelCase recursively
function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => snakeToCamel(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      acc[camelKey] = snakeToCamel(value);
      return acc;
    }, {} as any);
  }
  return obj;
}

// Extend DB SymptomAnalysis type to convert recommended_specialty to recommendedSpecialty etc. for UI usage
type SymptomAnalysis = Omit<SymptomAnalysisDB, 'recommended_specialty'> & {
  recommendedSpecialty: string | null;
};

export default function SymptomAnalysis() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState<"input" | "analyzing" | "results">("input");
  const [symptomData, setSymptomData] = useState<Symptom | null>(null);
  const [analysisData, setAnalysisData] = useState<SymptomAnalysis | null>(null);
  const [rawGeminiResponse, setRawGeminiResponse] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Submit symptom mutation
  const submitSymptomMutation = useMutation({
    mutationFn: async (data: {
      description: string;
      severity: string;
      duration?: string;
      image?: File;
      additionalNotes?: string;
    }) => {
      try {
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
        const analysisDataToInsert = {
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
          .insert([analysisDataToInsert])
          .select()
          .single();

        if (analysisError) throw analysisError;

        // Convert snake_case keys from DB to camelCase for UI usage
        const normalizedAnalysis = snakeToCamel(analysis);

        setAnalysisData(normalizedAnalysis);

        return { symptom, analysis: normalizedAnalysis };
      } catch (error: any) {
        console.error('Symptom analysis error:', error);
        // Set user-friendly error message based on error type
        if (error.message.includes('API key')) {
          setErrorMessage(t('symptomAnalysis.error.apiKeyError') || 'API key configuration error. Please contact support.');
        } else if (error.message.includes('Network error') || error.message.includes('fetch')) {
          setErrorMessage(t('symptomAnalysis.error.networkError') || 'Network error. Please check your connection and try again.');
        } else {
          setErrorMessage(error.message || t('symptomAnalysis.error.analysisError') || 'An unknown error occurred.');
        }
        // Reset currentStep to input to stop loading
        setCurrentStep("input");
        throw error;
      }
    },
    onSuccess: () => {
      setErrorMessage("");
      setCurrentStep("results");
    },
    onError: () => {
      // Error handling done in mutationFn catch
    },
  });

  // Get doctor based on recommended specialty from analysis
  const { data: doctor } = useQuery({
    queryKey: ["recommended-doctor", analysisData?.recommendedSpecialty],
    queryFn: async () => {
      if (!analysisData?.recommendedSpecialty) return null;

      // Get a doctor that matches the recommended specialty
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('specialization', analysisData.recommendedSpecialty)
        .eq('is_active', true)
        .limit(1)
        .single();

      if (error) {
        // Fallback: Get any active doctor if no match found
        console.log(`No doctor found for specialty ${analysisData.recommendedSpecialty}, getting any active doctor`);
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
            specialization: analysisData.recommendedSpecialty,
            bio: `Experienced ${analysisData.recommendedSpecialty.toLowerCase()} specialist with 15+ years in patient care.`,
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
    // Navigate to doctors page for booking
    navigate(`/doctors`);
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
            {t('symptomAnalysis.backToHome')}
          </Button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('symptomAnalysis.title')}
            </h1>
            <p className="text-gray-600">
              {t('symptomAnalysis.subtitle')}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 'input' && (
            <div className="animate-fade-in">
              <SymptomInput
                onSubmit={handleSymptomSubmit}
                isLoading={submitSymptomMutation.isPending}
              />

              {errorMessage && (
                <div className="mt-4">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Disclaimer */}
              <div className="mt-6">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {t('symptomAnalysis.disclaimer.description')}
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}

          {currentStep === 'analyzing' && (
            <div className="text-center py-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {t('symptomAnalysis.analyzing.title')}
              </h2>
              <p className="text-gray-600">
                {t('symptomAnalysis.analyzing.subtitle')}
              </p>
            </div>
          )}

          {currentStep === 'results' && analysisData && doctor && clinic && (
            <div className="animate-fade-in space-y-6">
              {/* Success Message */}
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {t('symptomAnalysis.results.successMessage')}
                </AlertDescription>
              </Alert>

              {/* Symptom Summary */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">{t('symptomAnalysis.results.yourSymptoms')}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('symptomAnalysis.results.description')}</p>
                    <p className="font-medium">{symptomData?.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('symptomAnalysis.results.severity')}</p>
                    <p className="font-medium capitalize">{symptomData?.severity}</p>
                  </div>
                  {symptomData?.duration && (
                    <div>
                      <p className="text-sm text-gray-600">{t('symptomAnalysis.results.duration')}</p>
                      <p className="font-medium">{symptomData.duration}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Gemini Analysis Results */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  {t('symptomAnalysis.results.aiAnalysis')}
                </h3>

                {/* Check if this is fallback analysis */}
                {rawGeminiResponse && JSON.parse(rawGeminiResponse).note && (
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
                    <div className="flex">
                      <div className="py-1">
                        <svg className="fill-current h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold">Service Temporarily Unavailable</p>
                        <p className="text-sm">Our AI analysis service is currently experiencing high demand. The following is a basic automated assessment. For comprehensive analysis, please try again later or consult a healthcare professional directly.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-green-800"><strong>{t('symptomAnalysis.results.analysis')}:</strong> {analysisData.analysisResult}</p>
                    <p className="text-green-800"><strong>{t('symptomAnalysis.results.confidence')}:</strong> {(typeof analysisData.confidence === 'number' ? analysisData.confidence.toFixed(1) : analysisData.confidence)}%</p>
                    <p className="text-green-800"><strong>{t('symptomAnalysis.results.urgency')}:</strong> {analysisData.urgency}</p>
                    {analysisData.recommendedSpecialty && (
                      <p className="text-green-800"><strong>{t('symptomAnalysis.results.recommendedSpecialty')}:</strong> {analysisData.recommendedSpecialty}</p>
                    )}
                    {analysisData.recommendations && (
                      <p className="text-green-800"><strong>{t('symptomAnalysis.results.recommendations')}:</strong> {analysisData.recommendations}</p>
                    )}
                    {analysisData.possibleConditions && analysisData.possibleConditions.length > 0 && (
                      <p className="text-green-800"><strong>{t('symptomAnalysis.results.possibleConditions')}:</strong> {analysisData.possibleConditions.join(', ')}</p>
                    )}
                  </div>

                  {/* Raw Gemini Response */}
                  {rawGeminiResponse && (
                    <div className="border-t border-green-200 pt-4">
                      <h4 className="text-md font-semibold text-green-900 mb-2">
                        {t('symptomAnalysis.results.rawResponse')}
                      </h4>
                      <div className="space-y-2">
                        {(() => {
                          try {
                            const parsed = JSON.parse(rawGeminiResponse);
                            return (
                              <>
                                <p className="text-green-800"><strong>{t('symptomAnalysis.results.analysis')}:</strong> {parsed.analysis}</p>
                                <p className="text-green-800"><strong>{t('symptomAnalysis.results.confidence')}:</strong> {parsed.confidence}</p>
                                <p className="text-green-800"><strong>{t('symptomAnalysis.results.urgency')}:</strong> {parsed.urgency}</p>
                                <p className="text-green-800"><strong>{t('symptomAnalysis.results.recommendedSpecialty')}:</strong> {parsed.recommendedSpecialty}</p>
                                <p className="text-green-800"><strong>{t('symptomAnalysis.results.recommendations')}:</strong> {parsed.recommendations}</p>
                                <p className="text-green-800"><strong>{t('symptomAnalysis.results.possibleConditions')}:</strong> {Array.isArray(parsed.possibleConditions) ? parsed.possibleConditions.join(', ') : parsed.possibleConditions}</p>
                              </>
                            );
                          } catch (e) {
                            return <p className="text-green-800">{t('symptomAnalysis.results.error.unableToParse')}</p>;
                          }
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Doctor Recommendation */}
              <div>
                <h3 className="text-xl font-semibold mb-4">{t('symptomAnalysis.results.recommendedDoctor')}</h3>
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
                    {t('symptomAnalysis.results.additionalRecommendations')}
                  </h3>
                  <p className="text-blue-800">{analysisData.recommendations}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={handleStartOver}>
                  {t('symptomAnalysis.actions.analyzeDifferent')}
                </Button>
                <Button onClick={() => navigate("/clinics")}>
                  {t('symptomAnalysis.actions.browseClinics')}
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
                  {submitSymptomMutation.error?.message || t('symptomAnalysis.error.analysisError')}
                </AlertDescription>
              </Alert>
              <Button
                onClick={() => setCurrentStep("input")}
                className="mt-4"
              >
                {t('symptomAnalysis.error.tryAgain')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
