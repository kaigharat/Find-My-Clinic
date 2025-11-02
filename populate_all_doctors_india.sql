-- Insert specialties first (if not already inserted)
INSERT INTO specialties (name, description) VALUES
('General Medicine', 'Primary healthcare and general medical consultations'),
('Cardiology', 'Heart and cardiovascular diseases'),
('Dermatology', 'Skin, hair and nail disorders'),
('Orthopedics', 'Bones, joints and musculoskeletal disorders'),
('Pediatrics', 'Child healthcare and development'),
('Gynecology', 'Women''s health and reproductive medicine'),
('Ophthalmology', 'Eye care and vision disorders'),
('Dentistry', 'Oral health and dental care'),
('Psychiatry', 'Mental health and psychiatric disorders'),
('Neurology', 'Brain and nervous system disorders'),
('ENT', 'Ear, nose and throat disorders'),
('Urology', 'Urinary tract and male reproductive health'),
('Radiology', 'Medical imaging and diagnostics'),
('Pathology', 'Laboratory medicine and disease diagnosis'),
('Emergency Medicine', 'Acute care and emergency response'),
('Oncology', 'Cancer treatment and oncology')
ON CONFLICT (name) DO NOTHING;

-- Insert doctors for all hospitals (2-4 doctors per hospital)
-- Using INSERT ON CONFLICT DO NOTHING to avoid duplicates
INSERT INTO doctors (name, email, phone, clinic_id, specialization, experience_years, rating, is_active, is_available_today, consultation_fee, bio) VALUES
-- Aditya Birla Memorial Hospital
('Dr. Ramesh Gupta', 'ramesh.gupta@adityabirlahospital.com', '+91-20-30717501', (SELECT id::text FROM clinics WHERE name = 'Aditya Birla Memorial Hospital' LIMIT 1), 'Cardiology', 18, 4.8, true, true, 950, 'Cardiologist specializing in heart failure management'),
('Dr. Sneha Rao', 'sneha.rao@adityabirlahospital.com', '+91-20-30717502', (SELECT id::text FROM clinics WHERE name = 'Aditya Birla Memorial Hospital' LIMIT 1), 'Gynecology', 14, 4.7, true, false, 750, 'Gynecologist with expertise in laparoscopic surgery'),
('Dr. Vijay Kumar', 'vijay.kumar@adityabirlahospital.com', '+91-20-30717503', (SELECT id::text FROM clinics WHERE name = 'Aditya Birla Memorial Hospital' LIMIT 1), 'Orthopedics', 12, 4.6, true, true, 700, 'Orthopedic surgeon focused on sports injuries'),

-- AIIMS Delhi
('Dr. Anjali Singh', 'anjali.singh@aiims.edu', '+91-11-26588501', (SELECT id::text FROM clinics WHERE name = 'AIIMS Delhi' LIMIT 1), 'Neurology', 20, 4.9, true, true, 900, 'Neurologist with research in neurodegenerative diseases'),
('Dr. Karan Mehta', 'karan.mehta@aiims.edu', '+91-11-26588502', (SELECT id::text FROM clinics WHERE name = 'AIIMS Delhi' LIMIT 1), 'Pediatrics', 16, 4.8, true, true, 600, 'Pediatric oncologist and hematologist'),
('Dr. Priya Jain', 'priya.jain@aiims.edu', '+91-11-26588503', (SELECT id::text FROM clinics WHERE name = 'AIIMS Delhi' LIMIT 1), 'Dermatology', 10, 4.7, true, false, 650, 'Dermatologist specializing in pediatric dermatology'),
('Dr. Rohit Sharma', 'rohit.sharma@aiims.edu', '+91-11-26588504', (SELECT id::text FROM clinics WHERE name = 'AIIMS Delhi' LIMIT 1), 'Urology', 15, 4.8, true, true, 800, 'Urologist with expertise in kidney transplants'),

-- AMRI Hospitals
('Dr. Subrata Banerjee', 'subrata.banerjee@amrihospitals.in', '+91-33-66062201', (SELECT id::text FROM clinics WHERE name = 'AMRI Hospitals' LIMIT 1), 'Cardiology', 22, 4.9, true, true, 1000, 'Interventional cardiologist with 1000+ procedures'),
('Dr. Rina Chatterjee', 'rina.chatterjee@amrihospitals.in', '+91-33-66062202', (SELECT id::text FROM clinics WHERE name = 'AMRI Hospitals' LIMIT 1), 'Gynecology', 17, 4.8, true, true, 750, 'Obstetrician specializing in high-risk pregnancies'),

-- Apollo Gleneagles Hospitals
('Dr. Rajendra Prasad', 'rajendra.prasad@apollokolkata.com', '+91-33-23202101', (SELECT id::text FROM clinics WHERE name = 'Apollo Gleneagles Hospitals' LIMIT 1), 'Cardiology', 25, 4.9, true, true, 1100, 'Senior cardiac surgeon with 1000+ bypass surgeries'),
('Dr. Fatima Khan', 'fatima.khan@apollokolkata.com', '+91-33-23202102', (SELECT id::text FROM clinics WHERE name = 'Apollo Gleneagles Hospitals' LIMIT 1), 'Dermatology', 18, 4.8, true, true, 700, 'Cosmetic dermatologist and skin specialist'),
('Dr. Venkatesh Reddy', 'venkatesh.reddy@apollokolkata.com', '+91-33-23202103', (SELECT id::text FROM clinics WHERE name = 'Apollo Gleneagles Hospitals' LIMIT 1), 'ENT', 20, 4.9, true, false, 650, 'ENT surgeon specializing in cochlear implants'),

-- Apollo Hospitals Ahmedabad
('Dr. Vikram Patel', 'vikram.patel@apolloahmedabad.com', '+91-79-66776601', (SELECT id::text FROM clinics WHERE name = 'Apollo Hospitals Ahmedabad' LIMIT 1), 'Orthopedics', 19, 4.9, true, true, 850, 'Joint replacement surgeon with 500+ surgeries'),
('Dr. Meera Shah', 'meera.shah@apolloahmedabad.com', '+91-79-66776602', (SELECT id::text FROM clinics WHERE name = 'Apollo Hospitals Ahmedabad' LIMIT 1), 'Pediatrics', 13, 4.7, true, false, 550, 'Pediatrician focused on developmental disorders'),
('Dr. Arjun Desai', 'arjun.desai@apolloahmedabad.com', '+91-79-66776603', (SELECT id::text FROM clinics WHERE name = 'Apollo Hospitals Ahmedabad' LIMIT 1), 'ENT', 11, 4.6, true, true, 600, 'ENT specialist with expertise in sinus surgery'),

-- Apollo Hospitals Bangalore
('Dr. Deepa Nair', 'deepa.nair@apollohospitalsbangalore.com', '+91-80-26304001', (SELECT id::text FROM clinics WHERE name = 'Apollo Hospitals Bangalore' LIMIT 1), 'Oncology', 21, 5.0, true, true, 1200, 'Medical oncologist specializing in breast cancer'),
('Dr. Suresh Babu', 'suresh.babu@apollohospitalsbangalore.com', '+91-80-26304002', (SELECT id::text FROM clinics WHERE name = 'Apollo Hospitals Bangalore' LIMIT 1), 'Neurology', 16, 4.8, true, true, 850, 'Neurologist with focus on epilepsy treatment'),
('Dr. Anjali Menon', 'anjali.menon@apollohospitalsbangalore.com', '+91-80-26304003', (SELECT id::text FROM clinics WHERE name = 'Apollo Hospitals Bangalore' LIMIT 1), 'Dermatology', 12, 4.7, true, false, 700, 'Cosmetic dermatologist and laser specialist'),

-- Apollo Hospitals Chennai
