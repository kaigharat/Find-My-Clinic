import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tajllbcrnztxfwipvgrf.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhamxsYmNybnp0eGZ3aXB2Z3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2Nzg4MTAsImV4cCI6MjA3NzI1NDgxMH0.kcKvyOmZWzcTbUc-kIHw6QdcCp6f2q-205XwziC1l3s'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (matching the schema)
export type Database = {
  public: {
    Tables: {
      clinics: {
        Row: {
          id: string
          name: string
          address: string
          phone: string
          email: string
          latitude: string
          longitude: string
          current_wait_time: number | null
          queue_size: number | null
          status: string
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          address: string
          phone: string
          email: string
          latitude: string
          longitude: string
          current_wait_time?: number | null
          queue_size?: number | null
          status?: string
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          address?: string
          phone?: string
          email?: string
          latitude?: string
          longitude?: string
          current_wait_time?: number | null
          queue_size?: number | null
          status?: string
          is_active?: boolean | null
          created_at?: string | null
        }
      }
      patients: {
        Row: {
          id: string
          name: string
          phone: string
          email: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string | null
          created_at?: string | null
        }
      }
      queue_tokens: {
        Row: {
          id: string
          clinic_id: string
          patient_id: string
          token_number: number
          status: string
          estimated_wait_time: number | null
          created_at: string | null
          called_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          clinic_id: string
          patient_id: string
          token_number: number
          status?: string
          estimated_wait_time?: number | null
          created_at?: string | null
          called_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          clinic_id?: string
          patient_id?: string
          token_number?: number
          status?: string
          estimated_wait_time?: number | null
          created_at?: string | null
          called_at?: string | null
          completed_at?: string | null
        }
      }
      contact_requests: {
        Row: {
          id: string
          type: string
          name: string
          email: string
          phone: string | null
          message: string | null
          clinic_name: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          type: string
          name: string
          email: string
          phone?: string | null
          message?: string | null
          clinic_name?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          type?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string | null
          clinic_name?: string | null
          created_at?: string | null
        }
      }
      doctors: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          clinic_id: string
          bio: string | null
          experience: number | null
          rating: number | null
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          clinic_id: string
          bio?: string | null
          experience?: number | null
          rating?: number | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          clinic_id?: string
          bio?: string | null
          experience?: number | null
          rating?: number | null
          is_active?: boolean | null
          created_at?: string | null
        }
      }
      specialties: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string | null
        }
      }
      doctor_specialties: {
        Row: {
          id: string
          doctor_id: string
          specialty_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          doctor_id: string
          specialty_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          doctor_id?: string
          specialty_id?: string
          created_at?: string | null
        }
      }
      symptoms: {
        Row: {
          id: string
          patient_id: string | null
          description: string
          image_url: string | null
          severity: string
          duration: string | null
          additional_notes: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          patient_id?: string | null
          description: string
          image_url?: string | null
          severity?: string
          duration?: string | null
          additional_notes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          patient_id?: string | null
          description?: string
          image_url?: string | null
          severity?: string
          duration?: string | null
          additional_notes?: string | null
          created_at?: string | null
        }
      }
      symptom_analyses: {
        Row: {
          id: string
          symptom_id: string
          recommended_specialty_id: string | null
          recommended_doctor_id: string | null
          analysis_result: string
          confidence: number | null
          urgency: string
          recommendations: string | null
          possible_conditions: string[] | null
          created_at: string | null
        }
        Insert: {
          id?: string
          symptom_id: string
          recommended_specialty_id?: string | null
          recommended_doctor_id?: string | null
          analysis_result: string
          confidence?: number | null
          urgency?: string
          recommendations?: string | null
          possible_conditions?: string[] | null
          created_at?: string | null
        }
        Update: {
          id?: string
          symptom_id?: string
          recommended_specialty_id?: string | null
          recommended_doctor_id?: string | null
          analysis_result?: string
          confidence?: number | null
          urgency?: string
          recommendations?: string | null
          possible_conditions?: string[] | null
          created_at?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          date_of_birth: string | null
          gender: string | null
          phone: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          blood_type: string | null
          allergies: string | null
          medical_conditions: string | null
          medications: string | null
          insurance_provider: string | null
          insurance_number: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          date_of_birth?: string | null
          gender?: string | null
          phone?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          blood_type?: string | null
          allergies?: string | null
          medical_conditions?: string | null
          medications?: string | null
          insurance_provider?: string | null
          insurance_number?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          date_of_birth?: string | null
          gender?: string | null
          phone?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          blood_type?: string | null
          allergies?: string | null
          medical_conditions?: string | null
          medications?: string | null
          insurance_provider?: string | null
          insurance_number?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}
