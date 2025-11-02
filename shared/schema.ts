// Note: This file is kept for type definitions only.
// Drizzle ORM imports removed since we're using Supabase directly.
import { z } from "zod";

// Type definitions for the database schema
export type User = {
  id: string;
  username: string;
  password: string;
};

export type Clinic = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  latitude: string;
  longitude: string;
  currentWaitTime: number | null;
  queueSize: number | null;
  status: string;
  isActive: boolean | null;
  createdAt: string | null;
  doctors?: Doctor[];
};

export type Patient = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  createdAt: string | null;
};

export type QueueToken = {
  id: string;
  clinicId: string;
  patientId: string;
  tokenNumber: number;
  status: string;
  estimatedWaitTime: number | null;
  createdAt: string | null;
  calledAt: string | null;
  completedAt: string | null;
};

export type ContactRequest = {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  clinicName: string | null;
  createdAt: string | null;
};

export type Doctor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  clinicId: string;
  bio: string | null;
  experience: number | null;
  rating: number | null;
  isActive: boolean | null;
  createdAt: string | null;
};

export type Specialty = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string | null;
};

export type DoctorSpecialty = {
  id: string;
  doctorId: string;
  specialtyId: string;
  createdAt: string | null;
};

export type Symptom = {
  id: string;
  patientId: string | null;
  description: string;
  imageUrl: string | null;
  severity: string;
  duration: string | null;
  additionalNotes: string | null;
  createdAt: string | null;
};

export type SymptomAnalysis = {
  id: string;
  symptomId: string;
  recommendedSpecialtyId: string | null;
  recommendedDoctorId: string | null;
  analysisResult: string;
  confidence: number | null;
  urgency: string;
  recommendations: string | null;
  possibleConditions: string[] | null;
  recommended_specialty: string | null;
  createdAt: string | null;
};

// Insert schemas using Zod
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const insertClinicSchema = z.object({
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  currentWaitTime: z.number().optional(),
  queueSize: z.number().optional(),
  status: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const insertPatientSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().optional(),
});

export const insertQueueTokenSchema = z.object({
  clinicId: z.string(),
  patientId: z.string(),
  tokenNumber: z.number(),
  status: z.string().optional(),
  estimatedWaitTime: z.number().optional(),
});

export const insertContactRequestSchema = z.object({
  type: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  message: z.string().optional(),
  clinicName: z.string().optional(),
});

export const insertDoctorSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  clinicId: z.string(),
  bio: z.string().optional(),
  experience: z.number().optional(),
  rating: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const insertSpecialtySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export const insertDoctorSpecialtySchema = z.object({
  doctorId: z.string(),
  specialtyId: z.string(),
});

export const insertSymptomSchema = z.object({
  patientId: z.string().optional(),
  description: z.string(),
  imageUrl: z.string().optional(),
  severity: z.string().optional(),
  duration: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export const insertSymptomAnalysisSchema = z.object({
  symptomId: z.string(),
  recommendedSpecialtyId: z.string().optional(),
  recommendedDoctorId: z.string().optional(),
  analysisResult: z.string(),
  confidence: z.number().optional(),
  urgency: z.string().optional(),
  recommendations: z.string().optional(),
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertClinic = z.infer<typeof insertClinicSchema>;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type InsertQueueToken = z.infer<typeof insertQueueTokenSchema>;
export type InsertContactRequest = z.infer<typeof insertContactRequestSchema>;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type InsertSpecialty = z.infer<typeof insertSpecialtySchema>;
export type InsertDoctorSpecialty = z.infer<typeof insertDoctorSpecialtySchema>;
export type InsertSymptom = z.infer<typeof insertSymptomSchema>;
export type InsertSymptomAnalysis = z.infer<typeof insertSymptomAnalysisSchema>;
