-- Insert doctors for remaining hospitals (excluding the already populated ones)
-- 2-4 doctors per hospital with random realistic data

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

-- Apollo Hospitals Ahmedabad
('Dr. Vikram Patel', 'vikram.patel@apolloahmedabad.com', '+91-79-66776601', (SELECT id::text FROM clinics WHERE name = 'Apollo Hospitals Ahmedabad' LIMIT 1), 'Orthopedics', 19, 4.9, true, true, 850, 'Joint replacement surgeon with 500+ surgeries'),
('Dr. Meera Shah', 'meera.shah@apolloahmedabad.com', '+91-79-66776602', (SELECT id::text FROM clinics WHERE name = 'Apollo Hospitals Ahmedabad' LIMIT 1), 'Pediatrics', 13, 4.7, true, false, 550, 'Pediatrician focused on developmental disorders'),
('Dr. Arjun Desai', 'arjun.desai@apolloahmedabad.com', '+91-79-66776603', (SELECT id::text FROM clinics WHERE name = 'Apollo Hospitals Ahmedabad' LIMIT 1), 'ENT', 11, 4.6, true, true, 600, 'ENT specialist with expertise in sinus surgery'),

-- Apollo Hospitals Bangalore
('Dr. Deepa Nair', 'deepa.nair@apollohospitalsbangalore.com', '+91-80-26304001', (SELECT id::text FROM clinics WHERE name = 'Apollo Hospitals Bangalore' LIMIT 1), 'Oncology', 21, 5.0, true, true, 1200, 'Medical oncologist specializing in breast cancer'),
('Dr. Suresh Babu', 'suresh.babu@apollohospitalsbangalore.com', '+91-80-26304002', (SELECT id::text FROM clinics WHERE name = 'Apollo Hospitals Bangalore' LIMIT 1), 'Neurology', 16, 4.8, true, true, 850, 'Neurologist with focus on epilepsy treatment'),
('Dr. Anjali Menon', 'anjali.menon@apollohospitalsbangalore.com', '+91-80-26304003', (SELECT id::text FROM clinics WHERE name = 'Apollo Hospitals Bangalore' LIMIT 1), 'Dermatology', 12, 4.7, true, false, 700, 'Cosmetic dermatologist and laser specialist'),

-- Apollo Medics Super Speciality Hospital
('Dr. Rajesh Tiwari', 'rajesh.tiwari@apollomedicslucknow.com', '+91-522-67888801', (SELECT id::text FROM clinics WHERE name = 'Apollo Medics Super Speciality Hospital' LIMIT 1), 'Cardiology', 17, 4.8, true, true, 900, 'Cardiologist specializing in electrophysiology'),
('Dr. Sunita Yadav', 'sunita.yadav@apollomedicslucknow.com', '+91-522-67888802', (SELECT id::text FROM clinics WHERE name = 'Apollo Medics Super Speciality Hospital' LIMIT 1), 'Gynecology', 14, 4.7, true, true, 700, 'Gynecologist with expertise in infertility'),

-- Artemis Hospitals
('Dr. Manoj Kumar', 'manoj.kumar@artemishospitals.com', '+91-124-67679901', (SELECT id::text FROM clinics WHERE name = 'Artemis Hospitals' LIMIT 1), 'Orthopedics', 20, 4.9, true, true, 950, 'Spine surgeon with minimally invasive techniques'),
('Dr. Kavita Joshi', 'kavita.joshi@artemishospitals.com', '+91-124-67679902', (SELECT id::text FROM clinics WHERE name = 'Artemis Hospitals' LIMIT 1), 'Pediatrics', 15, 4.8, true, false, 600, 'Pediatric cardiologist'),
('Dr. Amit Singh', 'amit.singh@artemishospitals.com', '+91-124-67679903', (SELECT id::text FROM clinics WHERE name = 'Artemis Hospitals' LIMIT 1), 'Urology', 13, 4.7, true, true, 750, 'Urologist specializing in prostate diseases'),

-- Belle Vue Clinic
('Dr. Subhash Chandra', 'subhash.chandra@belle-vueclinic.com', '+91-33-22832701', (SELECT id::text FROM clinics WHERE name = 'Belle Vue Clinic' LIMIT 1), 'General Medicine', 25, 4.9, true, true, 650, 'Internal medicine specialist with 25 years experience'),
('Dr. Rina Banerjee', 'rina.banerjee@belle-vueclinic.com', '+91-33-22832702', (SELECT id::text FROM clinics WHERE name = 'Belle Vue Clinic' LIMIT 1), 'Dermatology', 18, 4.8, true, true, 700, 'Dermatologist with expertise in vitiligo treatment'),

-- BGS Gleneagles Global Hospital
('Dr. Venkatesh Reddy', 'venkatesh.reddy@bgsgleneagles.com', '+91-80-26255501', (SELECT id::text FROM clinics WHERE name = 'BGS Gleneagles Global Hospital' LIMIT 1), 'Cardiology', 19, 4.9, true, true, 1000, 'Cardiac surgeon specializing in valve replacements'),
('Dr. Fatima Khan', 'fatima.khan@bgsgleneagles.com', '+91-80-26255502', (SELECT id::text FROM clinics WHERE name = 'BGS Gleneagles Global Hospital' LIMIT 1), 'Oncology', 16, 4.8, true, false, 1100, 'Radiation oncologist'),
('Dr. Rajendra Prasad', 'rajendra.prasad@bgsgleneagles.com', '+91-80-26255503', (SELECT id::text FROM clinics WHERE name = 'BGS Gleneagles Global Hospital' LIMIT 1), 'Neurology', 14, 4.7, true, true, 800, 'Neurologist with focus on stroke rehabilitation'),

-- Bharatpur Hospital
('Dr. Sunil Sharma', 'sunil.sharma@bharatpurhospital.com', '+91-5644-222201', (SELECT id::text FROM clinics WHERE name = 'Bharatpur Hospital' LIMIT 1), 'General Medicine', 12, 4.6, true, true, 550, 'General physician with rural healthcare experience'),
('Dr. Rekha Gupta', 'rekha.gupta@bharatpurhospital.com', '+91-5644-222202', (SELECT id::text FROM clinics WHERE name = 'Bharatpur Hospital' LIMIT 1), 'Pediatrics', 8, 4.5, true, false, 500, 'Pediatrician specializing in malnutrition'),

-- Billroth Hospitals
('Dr. Saravanan Kumar', 'saravanan.kumar@billrothhospitals.com', '+91-44-42921701', (SELECT id::text FROM clinics WHERE name = 'Billroth Hospitals' LIMIT 1), 'Orthopedics', 15, 4.8, true, true, 750, 'Orthopedic surgeon with trauma expertise'),
('Dr. Lakshmi Narayanan', 'lakshmi.narayanan@billrothhospitals.com', '+91-44-42921702', (SELECT id::text FROM clinics WHERE name = 'Billroth Hospitals' LIMIT 1), 'Gynecology', 13, 4.7, true, true, 700, 'Gynecologist specializing in endoscopy'),

-- BLK Super Speciality Hospital
('Dr. Priya Venkatesh', 'priya.venkatesh@blkhospital.com', '+91-11-30403001', (SELECT id::text FROM clinics WHERE name = 'BLK Super Speciality Hospital' LIMIT 1), 'Oncology', 20, 4.9, true, true, 1150, 'Surgical oncologist with expertise in gastrointestinal cancers'),
('Dr. Karan Jain', 'karan.jain@blkhospital.com', '+91-11-30403002', (SELECT id::text FROM clinics WHERE name = 'BLK Super Speciality Hospital' LIMIT 1), 'Neurology', 17, 4.8, true, false, 850, 'Neurologist specializing in multiple sclerosis'),
('Dr. Sunita Gupta', 'sunita.gupta@blkhospital.com', '+91-11-30403003', (SELECT id::text FROM clinics WHERE name = 'BLK Super Speciality Hospital' LIMIT 1), 'Dermatology', 12, 4.7, true, true, 650, 'Dermatologist with cosmetic procedures'),

-- Bombay Hospital
('Dr. Rohan Shah', 'rohan.shah@bombayhospital.com', '+91-22-22067601', (SELECT id::text FROM clinics WHERE name = 'Bombay Hospital' LIMIT 1), 'Cardiology', 23, 4.9, true, true, 1000, 'Senior cardiologist with echocardiography expertise'),
('Dr. Nisha Agarwal', 'nisha.agarwal@bombayhospital.com', '+91-22-22067602', (SELECT id::text FROM clinics WHERE name = 'Bombay Hospital' LIMIT 1), 'ENT', 16, 4.8, true, true, 600, 'ENT surgeon with head and neck oncology'),

-- Bowring & Lady Curzon Hospital
('Dr. Arjun Rao', 'arjun.rao@bowringhospital.com', '+91-80-22975501', (SELECT id::text FROM clinics WHERE name = 'Bowring & Lady Curzon Hospital' LIMIT 1), 'General Medicine', 18, 4.7, true, true, 600, 'Internal medicine physician'),
('Dr. Meera Deshpande', 'meera.deshpande@bowringhospital.com', '+91-80-22975502', (SELECT id::text FROM clinics WHERE name = 'Bowring & Lady Curzon Hospital' LIMIT 1), 'Pediatrics', 11, 4.6, true, false, 550, 'Pediatrician with infectious diseases focus'),

-- Breach Candy Hospital
('Dr. Shalini Joshi', 'shalini.joshi@breachcandyhospital.org', '+91-22-23667701', (SELECT id::text FROM clinics WHERE name = 'Breach Candy Hospital' LIMIT 1), 'Gynecology', 19, 4.9, true, true, 800, 'Senior gynecologist and IVF specialist'),
('Dr. Rajesh Kulkarni', 'rajesh.kulkarni@breachcandyhospital.org', '+91-22-23667702', (SELECT id::text FROM clinics WHERE name = 'Breach Candy Hospital' LIMIT 1), 'Orthopedics', 15, 4.8, true, true, 850, 'Joint replacement specialist'),

-- Calcutta Medical Research Institute
('Dr. Amitava Das', 'amitava.das@cmri.in', '+91-33-24567001', (SELECT id::text FROM clinics WHERE name = 'Calcutta Medical Research Institute' LIMIT 1), 'Urology', 14, 4.7, true, true, 750, 'Urologist with endourology expertise'),
('Dr. Rina Chatterjee', 'rina.chatterjee@cmri.in', '+91-33-24567002', (SELECT id::text FROM clinics WHERE name = 'Calcutta Medical Research Institute' LIMIT 1), 'Dermatology', 10, 4.6, true, false, 650, 'Dermatologist specializing in psoriasis'),

-- Care Hospitals
('Dr. Subrata Banerjee', 'subrata.banerjee@carehospitals.com', '+91-40-30418801', (SELECT id::text FROM clinics WHERE name = 'Care Hospitals' LIMIT 1), 'Cardiology', 21, 4.9, true, true, 950, 'Interventional cardiologist'),
('Dr. Kavita Joshi', 'kavita.joshi@carehospitals.com', '+91-40-30418802', (SELECT id::text FROM clinics WHERE name = 'Care Hospitals' LIMIT 1), 'Oncology', 18, 4.8, true, true, 1100, 'Medical oncologist'),

-- Charak Hospital
('Dr. Manoj Kumar', 'manoj.kumar@charakhospital.com', '+91-522-273001', (SELECT id::text FROM clinics WHERE name = 'Charak Hospital' LIMIT 1), 'General Medicine', 16, 4.7, true, true, 600, 'Family medicine practitioner'),
('Dr. Sunita Yadav', 'sunita.yadav@charakhospital.com', '+91-522-273002', (SELECT id::text FROM clinics WHERE name = 'Charak Hospital' LIMIT 1), 'Gynecology', 12, 4.6, true, false, 650, 'Gynecologist with laparoscopy skills'),

-- CIMS Hospital
('Dr. Vikram Patel', 'vikram.patel@cims.org', '+91-79-27717701', (SELECT id::text FROM clinics WHERE name = 'CIMS Hospital' LIMIT 1), 'Orthopedics', 17, 4.8, true, true, 800, 'Orthopedic surgeon with arthroscopy'),
('Dr. Meera Shah', 'meera.shah@cims.org', '+91-79-27717702', (SELECT id::text FROM clinics WHERE name = 'CIMS Hospital' LIMIT 1), 'Pediatrics', 13, 4.7, true, true, 550, 'Pediatric gastroenterologist'),

-- Cloudnine Hospital (Bangalore)
('Dr. Deepa Nair', 'deepa.nair@cloudninecare.com', '+91-80-39893301', (SELECT id::text FROM clinics WHERE name = 'Cloudnine Hospital' LIMIT 1), 'Gynecology', 15, 4.8, true, true, 750, 'Obstetrician and maternal fetal medicine specialist'),
('Dr. Suresh Babu', 'suresh.babu@cloudninecare.com', '+91-80-39893302', (SELECT id::text FROM clinics WHERE name = 'Cloudnine Hospital' LIMIT 1), 'Pediatrics', 11, 4.7, true, false, 600, 'Neonatologist with NICU experience'),

-- Cloudnine Hospital (Delhi)
('Dr. Anjali Menon', 'anjali.menon@cloudninecare.com', '+91-11-40512301', (SELECT id::text FROM clinics WHERE name = 'Cloudnine Hospital' LIMIT 1), 'Gynecology', 14, 4.7, true, true, 700, 'Gynecologist specializing in infertility'),
('Dr. Karan Mehta', 'karan.mehta@cloudninecare.com', '+91-11-40512302', (SELECT id::text FROM clinics WHERE name = 'Cloudnine Hospital' LIMIT 1), 'Pediatrics', 10, 4.6, true, true, 550, 'Pediatrician with developmental pediatrics'),

-- Columbia Asia Hospital (Gurgaon)
('Dr. Priya Jain', 'priya.jain@columbiaasia.com', '+91-124-39844401', (SELECT id::text FROM clinics WHERE name = 'Columbia Asia Hospital' LIMIT 1), 'Dermatology', 12, 4.7, true, true, 650, 'Dermatologist with aesthetic procedures'),
('Dr. Rohit Sharma', 'rohit.sharma@columbiaasia.com', '+91-124-39844402', (SELECT id::text FROM clinics WHERE name = 'Columbia Asia Hospital' LIMIT 1), 'ENT', 9, 4.5, true, false, 550, 'ENT specialist with allergy management'),

-- Columbia Asia Hospital (Bangalore)
('Dr. Subhash Chandra', 'subhash.chandra@columbiaasia.com', '+91-80-41791001', (SELECT id::text FROM clinics WHERE name = 'Columbia Asia Hospital' LIMIT 1), 'Cardiology', 18, 4.8, true, true, 900, 'Cardiologist with preventive cardiology'),
('Dr. Rina Banerjee', 'rina.banerjee@columbiaasia.com', '+91-80-41791002', (SELECT id::text FROM clinics WHERE name = 'Columbia Asia Hospital' LIMIT 1), 'Neurology', 14, 4.7, true, true, 800, 'Neurologist specializing in headaches'),

-- Columbia Asia Hospital (Pune)
('Dr. Venkatesh Reddy', 'venkatesh.reddy@columbiaasia.com', '+91-20-67999901', (SELECT id::text FROM clinics WHERE name = 'Columbia Asia Hospital' LIMIT 1), 'Orthopedics', 16, 4.8, true, true, 750, 'Sports medicine orthopedic surgeon'),
('Dr. Fatima Khan', 'fatima.khan@columbiaasia.com', '+91-20-67999902', (SELECT id::text FROM clinics WHERE name = 'Columbia Asia Hospital' LIMIT 1), 'Gynecology', 13, 4.7, true, false, 700, 'Gynecologist with menopause management'),

-- Continental Hospitals
('Dr. Rajendra Prasad', 'rajendra.prasad@continentahospitals.com', '+91-40-67000001', (SELECT id::text FROM clinics WHERE name = 'Continental Hospitals' LIMIT 1), 'Oncology', 20, 4.9, true, true, 1150, 'Surgical oncologist'),
('Dr. Lakshmi Narayanan', 'lakshmi.narayanan@continentahospitals.com', '+91-40-67000002', (SELECT id::text FROM clinics WHERE name = 'Continental Hospitals' LIMIT 1), 'Cardiology', 17, 4.8, true, true, 950, 'Cardiac electrophysiologist'),

-- Deen Dayal Upadhyay Hospital
('Dr. Saravanan Kumar', 'saravanan.kumar@dduh.in', '+91-11-25922201', (SELECT id::text FROM clinics WHERE name = 'Deen Dayal Upadhyay Hospital' LIMIT 1), 'General Medicine', 14, 4.6, true, true, 550, 'General physician'),
('Dr. Priya Venkatesh', 'priya.venkatesh@dduh.in', '+91-11-25922202', (SELECT id::text FROM clinics WHERE name = 'Deen Dayal Upadhyay Hospital' LIMIT 1), 'Pediatrics', 9, 4.5, true, false, 500, 'Pediatrician'),

-- Deenanath Mangeshkar Hospital
('Dr. Karan Jain', 'karan.jain@dmhospital.org', '+91-20-40151001', (SELECT id::text FROM clinics WHERE name = 'Deenanath Mangeshkar Hospital' LIMIT 1), 'Neurology', 15, 4.7, true, true, 800, 'Neurologist with movement disorders'),
('Dr. Sunita Gupta', 'sunita.gupta@dmhospital.org', '+91-20-40151002', (SELECT id::text FROM clinics WHERE name = 'Deenanath Mangeshkar Hospital' LIMIT 1), 'Dermatology', 11, 4.6, true, true, 650, 'Dermatologist'),

-- Dr. Ram Manohar Lohia Hospital
('Dr. Rohan Shah', 'rohan.shah@rmlh.nic.in', '+91-11-23365501', (SELECT id::text FROM clinics WHERE name = 'Dr. Ram Manohar Lohia Hospital' LIMIT 1), 'Urology', 16, 4.8, true, true, 750, 'Urologist'),
('Dr. Nisha Agarwal', 'nisha.agarwal@rmlh.nic.in', '+91-11-23365502', (SELECT id::text FROM clinics WHERE name = 'Dr. Ram Manohar Lohia Hospital' LIMIT 1), 'Gynecology', 12, 4.7, true, false, 650, 'Gynecologist'),

-- EHCC Hospital
('Dr. Arjun Rao', 'arjun.rao@ehcc.org', '+91-141-27403001', (SELECT id::text FROM clinics WHERE name = 'EHCC Hospital' LIMIT 1), 'Orthopedics', 13, 4.7, true, true, 700, 'Orthopedic surgeon'),
('Dr. Meera Deshpande', 'meera.deshpande@ehcc.org', '+91-141-27403002', (SELECT id::text FROM clinics WHERE name = 'EHCC Hospital' LIMIT 1), 'Pediatrics', 10, 4.6, true, true, 550, 'Pediatrician'),

-- Era's Lucknow Medical College
('Dr. Shalini Joshi', 'shalini.joshi@elmcindia.org', '+91-522-24080001', (SELECT id::text FROM clinics WHERE name = 'Era''s Lucknow Medical College' LIMIT 1), 'Cardiology', 14, 4.7, true, true, 800, 'Cardiologist'),
('Dr. Rajesh Kulkarni', 'rajesh.kulkarni@elmcindia.org', '+91-522-24080002', (SELECT id::text FROM clinics WHERE name = 'Era''s Lucknow Medical College' LIMIT 1), 'Oncology', 11, 4.6, true, false, 1000, 'Oncologist'),

-- Fortis Escorts Hospital
('Dr. Amitava Das', 'amitava.das@fortisjaipur.com', '+91-141-25470001', (SELECT id::text FROM clinics WHERE name = 'Fortis Escorts Hospital' LIMIT 1), 'Neurology', 18, 4.8, true, true, 850, 'Neurologist'),
('Dr. Rina Chatterjee', 'rina.chatterjee@fortisjaipur.com', '+91-141-25470002', (SELECT id::text FROM clinics WHERE name = 'Fortis Escorts Hospital' LIMIT 1), 'Dermatology', 15, 4.7, true, true, 700, 'Dermatologist'),

-- Fortis Hospital Bangalore
('Dr. Subrata Banerjee', 'subrata.banerjee@fortishealthcare.com', '+91-80-41994401', (SELECT id::text FROM clinics WHERE name = 'Fortis Hospital Bangalore' LIMIT 1), 'Cardiology', 19, 4.9, true, true, 950, 'Cardiologist'),
('Dr. Kavita Joshi', 'kavita.joshi@fortishealthcare.com', '+91-80-41994402', (SELECT id::text FROM clinics WHERE name = 'Fortis Hospital Bangalore' LIMIT 1), 'Gynecology', 16, 4.8, true, false, 750, 'Gynecologist'),

-- Fortis Hospital Shalimar Bagh
('Dr. Manoj Kumar', 'manoj.kumar@fortishealthcare.com', '+91-11-45302201', (SELECT id::text FROM clinics WHERE name = 'Fortis Hospital Shalimar Bagh' LIMIT 1), 'Orthopedics', 17, 4.8, true, true, 800, 'Orthopedic surgeon'),
('Dr. Sunita Yadav', 'sunita.yadav@fortishealthcare.com', '+91-11-45302202', (SELECT id::text FROM clinics WHERE name = 'Fortis Hospital Shalimar Bagh' LIMIT 1), 'Pediatrics', 13, 4.7, true, true, 600, 'Pediatrician'),

-- Fortis Malar Hospital
('Dr. Vikram Patel', 'vikram.patel@fortismalar.com', '+91-44-42892201', (SELECT id::text FROM clinics WHERE name = 'Fortis Malar Hospital' LIMIT 1), 'Urology', 15, 4.8, true, true, 800, 'Urologist'),
('Dr. Meera Shah', 'meera.shah@fortismalar.com', '+91-44-42892202', (SELECT id::text FROM clinics WHERE name = 'Fortis Malar Hospital' LIMIT 1), 'ENT', 12, 4.7, true, false, 600, 'ENT specialist'),

-- Gandhi Hospital
('Dr. Deepa Nair', 'deepa.nair@gandhihospital.in', '+91-40-27505501', (SELECT id::text FROM clinics WHERE name = 'Gandhi Hospital' LIMIT 1), 'General Medicine', 20, 4.8, true, true, 600, 'Internal medicine'),
('Dr. Suresh Babu', 'suresh.babu@gandhihospital.in', '+91-40-27505502', (SELECT id::text FROM clinics WHERE name = 'Gandhi Hospital' LIMIT 1), 'Pediatrics', 14, 4.7, true, true, 550, 'Pediatrician'),

-- Global Health City
('Dr. Anjali Menon', 'anjali.menon@globalhealthcity.com', '+91-44-44777001', (SELECT id::text FROM clinics WHERE name = 'Global Health City' LIMIT 1), 'Oncology', 18, 4.9, true, true, 1100, 'Oncologist'),
('Dr. Karan Mehta', 'karan.mehta@globalhealthcity.com', '+91-44-44777002', (SELECT id::text FROM clinics WHERE name = 'Global Health City' LIMIT 1), 'Neurology', 15, 4.8, true, false, 850, 'Neurologist'),

-- Global Hospitals
('Dr. Priya Jain', 'priya.jain@globalhospitalsindia.com', '+91-22-67670101', (SELECT id::text FROM clinics WHERE name = 'Global Hospitals' LIMIT 1), 'Cardiology', 21, 4.9, true, true, 1000, 'Cardiac surgeon'),
('Dr. Rohit Sharma', 'rohit.sharma@globalhospitalsindia.com', '+91-22-67670102', (SELECT id::text FROM clinics WHERE name = 'Global Hospitals' LIMIT 1), 'Gynecology', 17, 4.8, true, true, 800, 'Gynecologist'),

-- HCG Hospitals
('Dr. Subhash Chandra', 'subhash.chandra@hcghospitals.in', '+91-79-66114401', (SELECT id::text FROM clinics WHERE name = 'HCG Hospitals' LIMIT 1), 'Oncology', 19, 4.9, true, true, 1150, 'Oncologist'),
('Dr. Rina Banerjee', 'rina.banerjee@hcghospitals.in', '+91-79-66114402', (SELECT id::text FROM clinics WHERE name = 'HCG Hospitals' LIMIT 1), 'Dermatology', 14, 4.8, true, false, 700, 'Dermatologist'),

-- Hindu Rao Hospital
('Dr. Venkatesh Reddy', 'venkatesh.reddy@hindurao.nic.in', '+91-11-23919701', (SELECT id::text FROM clinics WHERE name = 'Hindu Rao Hospital' LIMIT 1), 'General Medicine', 16, 4.7, true, true, 550, 'General physician'),
('Dr. Fatima Khan', 'fatima.khan@hindurao.nic.in', '+91-11-23919702', (SELECT id::text FROM clinics WHERE name = 'Hindu Rao Hospital' LIMIT 1), 'Pediatrics', 11, 4.6, true, true, 500, 'Pediatrician'),

-- Hiranandani Hospital
('Dr. Rajendra Prasad', 'rajendra.prasad@hiranandanihospital.org', '+91-22-25763301', (SELECT id::text FROM clinics WHERE name = 'Hiranandani Hospital' LIMIT 1), 'Orthopedics', 18, 4.8, true, true, 850, 'Orthopedic surgeon'),
('Dr. Lakshmi Narayanan', 'lakshmi.narayanan@hiranandanihospital.org', '+91-22-25763302', (SELECT id::text FROM clinics WHERE name = 'Hiranandani Hospital' LIMIT 1), 'Gynecology', 15, 4.7, true, false, 750, 'Gynecologist'),

-- Jaipur Hospital
('Dr. Saravanan Kumar', 'saravanan.kumar@jaipurhospital.com', '+91-141-22018001', (SELECT id::text FROM clinics WHERE name = 'Jaipur Hospital' LIMIT 1), 'Cardiology', 13, 4.7, true, true, 800, 'Cardiologist'),
('Dr. Priya Venkatesh', 'priya.venkatesh@jaipurhospital.com', '+91-141-22018002', (SELECT id::text FROM clinics WHERE name = 'Jaipur Hospital' LIMIT 1), 'ENT', 9, 4.5, true, true, 550, 'ENT specialist'),

-- Jaslok Hospital
('Dr. Karan Jain', 'karan.jain@jaslokhospital.net', '+91-22-66573001', (SELECT id::text FROM clinics WHERE name = 'Jaslok Hospital' LIMIT 1), 'Neurology', 20, 4.9, true, true, 900, 'Neurologist'),
('Dr. Sunita Gupta', 'sunita.gupta@jaslokhospital.net', '+91-22-66573002', (SELECT id::text FROM clinics WHERE name = 'Jaslok Hospital' LIMIT 1), 'Dermatology', 16, 4.8, true, false, 750, 'Dermatologist'),

-- Jayadeva Institute of Cardiology
('Dr. Rohan Shah', 'rohan.shah@jayadevacardiology.org', '+91-80-22977301', (SELECT id::text FROM clinics WHERE name = 'Jayadeva Institute of Cardiology' LIMIT 1), 'Cardiology', 22, 4.9, true, true, 1000, 'Cardiologist'),
('Dr. Nisha Agarwal', 'nisha.agarwal@jayadevacardiology.org', '+91-80-22977302', (SELECT id::text FROM clinics WHERE name = 'Jayadeva Institute of Cardiology' LIMIT 1), 'Cardiology', 18, 4.8, true, true, 950, 'Cardiologist'),

-- Jehangir Hospital
('Dr. Arjun Rao', 'arjun.rao@jehangirhospital.com', '+91-20-66819901', (SELECT id::text FROM clinics WHERE name = 'Jehangir Hospital' LIMIT 1), 'Orthopedics', 17, 4.8, true, true, 800, 'Orthopedic surgeon'),
('Dr. Meera Deshpande', 'meera.deshpande@jehangirhospital.com', '+91-20-66819902', (SELECT id::text FROM clinics WHERE name = 'Jehangir Hospital' LIMIT 1), 'Pediatrics', 13, 4.7, true, false, 600, 'Pediatrician'),

-- JJ Hospital
('Dr. Shalini Joshi', 'shalini.joshi@jjhospital.org', '+91-22-23735501', (SELECT id::text FROM clinics WHERE name = 'JJ Hospital' LIMIT 1), 'General Medicine', 19, 4.8, true, true, 600, 'Internal medicine'),
('Dr. Rajesh Kulkarni', 'rajesh.kulkarni@jjhospital.org', '+91-22-23735502', (SELECT id::text FROM clinics WHERE name = 'JJ Hospital' LIMIT 1), 'Gynecology', 14, 4.7, true, true, 650, 'Gynecologist'),

-- KEM Hospital (Pune)
('Dr. Amitava Das', 'amitava.das@kemhospital.org', '+91-20-26058201', (SELECT id::text FROM clinics WHERE name = 'KEM Hospital' LIMIT 1), 'Urology', 15, 4.8, true, true, 750, 'Urologist'),
('Dr. Rina Chatterjee', 'rina.chatterjee@kemhospital.org', '+91-20-26058202', (SELECT id::text FROM clinics WHERE name = 'KEM Hospital' LIMIT 1), 'ENT', 11, 4.6, true, false, 600, 'ENT specialist'),

-- Kidwai Memorial Institute of Oncology
('Dr. Subrata Banerjee', 'subrata.banerjee@kidwai.kar.nic.in', '+91-80-26094001', (SELECT id::text FROM clinics WHERE name = 'Kidwai Memorial Institute of Oncology' LIMIT 1), 'Oncology', 21, 4.9, true, true, 1100, 'Oncologist'),
('Dr. Kavita Joshi', 'kavita.joshi@kidwai.kar.nic.in', '+91-80-26094002', (SELECT id::text FROM clinics WHERE name = 'Kidwai Memorial Institute of Oncology' LIMIT 1), 'Oncology', 17, 4.8, true, true, 1050, 'Oncologist'),

-- Kilpauk Medical College Hospital
('Dr. Manoj Kumar', 'manoj.kumar@kmc.ac.in', '+91-44-26431901', (SELECT id::text FROM clinics WHERE name = 'Kilpauk Medical College Hospital' LIMIT 1), 'General Medicine', 18, 4.7, true, true, 550, 'General physician'),
('Dr. Sunita Yadav', 'sunita.yadav@kmc.ac.in', '+91-44-26431902', (SELECT id::text FROM clinics WHERE name = 'Kilpauk Medical College Hospital' LIMIT 1), 'Pediatrics', 12, 4.6, true, true, 500, 'Pediatrician'),

-- KIMS Hospitals
('Dr. Vikram Patel', 'vikram.patel@kims.co.in', '+91-40-44885001', (SELECT id::text FROM clinics WHERE name = 'KIMS Hospitals' LIMIT 1), 'Orthopedics', 19, 4.8, true, true, 850, 'Orthopedic surgeon'),
('Dr. Meera Shah', 'meera.shah@kims.co.in', '+91-40-44885002', (SELECT id::text FROM clinics WHERE name = 'KIMS Hospitals' LIMIT 1), 'Pediatrics', 14, 4.7, true, false, 600, 'Pediatrician'),

-- Lady Hardinge Medical College
('Dr. Deepa Nair', 'deepa.nair@lhmc.in', '+91-11-23363701', (SELECT id::text FROM clinics WHERE name = 'Lady Hardinge Medical College' LIMIT 1), 'Gynecology', 16, 4.8, true, true, 700, 'Gynecologist'),
('Dr. Suresh Babu', 'suresh.babu@lhmc.in', '+91-11-23363702', (SELECT id::text FROM clinics WHERE name = 'Lady Hardinge Medical College' LIMIT 1), 'Pediatrics', 12, 4.7, true, true, 550, 'Pediatrician'),

-- Lok Nayak Hospital
('Dr. Anjali Menon', 'anjali.menon@lnjp.gov.in', '+91-11-23234201', (SELECT id::text FROM clinics WHERE name = 'Lok Nayak Hospital' LIMIT 1), 'General Medicine', 17, 4.7, true, true, 600, 'General physician'),
('Dr. Karan Mehta', 'karan.mehta@lnjp.gov.in', '+91-11-23234202', (SELECT id::text FROM clinics WHERE name = 'Lok Nayak Hospital' LIMIT 1), 'ENT', 13, 4.6, true, false, 550, 'ENT specialist'),

-- Manipal Hospital
('Dr. Priya Jain', 'priya.jain@manipalhospitals.com', '+91-80-25024401', (SELECT id::text FROM clinics WHERE name = 'Manipal Hospital' LIMIT 1), 'Cardiology', 20, 4.9, true, true, 950, 'Cardiologist'),
('Dr. Rohit Sharma', 'rohit.sharma@manipalhospitals.com', '+91-80-25024402', (SELECT id::text FROM clinics WHERE name = 'Manipal Hospital' LIMIT 1), 'Neurology', 15, 4.8, true, true, 800, 'Neurologist'),

-- Medanta Hospital Lucknow
('Dr. Subhash Chandra', 'subhash.chandra@medantalucknow.com', '+91-522-45050501', (SELECT id::text FROM clinics WHERE name = 'Medanta Hospital Lucknow' LIMIT 1), 'Oncology', 18, 4.9, true, true, 1100, 'Oncologist'),
('Dr. Rina Banerjee', 'rina.banerjee@medantalucknow.com', '+91-522-45050502', (SELECT id::text FROM clinics WHERE name = 'Medanta Hospital Lucknow' LIMIT 1), 'Cardiology', 16, 4.8, true, false, 900, 'Cardiologist'),

-- Medanta The Medicity
('Dr. Venkatesh Reddy', 'venkatesh.reddy@medanta.org', '+91-124-41414101', (SELECT id::text FROM clinics WHERE name = 'Medanta The Medicity' LIMIT 1), 'Orthopedics', 21, 4.9, true, true, 1000, 'Orthopedic surgeon'),
('Dr. Fatima Khan', 'fatima.khan@medanta.org', '+91-124-41414102', (SELECT id::text FROM clinics WHERE name = 'Medanta The Medicity' LIMIT 1), 'Gynecology', 17, 4.8, true, true, 850, 'Gynecologist'),

-- Medica Superspecialty Hospital
('Dr. Rajendra Prasad', 'rajendra.prasad@medicahospitals.in', '+91-33-66520001', (SELECT id::text FROM clinics WHERE name = 'Medica Superspecialty Hospital' LIMIT 1), 'Neurology', 14, 4.7, true, true, 800, 'Neurologist'),
('Dr. Lakshmi Narayanan', 'lakshmi.narayanan@medicahospitals.in', '+91-33-66520002', (SELECT id::text FROM clinics WHERE name = 'Medica Superspecialty Hospital' LIMIT 1), 'Dermatology', 11, 4.6, true, false, 650, 'Dermatologist'),

-- MIOT International
('Dr. Saravanan Kumar', 'saravanan.kumar@miothospitals.com', '+91-44-42002201', (SELECT id::text FROM clinics WHERE name = 'MIOT International' LIMIT 1), 'Orthopedics', 19, 4.9, true, true, 950, 'Joint replacement specialist'),
('Dr. Priya Venkatesh', 'priya.venkatesh@miothospitals.com', '+91-44-42002202', (SELECT id::text FROM clinics WHERE name = 'MIOT International' LIMIT 1), 'Cardiology', 16, 4.8, true, true, 900, 'Cardiologist'),

-- Monilek Hospital
('Dr. Karan Jain', 'karan.jain@monilekhospital.com', '+91-141-26550001', (SELECT id::text FROM clinics WHERE name = 'Monilek Hospital' LIMIT 1), 'General Medicine', 15, 4.7, true, true, 600, 'Internal medicine'),
('Dr. Sunita Gupta', 'sunita.gupta@monilekhospital.com', '+91-141-26550002', (SELECT id::text FROM clinics WHERE name = 'Monilek Hospital' LIMIT 1), 'Pediatrics', 10, 4.6, true, false, 550, 'Pediatrician'),

-- Nanavati Super Speciality Hospital
('Dr. Rohan Shah', 'rohan.shah@nanavatihospital.org', '+91-22-26267501', (SELECT id::text FROM clinics WHERE name = 'Nanavati Super Speciality Hospital' LIMIT 1), 'Oncology', 20, 4.9, true, true, 1150, 'Oncologist'),
('Dr. Nisha Agarwal', 'nisha.agarwal@nanavatihospital.org', '+91-22-26267502', (SELECT id::text FROM clinics WHERE name = 'Nanavati Super Speciality Hospital' LIMIT 1), 'Neurology', 17, 4.8, true, true, 850, 'Neurologist'),

-- Narayana Health
('Dr. Arjun Rao', 'arjun.rao@narayanahealth.org', '+91-80-71222201', (SELECT id::text FROM clinics WHERE name = 'Narayana Health' LIMIT 1), 'Cardiology', 18, 4.8, true, true, 950, 'Cardiologist'),
('Dr. Meera Deshpande', 'meera.deshpande@narayanahealth.org', '+91-80-71222202', (SELECT id::text FROM clinics WHERE name = 'Narayana Health' LIMIT 1), 'Pediatrics', 14, 4.7, true, false, 600, 'Pediatrician'),

-- Nizam's Institute of Medical Sciences
('Dr. Shalini Joshi', 'shalini.joshi@nims.edu.in', '+91-40-23489001', (SELECT id::text FROM clinics WHERE name = 'Nizam''s Institute of Medical Sciences' LIMIT 1), 'Neurology', 19, 4.9, true, true, 900, 'Neurologist'),
('Dr. Rajesh Kulkarni', 'rajesh.kulkarni@nims.edu.in', '+91-40-23489002', (SELECT id::text FROM clinics WHERE name = 'Nizam''s Institute of Medical Sciences' LIMIT 1), 'Oncology', 16, 4.8, true, true, 1100, 'Oncologist'),

-- Noble Hospital
('Dr. Amitava Das', 'amitava.das@noblehospitals.com', '+91-20-66287701', (SELECT id::text FROM clinics WHERE name = 'Noble Hospital' LIMIT 1), 'Orthopedics', 16, 4.8, true, true, 800, 'Orthopedic surgeon'),
('Dr. Rina Chatterjee', 'rina.chatterjee@noblehospitals.com', '+91-20-66287702', (SELECT id::text FROM clinics WHERE name = 'Noble Hospital' LIMIT 1), 'Gynecology', 13, 4.7, true, false, 700, 'Gynecologist'),

-- Paras Hospitals
('Dr. Subrata Banerjee', 'subrata.banerjee@parashospitals.com', '+91-124-45855501', (SELECT id::text FROM clinics WHERE name = 'Paras Hospitals' LIMIT 1), 'Cardiology', 20, 4.9, true, true, 1000, 'Cardiologist'),
('Dr. Kavita Joshi', 'kavita.joshi@parashospitals.com', '+91-124-45855502', (SELECT id::text FROM clinics WHERE name = 'Paras Hospitals' LIMIT 1), 'Dermatology', 15, 4.8, true, true, 750, 'Dermatologist'),

-- Peerless Hospital
('Dr. Manoj Kumar', 'manoj.kumar@peerlesshospital.com', '+91-33-40111201', (SELECT id::text FROM clinics WHERE name = 'Peerless Hospital' LIMIT 1), 'General Medicine', 18, 4.7, true, true, 650, 'General physician'),
('Dr. Sunita Yadav', 'sunita.yadav@peerlesshospital.com', '+91-33-40111202', (SELECT id::text FROM clinics WHERE name = 'Peerless Hospital' LIMIT 1), 'ENT', 12, 4.6, true, false, 600, 'ENT specialist'),

-- Poona Hospital
('Dr. Vikram Patel', 'vikram.patel@poonahospital.org', '+91-20-24331101', (SELECT id::text FROM clinics WHERE name = 'Poona Hospital' LIMIT 1), 'Pediatrics', 14, 4.7, true, true, 550, 'Pediatrician'),
('Dr. Meera Shah', 'meera.shah@poonahospital.org', '+91-20-24331102', (SELECT id::text FROM clinics WHERE name = 'Poona Hospital' LIMIT 1), 'Gynecology', 11, 4.6, true, true, 650, 'Gynecologist'),

-- Prime Hospitals
('Dr. Deepa Nair', 'deepa.nair@primehospitals.in', '+91-40-44777701', (SELECT id::text FROM clinics WHERE name = 'Prime Hospitals' LIMIT 1), 'Oncology', 17, 4.8, true, true, 1050, 'Oncologist'),
('Dr. Suresh Babu', 'suresh.babu@primehospitals.in', '+91-40-44777702', (SELECT id::text FROM clinics WHERE name = 'Prime Hospitals' LIMIT 1), 'Neurology', 14, 4.7, true, false, 800, 'Neurologist'),

-- Rainbow Children's Hospital (Hyderabad)
('Dr. Anjali Menon', 'anjali.menon@rainbowhospitals.in', '+91-40-23311201', (SELECT id::text FROM clinics WHERE name = 'Rainbow Children''s Hospital' LIMIT 1), 'Pediatrics', 15, 4.8, true, true, 600, 'Pediatrician'),
('Dr. Karan Mehta', 'karan.mehta@rainbowhospitals.in', '+91-40-23311202', (SELECT id::text FROM clinics WHERE name = 'Rainbow Children''s Hospital' LIMIT 1), 'Pediatrics', 12, 4.7, true, true, 550, 'Pediatrician'),

-- Rainbow Children's Hospital (Delhi)
('Dr. Priya Jain', 'priya.jain@rainbowhospitals.in', '+91-11-46678801', (SELECT id::text FROM clinics WHERE name = 'Rainbow Children''s Hospital' LIMIT 1), 'Pediatrics', 13, 4.7, true, true, 550, 'Pediatrician'),
('Dr. Rohit Sharma', 'rohit.sharma@rainbowhospitals.in', '+91-11-46678802', (SELECT id::text FROM clinics WHERE name = 'Rainbow Children''s Hospital' LIMIT 1), 'Pediatrics', 10, 4.6, true, false, 500, 'Pediatrician'),

-- Rainbow Children's Hospital (Bangalore)
('Dr. Subhash Chandra', 'subhash.chandra@rainbowhospitals.in', '+91-80-39893301', (SELECT id::text FROM clinics WHERE name = 'Rainbow Children''s Hospital' LIMIT 1), 'Pediatrics', 16, 4.8, true, true, 600, 'Pediatrician'),
('Dr. Rina Banerjee', 'rina.banerjee@rainbowhospitals.in', '+91-80-39893302', (SELECT id::text FROM clinics WHERE name = 'Rainbow Children''s Hospital' LIMIT 1), 'Pediatrics', 11, 4.7, true, true, 550, 'Pediatrician'),

-- Rajiv Gandhi Government General Hospital
('Dr. Venkatesh Reddy', 'venkatesh.reddy@rgggh.tn.gov.in', '+91-44-25305001', (SELECT id::text FROM clinics WHERE name = 'Rajiv Gandhi Government General Hospital' LIMIT 1), 'General Medicine', 19, 4.8, true, true, 600, 'General physician'),
('Dr. Fatima Khan', 'fatima.khan@rgggh.tn.gov.in', '+91-44-25305002', (SELECT id::text FROM clinics WHERE name = 'Rajiv Gandhi Government General Hospital' LIMIT 1), 'Gynecology', 15, 4.7, true, false, 650, 'Gynecologist'),

-- Ram Manohar Lohia Hospital
('Dr. Rajendra Prasad', 'rajendra.prasad@rmlh.nic.in', '+91-11-23365501', (SELECT id::text FROM clinics WHERE name = 'Ram Manohar Lohia Hospital' LIMIT 1), 'Urology', 17, 4.8, true, true, 800, 'Urologist'),
('Dr. Lakshmi Narayanan', 'lakshmi.narayanan@rmlh.nic.in', '+91-11-23365502', (SELECT id::text FROM clinics WHERE name = 'Ram Manohar Lohia Hospital' LIMIT 1), 'ENT', 13, 4.7, true, true, 600, 'ENT specialist'),

-- RG Kar Medical College
('Dr. Saravanan Kumar', 'saravanan.kumar@rgkarmc.edu.in', '+91-33-25557601', (SELECT id::text FROM clinics WHERE name = 'RG Kar Medical College' LIMIT 1), 'General Medicine', 16, 4.7, true, true, 550, 'General physician'),
('Dr. Priya Venkatesh', 'priya.venkatesh@rgkarmc.edu.in', '+91-33-25557602', (SELECT id::text FROM clinics WHERE name = 'RG Kar Medical College' LIMIT 1), 'Pediatrics', 11, 4.6, true, false, 500, 'Pediatrician'),

-- Ruby General Hospital
('Dr. Karan Jain', 'karan.jain@rubyhospital.com', '+91-33-66284401', (SELECT id::text FROM clinics WHERE name = 'Ruby General Hospital' LIMIT 1), 'Cardiology', 14, 4.7, true, true, 850, 'Cardiologist'),
('Dr. Sunita Gupta', 'sunita.gupta@rubyhospital.com', '+91-33-66284402', (SELECT id::text FROM clinics WHERE name = 'Ruby General Hospital' LIMIT 1), 'Dermatology', 10, 4.6, true, true, 650, 'Dermatologist'),

-- Sahyadri Hospitals
('Dr. Rohan Shah', 'rohan.shah@sahyadrihospitals.com', '+91-20-67213001', (SELECT id::text FROM clinics WHERE name = 'Sahyadri Hospitals' LIMIT 1), 'Orthopedics', 18, 4.8, true, true, 850, 'Orthopedic surgeon'),
('Dr. Nisha Agarwal', 'nisha.agarwal@sahyadrihospitals.com', '+91-20-67213002', (SELECT id::text FROM clinics WHERE name = 'Sahyadri Hospitals' LIMIT 1), 'Gynecology', 15, 4.7, true, false, 750, 'Gynecologist'),

-- Saifee Hospital
('Dr. Arjun Rao', 'arjun.rao@saifeehospital.com', '+91-22-67570101', (SELECT id::text FROM clinics WHERE name = 'Saifee Hospital' LIMIT 1), 'Neurology', 16, 4.8, true, true, 850, 'Neurologist'),
('Dr. Meera Deshpande', 'meera.deshpande@saifeehospital.com', '+91-22-67570102', (SELECT id::text FROM clinics WHERE name = 'Saifee Hospital' LIMIT 1), 'Urology', 12, 4.7, true, true, 750, 'Urologist'),

-- Sakra World Hospital
('Dr. Shalini Joshi', 'shalini.joshi@sakraworldhospital.com', '+91-80-49694901', (SELECT id::text FROM clinics WHERE name = 'Sakra World Hospital' LIMIT 1), 'Oncology', 19, 4.9, true, true, 1150, 'Oncologist'),
('Dr. Rajesh Kulkarni', 'rajesh.kulkarni@sakraworldhospital.com', '+91-80-49694902', (SELECT id::text FROM clinics WHERE name = 'Sakra World Hospital' LIMIT 1), 'Cardiology', 17, 4.8, true, false, 950, 'Cardiologist'),

-- Sal Hospital
('Dr. Amitava Das', 'amitava.das@salhospital.com', '+91-79-27551101', (SELECT id::text FROM clinics WHERE name = 'Sal Hospital' LIMIT 1), 'General Medicine', 14, 4.7, true, true, 600, 'General physician'),
('Dr. Rina Chatterjee', 'rina.chatterjee@salhospital.com', '+91-79-27551102', (SELECT id::text FROM clinics WHERE name = 'Sal Hospital' LIMIT 1), 'Pediatrics', 9, 4.5, true, true, 500, 'Pediatrician'),

-- Santokba Durlabhji Memorial Hospital
('Dr. Subrata Banerjee', 'subrata.banerjee@sdmh.in', '+91-141-25662501', (SELECT id::text FROM clinics WHERE name = 'Santokba Durlabhji Memorial Hospital' LIMIT 1), 'Orthopedics', 20, 4.9, true, true, 900, 'Orthopedic surgeon'),
('Dr. Kavita Joshi', 'kavita.joshi@sdmh.in', '+91-141-25662502', (SELECT id::text FROM clinics WHERE name = 'Santokba Durlabhji Memorial Hospital' LIMIT 1), 'Gynecology', 16, 4.8, true, false, 750, 'Gynecologist'),

-- Sassoon General Hospitals
('Dr. Manoj Kumar', 'manoj.kumar@sassoonhospital.org', '+91-20-26128001', (SELECT id::text FROM clinics WHERE name = 'Sassoon General Hospitals' LIMIT 1), 'General Medicine', 17, 4.7, true, true, 550, 'General physician'),
('Dr. Sunita Yadav', 'sunita.yadav@sassoonhospital.org', '+91-20-26128002', (SELECT id::text FROM clinics WHERE name = 'Sassoon General Hospitals' LIMIT 1), 'ENT', 12, 4.6, true, true, 550, 'ENT specialist'),

-- Seven Hills Hospital
('Dr. Vikram Patel', 'vikram.patel@sevenhillshospital.com', '+91-22-67676701', (SELECT id::text FROM clinics WHERE name = 'Seven Hills Hospital' LIMIT 1), 'Cardiology', 21, 4.9, true, true, 1000, 'Cardiologist'),
('Dr. Meera Shah', 'meera.shah@sevenhillshospital.com', '+91-22-67676702', (SELECT id::text FROM clinics WHERE name = 'Seven Hills Hospital' LIMIT 1), 'Oncology', 18, 4.8, true, false, 1100, 'Oncologist'),

-- Sir Ganga Ram Hospital
('Dr. Deepa Nair', 'deepa.nair@sgrh.com', '+91-11-25750001', (SELECT id::text FROM clinics WHERE name = 'Sir Ganga Ram Hospital' LIMIT 1), 'Neurology', 22, 4.9, true, true, 950, 'Neurologist'),
('Dr. Suresh Babu', 'suresh.babu@sgrh.com', '+91-11-25750002', (SELECT id::text FROM clinics WHERE name = 'Sir Ganga Ram Hospital' LIMIT 1), 'Dermatology', 17, 4.8, true, true, 750, 'Dermatologist'),

-- Sparsh Hospital
('Dr. Anjali Menon', 'anjali.menon@sparshhospital.com', '+91-80-49068501', (SELECT id::text FROM clinics WHERE name = 'Sparsh Hospital' LIMIT 1), 'Orthopedics', 19, 4.9, true, true, 950, 'Orthopedic surgeon'),
('Dr. Karan Mehta', 'karan.mehta@sparshhospital.com', '+91-80-49068502', (SELECT id::text FROM clinics WHERE name = 'Sparsh Hospital' LIMIT 1), 'Gynecology', 15, 4.8, true, false, 750, 'Gynecologist'),

-- Sri Ramachandra Medical Centre
('Dr. Priya Jain', 'priya.jain@sriramachandra.edu.in', '+91-44-24768001', (SELECT id::text FROM clinics WHERE name = 'Sri Ramachandra Medical Centre' LIMIT 1), 'Cardiology', 20, 4.9, true, true, 1000, 'Cardiologist'),
('Dr. Rohit Sharma', 'rohit.sharma@sriramachandra.edu.in', '+91-44-24768002', (SELECT id::text FROM clinics WHERE name = 'Sri Ramachandra Medical Centre' LIMIT 1), 'Oncology', 17, 4.8, true, true, 1100, 'Oncologist'),

-- SSKM Hospital
('Dr. Subhash Chandra', 'subhash.chandra@sskm.in', '+91-33-22041101', (SELECT id::text FROM clinics WHERE name = 'SSKM Hospital' LIMIT 1), 'General Medicine', 18, 4.7, true, true, 600, 'General physician'),
('Dr. Rina Banerjee', 'rina.banerjee@sskm.in', '+91-33-22041102', (SELECT id::text FROM clinics WHERE name = 'SSKM Hospital' LIMIT 1), 'Pediatrics', 13, 4.6, true, false, 550, 'Pediatrician'),

-- St. George Hospital
('Dr. Venkatesh Reddy', 'venkatesh.reddy@stgeorgehospital.com', '+91-22-23092801', (SELECT id::text FROM clinics WHERE name = 'St. George Hospital' LIMIT 1), 'Urology', 15, 4.8, true, true, 800, 'Urologist'),
('Dr. Fatima Khan', 'fatima.khan@stgeorgehospital.com', '+91-22-23092802', (SELECT id::text FROM clinics WHERE name = 'St. George Hospital' LIMIT 1), 'ENT', 11, 4.6, true, true, 600, 'ENT specialist'),

-- St. John's Medical College Hospital
('Dr. Rajendra Prasad', 'rajendra.prasad@stjohns.in', '+91-80-22065001', (SELECT id::text FROM clinics WHERE name = 'St. John''s Medical College Hospital' LIMIT 1), 'General Medicine', 21, 4.8, true, true, 650, 'Internal medicine'),
('Dr. Lakshmi Narayanan', 'lakshmi.narayanan@stjohns.in', '+91-80-22065002', (SELECT id::text FROM clinics WHERE name = 'St. John''s Medical College Hospital' LIMIT 1), 'Pediatrics', 16, 4.7, true, false, 600, 'Pediatrician'),

-- Stanley Medical College Hospital
('Dr. Saravanan Kumar', 'saravanan.kumar@stanley.in', '+91-44-25281301', (SELECT id::text FROM clinics WHERE name = 'Stanley Medical College Hospital' LIMIT 1), 'General Medicine', 19, 4.8, true, true, 600, 'General physician'),
('Dr. Priya Venkatesh', 'priya.venkatesh@stanley.in', '+91-44-25281302', (SELECT id::text FROM clinics WHERE name = 'Stanley Medical College Hospital' LIMIT 1), 'Gynecology', 14, 4.7, true, true, 650, 'Gynecologist'),

-- Star Hospitals
('Dr. Karan Jain', 'karan.jain@starhospitals.in', '+91-40-44777701', (SELECT id::text FROM clinics WHERE name = 'Star Hospitals' LIMIT 1), 'Cardiology', 18, 4.8, true, true, 950, 'Cardiologist'),
('Dr. Sunita Gupta', 'sunita.gupta@starhospitals.in', '+91-40-44777702', (SELECT id::text FROM clinics WHERE name = 'Star Hospitals' LIMIT 1), 'Neurology', 15, 4.7, true, false, 850, 'Neurologist'),

-- Sterling Hospital
('Dr. Rohan Shah', 'rohan.shah@sterlinghospitals.com', '+91-79-40011101', (SELECT id::text FROM clinics WHERE name = 'Sterling Hospital' LIMIT 1), 'Orthopedics', 17, 4.8, true, true, 850, 'Orthopedic surgeon'),
('Dr. Nisha Agarwal', 'nisha.agarwal@sterlinghospitals.com', '+91-79-40011102', (SELECT id::text FROM clinics WHERE name = 'Sterling Hospital' LIMIT 1), 'Gynecology', 13, 4.7, true, true, 700, 'Gynecologist'),

-- Victoria Hospital
('Dr. Arjun Rao', 'arjun.rao@victoriahospital.org', '+91-80-26701101', (SELECT id::text FROM clinics WHERE name = 'Victoria Hospital' LIMIT 1), 'General Medicine', 16, 4.7, true, true, 550, 'General physician'),
('Dr. Meera Deshpande', 'meera.deshpande@victoriahospital.org', '+91-80-26701102', (SELECT id::text FROM clinics WHERE name = 'Victoria Hospital' LIMIT 1), 'Pediatrics', 11, 4.6, true, false, 500, 'Pediatrician'),

-- Vijaya Hospital
('Dr. Shalini Joshi', 'shalini.joshi@vijayahospital.org', '+91-44-42017501', (SELECT id::text FROM clinics WHERE name = 'Vijaya Hospital' LIMIT 1), 'Cardiology', 19, 4.9, true, true, 950, 'Cardiologist'),
('Dr. Rajesh Kulkarni', 'rajesh.kulkarni@vijayahospital.org', '+91-44-42017502', (SELECT id::text FROM clinics WHERE name = 'Vijaya Hospital' LIMIT 1), 'Dermatology', 14, 4.8, true, true, 700, 'Dermatologist'),

-- Wockhardt Hospitals
('Dr. Amitava Das', 'amitava.das@wockhardthospitals.com', '+91-22-61784401', (SELECT id::text FROM clinics WHERE name = 'Wockhardt Hospitals' LIMIT 1), 'Oncology', 20, 4.9, true, true, 1150, 'Oncologist'),
('Dr. Rina Chatterjee', 'rina.chatterjee@wockhardthospitals.com', '+91-22-61784402', (SELECT id::text FROM clinics WHERE name = 'Wockhardt Hospitals' LIMIT 1), 'Neurology', 17, 4.8, true, false, 900, 'Neurologist'),

-- Woodlands Multispeciality Hospital
('Dr. Subrata Banerjee', 'subrata.banerjee@woodlandshospital.in', '+91-33-24557001', (SELECT id::text FROM clinics WHERE name = 'Woodlands Multispeciality Hospital' LIMIT 1), 'General Medicine', 18, 4.7, true, true, 650, 'General physician'),
('Dr. Kavita Joshi', 'kavita.joshi@woodlandshospital.in', '+91-33-24557002', (SELECT id::text FROM clinics WHERE name = 'Woodlands Multispeciality Hospital' LIMIT 1), 'ENT', 13, 4.6, true, true, 600, 'ENT specialist'),

-- Yashoda Hospitals
('Dr. Manoj Kumar', 'manoj.kumar@yashodahospitals.com', '+91-40-45678801', (SELECT id::text FROM clinics WHERE name = 'Yashoda Hospitals' LIMIT 1), 'Cardiology', 21, 4.9, true, true, 1000, 'Cardiologist'),
('Dr. Sunita Yadav', 'sunita.yadav@yashodahospitals.com', '+91-40-45678802', (SELECT id::text FROM clinics WHERE name = 'Yashoda Hospitals' LIMIT 1), 'Gynecology', 16, 4.8, true, false, 800, 'Gynecologist');
