import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

console.log('Using Gemini API key:', GEMINI_API_KEY ? 'Present' : 'Missing');

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface SymptomAnalysisResult {
  analysis: string;
  confidence: number;
  urgency: 'routine' | 'urgent' | 'emergency';
  recommendations: string;
  possibleConditions: string[];
  recommendedSpecialty: string;
  rawResponse: string;
}

export async function analyzeSymptomsWithGemini(
  description: string,
  severity: string,
  duration?: string,
  additionalNotes?: string,
  image?: File
): Promise<SymptomAnalysisResult> {
  console.log('🔄 Starting Gemini API call with:', { description, severity, duration, additionalNotes, hasImage: !!image });

  // Retry configuration
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt + 1}/${maxRetries + 1} for Gemini API call`);

      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      let prompt = `You are a medical symptom analyzer. Based on the following patient information, provide a detailed analysis and recommend the most appropriate medical specialty for consultation.

Patient Symptoms:
- Description: ${description}
- Severity: ${severity}
${duration ? `- Duration: ${duration}` : ''}
${additionalNotes ? `- Additional Notes: ${additionalNotes}` : ''}

Available Medical Specialties:
- General Medicine (primary care, general health issues)
- Cardiology (heart and cardiovascular diseases)
- Dermatology (skin, hair and nail disorders)
- Orthopedics (bones, joints and musculoskeletal disorders)
- Pediatrics (child healthcare)
- Gynecology (women's health and reproductive medicine)
- Ophthalmology (eye care and vision disorders)
- Dentistry (oral health)
- Psychiatry (mental health)
- Neurology (brain and nervous system disorders)
- ENT (ear, nose and throat disorders)
- Urology (urinary tract and male reproductive health)
- Emergency Medicine (acute care)

Please provide your analysis in the following JSON format ONLY. Do not include any other text:

{
  "analysis": "Detailed analysis of the symptoms and potential causes",
  "confidence": 75,
  "urgency": "routine",
  "recommendations": "Specific recommendations for the patient",
  "possibleConditions": ["Condition 1", "Condition 2", "Condition 3"],
  "recommendedSpecialty": "Dermatology"
}

IMPORTANT: This is NOT a diagnosis. Always recommend consulting a healthcare professional. Be conservative in your assessment. Choose the most appropriate specialty from the list above based on the symptoms described. Return ONLY the JSON object, no additional text or formatting.`;

      let result;

      if (image) {
        console.log('📷 Processing image for analysis with gemini-2.0-flash-exp...');
        // Convert image to base64
        const imageData = await fileToBase64(image);
        const imagePart = {
          inlineData: {
            data: imageData,
            mimeType: image.type,
          },
        };

        prompt += '\n\nAdditionally, analyze the provided image for any visible symptoms or relevant visual information that could help identify potential skin conditions, rashes, or other visible medical issues.';

        result = await model.generateContent([prompt, imagePart]);
      } else {
        console.log('📝 Processing text-only analysis...');
        result = await model.generateContent(prompt);
      }

      console.log('⏳ Waiting for Gemini response...');
      const response = await result.response;
      const text = response.text();

      console.log('✅ Gemini API response received:', text);

      // Try to extract JSON from the response
      let jsonText = text.trim();

      // Remove any markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Find the JSON object
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('❌ No JSON found in response:', text);
        throw new Error('Invalid response format from Gemini API');
      }

      let parsedResult;
      try {
        parsedResult = JSON.parse(jsonMatch[0]);
        console.log('✅ Successfully parsed Gemini response:', parsedResult);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError, 'Raw text:', jsonMatch[0]);
        throw new Error('Failed to parse Gemini API response');
      }

      // Validate and sanitize the response
      const finalResult = {
        analysis: parsedResult.analysis || 'Unable to analyze symptoms. Please consult a healthcare professional.',
        confidence: Math.min(Math.max(parsedResult.confidence || 50, 0), 100),
        urgency: ['routine', 'urgent', 'emergency'].includes(parsedResult.urgency) ? parsedResult.urgency : 'routine',
        recommendations: parsedResult.recommendations || 'Please consult a healthcare professional for proper evaluation.',
        possibleConditions: Array.isArray(parsedResult.possibleConditions) ? parsedResult.possibleConditions : [],
        recommendedSpecialty: parsedResult.recommendedSpecialty || 'General Medicine',
        rawResponse: jsonMatch[0], // Store the raw JSON string for UI display
      };

      console.log('🎉 Final analysis result:', finalResult);
      return finalResult;

    } catch (error) {
      console.error(`💥 Gemini API error on attempt ${attempt + 1}:`, error);

      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error name:', error.name);
        console.error('Error stack:', error.stack);
      }

      // Check if this is a retryable error (quota/rate limit)
      const isRetryableError = error instanceof Error &&
        (error.message.includes('quota') ||
          error.message.includes('rate limit') ||
          error.message.includes('RESOURCE_EXHAUSTED') ||
          error.message.includes('429') ||
          error.message.includes('PERMISSION_DENIED'));

      if (isRetryableError && attempt < maxRetries) {
        // Calculate exponential backoff delay: baseDelay * 2^attempt + random jitter
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        console.log(`⏳ Retrying in ${Math.round(delay)}ms due to quota/rate limit...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue; // Retry the loop
      }

      // If not retryable or max retries reached, handle the error
      if (error instanceof Error) {
        if (error.message.includes('API_KEY') || error.message.includes('INVALID_API_KEY')) {
          console.error('🔑 API key error detected');
          throw new Error('API key configuration error. Please contact support.');
        } else if (isRetryableError) {
          // After retries, provide fallback analysis
          console.log('🔄 All retries exhausted, providing fallback analysis...');
          return getFallbackAnalysis(description, severity, duration, additionalNotes);
        } else if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('NETWORK_ERROR')) {
          console.log('🔄 Network error detected, providing fallback analysis...');
          return getFallbackAnalysis(description, severity, duration, additionalNotes);
        }
      }

      // For any other error, provide fallback analysis
      console.log('🔄 Unknown error, providing fallback analysis...');
      return getFallbackAnalysis(description, severity, duration, additionalNotes);
    }
  }

  // This should never be reached, but just in case
  throw new Error('Failed to analyze symptoms after all retries.');
}

function getFallbackAnalysis(
  description: string,
  severity: string,
  duration?: string,
  additionalNotes?: string
): SymptomAnalysisResult {
  console.log('🔄 Providing fallback analysis for symptoms:', { description, severity, duration, additionalNotes });

  // Basic keyword-based analysis for common symptoms
  const lowerDesc = description.toLowerCase();
  const lowerNotes = additionalNotes?.toLowerCase() || '';

  let recommendedSpecialty = 'General Medicine';
  let possibleConditions: string[] = [];
  let urgency: 'routine' | 'urgent' | 'emergency' = 'routine';
  let confidence = 30; // Lower confidence for fallback

  // Determine urgency based on severity and keywords
  if (severity === 'severe' || severity === 'critical') {
    urgency = 'urgent';
  }

  // Emergency keywords
  const emergencyKeywords = ['chest pain', 'difficulty breathing', 'severe bleeding', 'unconscious', 'stroke', 'heart attack'];
  if (emergencyKeywords.some(keyword => lowerDesc.includes(keyword) || lowerNotes.includes(keyword))) {
    urgency = 'emergency';
    recommendedSpecialty = 'Emergency Medicine';
    possibleConditions = ['Potential emergency condition'];
  }

  // Specialty determination based on symptoms
  if (lowerDesc.includes('skin') || lowerDesc.includes('rash') || lowerDesc.includes('itch')) {
    recommendedSpecialty = 'Dermatology';
    possibleConditions = ['Skin condition', 'Allergic reaction', 'Dermatitis'];
  } else if (lowerDesc.includes('headache') || lowerDesc.includes('migraine')) {
    recommendedSpecialty = 'Neurology';
    possibleConditions = ['Tension headache', 'Migraine', 'Cluster headache'];
  } else if (lowerDesc.includes('stomach') || lowerDesc.includes('nausea') || lowerDesc.includes('vomiting')) {
    recommendedSpecialty = 'Gastroenterology';
    possibleConditions = ['Gastritis', 'Food poisoning', 'Gastroenteritis'];
  } else if (lowerDesc.includes('joint') || lowerDesc.includes('bone') || lowerDesc.includes('pain') && (lowerDesc.includes('knee') || lowerDesc.includes('back'))) {
    recommendedSpecialty = 'Orthopedics';
    possibleConditions = ['Arthritis', 'Sprain', 'Fracture'];
  } else if (lowerDesc.includes('eye') || lowerDesc.includes('vision')) {
    recommendedSpecialty = 'Ophthalmology';
    possibleConditions = ['Eye infection', 'Vision problem', 'Conjunctivitis'];
  } else if (lowerDesc.includes('ear') || lowerDesc.includes('throat') || lowerDesc.includes('nose')) {
    recommendedSpecialty = 'ENT';
    possibleConditions = ['Ear infection', 'Sore throat', 'Sinusitis'];
  } else if (lowerDesc.includes('mental') || lowerDesc.includes('anxiety') || lowerDesc.includes('depression')) {
    recommendedSpecialty = 'Psychiatry';
    possibleConditions = ['Anxiety disorder', 'Depression', 'Stress-related condition'];
  }

  const analysis = `Based on your symptoms (${description}), this appears to be a ${severity} condition that may require attention from a ${recommendedSpecialty} specialist. This is an automated assessment and not a medical diagnosis.`;

  const recommendations = `Please consult a healthcare professional for proper evaluation. If this is an emergency, seek immediate medical attention. In the meantime, monitor your symptoms and note any changes.`;

  return {
    analysis,
    confidence,
    urgency,
    recommendations,
    possibleConditions,
    recommendedSpecialty,
    rawResponse: JSON.stringify({
      analysis,
      confidence,
      urgency,
      recommendations,
      possibleConditions,
      recommendedSpecialty,
      note: 'This is a fallback analysis due to service unavailability'
    })
  };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:image/jpeg;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}