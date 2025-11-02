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

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

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
    console.error('💥 Gemini API error:', error);

    // Provide more specific error messages based on error type
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        throw new Error('API key configuration error. Please contact support.');
      } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
        throw new Error('Service temporarily unavailable due to high demand. Please try again later.');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
    }

    throw new Error('Failed to analyze symptoms. Please try again or consult a healthcare professional.');
  }
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