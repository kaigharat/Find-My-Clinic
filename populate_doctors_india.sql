-- Insert specialties first
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
('Oncology', 'Cancer treatment and oncology');

-- Insert doctors for each clinic (2-4 doctors per clinic)
-- Delhi NCR Clinics
INSERT INTO doctors (name, email, phone, clinic_id, specialization, experience_years, rating, is_active, is_available_today, consultation_fee, bio) VALUES
-- Apollo Hospitals Delhi
('Dr. Rajesh Kumar', 'rajesh.kumar@apollohospitalsdelhi.com', '+91-11-26925801', (SELECT id FROM clinics WHERE name = 'Apollo Hospitals Delhi' LIMIT 1), 'Cardiology', 15, 4.8, true, true, 800, 'Senior Cardiologist with 15+ years of experience in interventional cardiology'),
('Dr. Priya Sharma', 'priya.sharma@apollohospitalsdelhi.com', '+91-11-26925802', (SELECT id FROM clinics WHERE name = 'Apollo Hospitals Delhi' LIMIT 1), 'Gynecology', 12, 4.9, true, true, 700, 'Expert gynecologist specializing in maternal care and women''s health'),
('Dr. Amit Singh', 'amit.singh@apollohospitalsdelhi.com', '+91-11-26925803', (SELECT id FROM clinics WHERE name = 'Apollo Hospitals Delhi' LIMIT 1), 'Orthopedics', 10, 4.7, true, false, 600, 'Orthopedic surgeon with expertise in joint replacements'),
('Dr. Meera Patel', 'meera.patel@apollohospitalsdelhi.com', '+91-11-26925804', (SELECT id FROM clinics WHERE name = 'Apollo Hospitals Delhi' LIMIT 1), 'Pediatrics', 8, 4.6, true, true, 500, 'Pediatrician focused on child development and vaccination'),

-- Max Super Speciality Hospital
('Dr. Vikram Rao', 'vikram.rao@maxhealthcare.com', '+91-11-66422201', (SELECT id FROM clinics WHERE name = 'Max Super Speciality Hospital' LIMIT 1), 'Neurology', 18, 4.9, true, true, 900, 'Neurologist specializing in stroke management and epilepsy'),
('Dr. Sunita Gupta', 'sunita.gupta@maxhealthcare.com', '+91-11-66422202', (SELECT id FROM clinics WHERE name = 'Max Super Speciality Hospital' LIMIT 1), 'Dermatology', 14, 4.8, true, true, 650, 'Dermatologist with expertise in cosmetic dermatology'),
('Dr. Karan Jain', 'karan.jain@maxhealthcare.com', '+91-11-66422203', (SELECT id FROM clinics WHERE name = 'Max Super Speciality Hospital' LIMIT 1), 'Urology', 11, 4.7, true, true, 750, 'Urologist specializing in minimally invasive procedures'),

-- Mumbai Clinics
('Dr. Arjun Desai', 'arjun.desai@kokilabenhospital.com', '+91-22-30999901', (SELECT id FROM clinics WHERE name = 'Kokilaben Dhirubhai Ambani Hospital' LIMIT 1), 'Cardiology', 20, 5.0, true, true, 1000, 'Chief Cardiologist with 20+ years in cardiac surgery'),
('Dr. Kavita Joshi', 'kavita.joshi@kokilabenhospital.com', '+91-22-30999902', (SELECT id FROM clinics WHERE name = 'Kokilaben Dhirubhai Ambani Hospital' LIMIT 1), 'Oncology', 16, 4.9, true, true, 1200, 'Oncologist specializing in medical oncology'),
('Dr. Rohan Shah', 'rohan.shah@kokilabenhospital.com', '+91-22-30999903', (SELECT id FROM clinics WHERE name = 'Kokilaben Dhirubhai Ambani Hospital' LIMIT 1), 'Orthopedics', 13, 4.8, true, false, 800, 'Sports medicine specialist and orthopedic surgeon'),

-- Lilavati Hospital
('Dr. Nisha Agarwal', 'nisha.agarwal@lilavatihospital.com', '+91-22-26751001', (SELECT id FROM clinics WHERE name = 'Lilavati Hospital' LIMIT 1), 'Gynecology', 17, 4.9, true, true, 750, 'Senior gynecologist with expertise in infertility treatment'),
('Dr. Manoj Kumar', 'manoj.kumar@lilavatihospital.com', '+91-22-26751002', (SELECT id FROM clinics WHERE name = 'Lilavati Hospital' LIMIT 1), 'ENT', 12, 4.7, true, true, 550, 'ENT specialist with focus on endoscopic procedures'),

-- Bangalore Clinics
('Dr. Deepak Rao', 'deepak.rao@manipalhospitals.com', '+91-80-25024401', (SELECT id FROM clinics WHERE name = 'Manipal Hospital' LIMIT 1), 'General Medicine', 22, 4.8, true, true, 600, 'Family physician with 22 years of experience'),
('Dr. Anjali Menon', 'anjali.menon@manipalhospitals.com', '+91-80-25024402', (SELECT id FROM clinics WHERE name = 'Manipal Hospital' LIMIT 1), 'Pediatrics', 15, 4.9, true, true, 550, 'Pediatrician specializing in neonatal care'),
('Dr. Suresh Babu', 'suresh.babu@manipalhospitals.com', '+91-80-25024403', (SELECT id FROM clinics WHERE name = 'Manipal Hospital' LIMIT 1), 'Dermatology', 10, 4.6, true, true, 650, 'Dermatologist with expertise in laser treatments'),

-- Chennai Clinics
('Dr. Lakshmi Narayanan', 'lakshmi.narayanan@apollohospitalschennai.com', '+91-44-28290201', (SELECT id FROM clinics WHERE name = 'Apollo Hospitals Chennai' LIMIT 1), 'Cardiology', 19, 4.9, true, true, 850, 'Interventional cardiologist with 500+ angioplasties'),
('Dr. Saravanan Kumar', 'saravanan.kumar@apollohospitalschennai.com', '+91-44-28290202', (SELECT id FROM clinics WHERE name = 'Apollo Hospitals Chennai' LIMIT 1), 'Neurology', 14, 4.8, true, false, 700, 'Neurologist specializing in movement disorders'),
('Dr. Priya Venkatesh', 'priya.venkatesh@apollohospitalschennai.com', '+91-44-28290203', (SELECT id FROM clinics WHERE name = 'Apollo Hospitals Chennai' LIMIT 1), 'Ophthalmology', 11, 4.7, true, true, 600, 'Eye surgeon with expertise in cataract surgery'),

-- Hyderabad Clinics
('Dr. Rajendra Prasad', 'rajendra.prasad@apollohospitals.com', '+91-40-23607701', (SELECT id FROM clinics WHERE name = 'Apollo Hospitals Hyderabad' LIMIT 1), 'General Medicine', 25, 4.9, true, true, 650, 'Senior physician with expertise in internal medicine'),
('Dr. Fatima Khan', 'fatima.khan@apollohospitals.com', '+91-40-23607702', (SELECT id FROM clinics WHERE name = 'Apollo Hospitals Hyderabad' LIMIT 1), 'Gynecology', 16, 4.8, true, true, 700, 'Obstetrician with focus on high-risk pregnancies'),
('Dr. Venkatesh Reddy', 'venkatesh.reddy@apollohospitals.com', '+91-40-23607703', (SELECT id FROM clinics WHERE name = 'Apollo Hospitals Hyderabad' LIMIT 1), 'Orthopedics', 13, 4.7, true, true, 750, 'Joint replacement specialist'),

-- Kolkata Clinics
('Dr. Subhash Chandra', 'subhash.chandra@apollokolkata.com', '+91-33-23202101', (SELECT id FROM clinics WHERE name = 'Apollo Gleneagles Hospitals' LIMIT 1), 'Cardiology', 21, 4.9, true, true, 900, 'Cardiac surgeon with 1000+ bypass surgeries'),
('Dr. Rina Banerjee', 'rina.banerjee@apollokolkata.com', '+91-33-23202102', (SELECT id FROM clinics WHERE name = 'Apollo Gleneagles Hospitals' LIMIT 1), 'Dermatology', 12, 4.7, true, true, 600, 'Cosmetic dermatologist and skin specialist'),
('Dr. Amitava Das', 'amitava.das@apollokolkata.com', '+91-33-23202103', (SELECT id FROM clinics WHERE name = 'Apollo Gleneagles Hospitals' LIMIT 1), 'ENT', 15, 4.8, true, false, 550, 'ENT surgeon specializing in cochlear implants'),

-- Pune Clinics
('Dr. Shalini Joshi', 'shalini.joshi@rubyhall.com', '+91-20-26163301', (SELECT id FROM clinics WHERE name = 'Ruby Hall Clinic' LIMIT 1), 'Gynecology', 18, 4.9, true, true, 750, 'Senior gynecologist and infertility specialist'),
('Dr. Rajesh Kulkarni', 'rajesh.kulkarni@rubyhall.com', '+91-20-26163302', (SELECT id FROM clinics WHERE name = 'Ruby Hall Clinic' LIMIT 1), 'Orthopedics', 16, 4.8, true, true, 700, 'Orthopedic surgeon specializing in spine surgery'),
('Dr. Meera Deshpande', 'meera.deshpande@rubyhall.com', '+91-20-26163303', (SELECT id FROM clinics WHERE name = 'Ruby Hall Clinic' LIMIT 1), 'Pediatrics', 10, 4.6, true, true, 500, 'Pediatrician with focus on developmental disorders');
