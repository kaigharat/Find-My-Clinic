-- Insert 100 clinics across major cities in India
-- This includes major metropolitan areas and tier-2 cities

INSERT INTO clinics (name, address, phone, email, latitude, longitude, status, is_active) VALUES
-- Delhi NCR (20 clinics)
('Apollo Hospitals Delhi', 'Mathura Road, Sarita Vihar, New Delhi, Delhi 110076', '+91-11-26925858', 'info@apollohospitalsdelhi.com', 28.5355, 77.3910, 'open', true),
('Max Super Speciality Hospital', 'FC-50, C & D Block, Shalimar Bagh, Delhi 110088', '+91-11-66422222', 'info@maxhealthcare.com', 28.7171, 77.1500, 'open', true),
('Fortis Hospital Shalimar Bagh', 'A Block, Shalimar Bagh, Delhi 110088', '+91-11-45302222', 'info@fortishealthcare.com', 28.7167, 77.1500, 'open', true),
('BLK Super Speciality Hospital', 'Pusa Road, Delhi 110005', '+91-11-30403040', 'info@blkhospital.com', 28.6387, 77.2066, 'open', true),
('Medanta The Medicity', 'Sector 38, Gurgaon, Haryana 122001', '+91-124-4141414', 'info@medanta.org', 28.4394, 77.0409, 'open', true),
('Artemis Hospitals', 'Sector 51, Gurgaon, Haryana 122001', '+91-124-6767999', 'info@artemishospitals.com', 28.4089, 77.0417, 'open', true),
('Paras Hospitals', 'C-1, Sushant Lok Phase-1, Sector 43, Gurgaon, Haryana 122002', '+91-124-4585555', 'info@parashospitals.com', 28.4595, 77.0724, 'open', true),
('Columbia Asia Hospital', 'Block F, Gol Chakkar, Palam Vihar, Gurgaon, Haryana 122017', '+91-124-3984444', 'info@columbiaasia.com', 28.5053, 77.0967, 'open', true),
('Cloudnine Hospital', 'Plot No. A-2, MSR Enclave, New Delhi, Delhi 110034', '+91-11-40512345', 'info@cloudninecare.com', 28.5677, 77.2074, 'open', true),
('Rainbow Children''s Hospital', 'FC-29, Plot No.5, Geetanjali Enclave, New Delhi, Delhi 110017', '+91-11-46678888', 'info@rainbowhospitals.in', 28.5522, 77.2074, 'open', true),
('Sir Ganga Ram Hospital', 'Rajinder Nagar, New Delhi, Delhi 110060', '+91-11-25750000', 'info@sgrh.com', 28.6399, 77.1892, 'open', true),
('Lok Nayak Hospital', 'Jawaharlal Nehru Marg, Delhi Gate, New Delhi, Delhi 110002', '+91-11-23234242', 'info@lnjp.gov.in', 28.6415, 77.2365, 'open', true),
('AIIMS Delhi', 'Ansari Nagar, New Delhi, Delhi 110029', '+91-11-26588500', 'info@aiims.edu', 28.5672, 77.2100, 'open', true),
('Safdarjung Hospital', 'Ansari Nagar, Ring Road, New Delhi, Delhi 110029', '+91-11-26707444', 'info@safdarjung.nic.in', 28.5686, 77.2058, 'open', true),
('Lady Hardinge Medical College', 'Shaheed Bhagat Singh Marg, New Delhi, Delhi 110001', '+91-11-23363751', 'info@lhmc.in', 28.6371, 77.2183, 'open', true),
('Ram Manohar Lohia Hospital', 'Baba Kharak Singh Marg, Connaught Place, New Delhi, Delhi 110001', '+91-11-23365525', 'info@rmlh.nic.in', 28.6290, 77.2207, 'open', true),
('Dr. Ram Manohar Lohia Hospital', 'Baba Kharak Singh Marg, New Delhi, Delhi 110001', '+91-11-23365525', 'info@rmlh.nic.in', 28.6290, 77.2207, 'open', true),
('Hindu Rao Hospital', 'Subzi Mandi, Malka Ganj, Delhi 110007', '+91-11-23919701', 'info@hindurao.nic.in', 28.6792, 77.2074, 'open', true),
('Deen Dayal Upadhyay Hospital', 'Hari Nagar, New Delhi, Delhi 110064', '+91-11-25922222', 'info@dduh.in', 28.6208, 77.1122, 'open', true),
('Bharatpur Hospital', 'Bharatpur, Rajasthan 321001', '+91-5644-222222', 'info@bharatpurhospital.com', 27.2173, 77.4895, 'open', true),

-- Mumbai (15 clinics)
('Kokilaben Dhirubhai Ambani Hospital', 'Rao Saheb Acharya Marg, Four Bungalows, Andheri West, Mumbai, Maharashtra 400053', '+91-22-30999999', 'info@kokilabenhospital.com', 19.1363, 72.8277, 'open', true),
('Lilavati Hospital', 'A-791, Bandra Reclamation, Bandra West, Mumbai, Maharashtra 400050', '+91-22-26751000', 'info@lilavatihospital.com', 19.0544, 72.8347, 'open', true),
('Jaslok Hospital', '15, Dr. G. Deshmukh Marg, Pedder Road, Mumbai, Maharashtra 400026', '+91-22-66573000', 'info@jaslokhospital.net', 18.9722, 72.8147, 'open', true),
('Breach Candy Hospital', '60-A, Bhulabhai Desai Road, Mumbai, Maharashtra 400026', '+91-22-23667788', 'info@breachcandyhospital.org', 18.9722, 72.8147, 'open', true),
('Saifee Hospital', '15/17, Maharshi Karve Road, Charni Road East, Mumbai, Maharashtra 400004', '+91-22-67570111', 'info@saifeehospital.com', 18.9500, 72.8200, 'open', true),
('Global Hospitals', '35, Dr. E Borges Road, Hospital Avenue, Parel, Mumbai, Maharashtra 400012', '+91-22-67670101', 'info@globalhospitalsindia.com', 19.0074, 72.8376, 'open', true),
('S.L. Raheja Hospital', 'Raheja Rugnalaya Marg, Mahim West, Mumbai, Maharashtra 400016', '+91-22-66529888', 'info@rahejahospital.com', 19.0428, 72.8417, 'open', true),
('Nanavati Super Speciality Hospital', 'S.V. Road, Vile Parle West, Mumbai, Maharashtra 400056', '+91-22-26267500', 'info@nanavatihospital.org', 19.0994, 72.8456, 'open', true),
('Hiranandani Hospital', 'Hill Side Avenue, Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076', '+91-22-25763300', 'info@hiranandanihospital.org', 19.1197, 72.9094, 'open', true),
('Seven Hills Hospital', 'Marol Maroshi Road, Andheri East, Mumbai, Maharashtra 400059', '+91-22-67676767', 'info@sevenhillshospital.com', 19.1136, 72.8797, 'open', true),
('Wockhardt Hospitals', '1877, Doctor Anandrao Nair Marg, Near Agripada Police Station, Mumbai Central, Mumbai, Maharashtra 400011', '+91-22-61784444', 'info@wockhardthospitals.com', 18.9697, 72.8194, 'open', true),
('Bombay Hospital', '12, Marine Lines, Mumbai, Maharashtra 400020', '+91-22-22067676', 'info@bombayhospital.com', 18.9442, 72.8236, 'open', true),
('KEM Hospital', 'Parel, Mumbai, Maharashtra 400012', '+91-22-24136051', 'info@kem.edu', 19.0014, 72.8406, 'open', true),
('JJ Hospital', 'J.J. Marg, Nagpada-Mumbai Central, Mumbai, Maharashtra 400008', '+91-22-23735555', 'info@jjhospital.org', 18.9600, 72.8300, 'open', true),
('St. George Hospital', 'P.D''Mello Road, Byculla, Mumbai, Maharashtra 400008', '+91-22-23092800', 'info@stgeorgehospital.com', 18.9675, 72.8311, 'open', true),

-- Bangalore (15 clinics)
('Manipal Hospital', '98, HAL Airport Road, Bangalore, Karnataka 560017', '+91-80-25024444', 'info@manipalhospitals.com', 12.9600, 77.6486, 'open', true),
('Apollo Hospitals Bangalore', '154/11, Bannerghatta Road, Opposite IIM, Bangalore, Karnataka 560076', '+91-80-26304050', 'info@apollohospitalsbangalore.com', 12.8944, 77.6011, 'open', true),
('Fortis Hospital Bangalore', '14, Cunningham Road, Bangalore, Karnataka 560052', '+91-80-41994444', 'info@fortishealthcare.com', 12.9856, 77.6033, 'open', true),
('Columbia Asia Hospital', 'Kirloskar Business Park, Bellary Road, Hebbal, Bangalore, Karnataka 560024', '+91-80-41791000', 'info@columbiaasia.com', 13.0827, 77.6407, 'open', true),
('Sakra World Hospital', '52/2 & 52/3, Devarabeesanahalli, Varthur Hobli, Bangalore, Karnataka 560103', '+91-80-49694969', 'info@sakraworldhospital.com', 12.9344, 77.6900, 'open', true),
('BGS Gleneagles Global Hospital', '67, Uttarahalli Road, Kengeri, Bangalore, Karnataka 560060', '+91-80-26255555', 'info@bgsgleneagles.com', 12.9172, 77.4850, 'open', true),
('Sparsh Hospital', '146, Infantry Road, Bangalore, Karnataka 560001', '+91-80-49068500', 'info@sparshhospital.com', 12.9822, 77.6011, 'open', true),
('Narayana Health', '258/A, Bommasandra Industrial Area, Anekal Taluk, Bangalore, Karnataka 560099', '+91-80-71222222', 'info@narayanahealth.org', 12.8172, 77.6850, 'open', true),
('Rainbow Children''s Hospital', 'Road No. 2, Banjara Hills, Hyderabad, Telangana 500034', '+91-40-23311234', 'info@rainbowhospitals.in', 17.4062, 78.4564, 'open', true),
('Cloudnine Hospital', 'No. 1533, 9th Main, 3rd Block, Jayanagar, Bangalore, Karnataka 560011', '+91-80-39893333', 'info@cloudninecare.com', 12.9279, 77.5967, 'open', true),
('St. John''s Medical College Hospital', 'Sarjapur Road, Bangalore, Karnataka 560034', '+91-80-22065000', 'info@stjohns.in', 12.9236, 77.6225, 'open', true),
('Victoria Hospital', 'Fort, Bangalore, Karnataka 560002', '+91-80-26701150', 'info@victoriahospital.org', 12.9639, 77.5733, 'open', true),
('Bowring & Lady Curzon Hospital', 'Avalahalli, Shivajinagar, Bangalore, Karnataka 560001', '+91-80-22975555', 'info@bowringhospital.com', 12.9814, 77.6022, 'open', true),
('Kidwai Memorial Institute of Oncology', 'Dr. M.H. Marigowda Road, Bangalore, Karnataka 560029', '+91-80-26094000', 'info@kidwai.kar.nic.in', 12.9467, 77.5733, 'open', true),
('Jayadeva Institute of Cardiology', 'Jayanagar 9th Block, Bangalore, Karnataka 560069', '+91-80-22977300', 'info@jayadevacardiology.org', 12.9172, 77.5967, 'open', true),

-- Chennai (10 clinics)
('Apollo Hospitals Chennai', '21, Greams Lane, Off Greams Road, Chennai, Tamil Nadu 600006', '+91-44-28290200', 'info@apollohospitalschennai.com', 13.0827, 80.2707, 'open', true),
('Fortis Malar Hospital', '52, 1st Main Road, Gandhi Nagar, Adyar, Chennai, Tamil Nadu 600020', '+91-44-42892222', 'info@fortismalar.com', 13.0067, 80.2572, 'open', true),
('Sri Ramachandra Medical Centre', 'No.1, Ramachandra Nagar, Porur, Chennai, Tamil Nadu 600116', '+91-44-24768027', 'info@sriramachandra.edu.in', 13.0389, 80.1458, 'open', true),
('Global Health City', '439, Cheran Nagar, Perumbakkam, Chennai, Tamil Nadu 600100', '+91-44-44777000', 'info@globalhealthcity.com', 12.9039, 80.1858, 'open', true),
('MIOT International', '4/112, Mount Poonamalle Road, Manapakkam, Chennai, Tamil Nadu 600089', '+91-44-42002288', 'info@miothospitals.com', 13.0294, 80.1761, 'open', true),
('Vijaya Hospital', 'No.434, N.S.K. Salai, Vadapalani, Chennai, Tamil Nadu 600026', '+91-44-42017500', 'info@vijayahospital.org', 13.0500, 80.2122, 'open', true),
('Billroth Hospitals', '43, Lakshmi Talkies Road, Shenoy Nagar, Chennai, Tamil Nadu 600030', '+91-44-42921777', 'info@billrothhospitals.com', 13.0794, 80.2336, 'open', true),
('Stanley Medical College Hospital', 'Old Jail Road, Chennai, Tamil Nadu 600001', '+91-44-25281347', 'info@stanley.in', 13.0827, 80.2750, 'open', true),
('Rajiv Gandhi Government General Hospital', 'Poonamallee High Road, Chennai, Tamil Nadu 600003', '+91-44-25305000', 'info@rgggh.tn.gov.in', 13.0827, 80.2750, 'open', true),
('Kilpauk Medical College Hospital', 'Poonamallee High Road, Kilpauk, Chennai, Tamil Nadu 600010', '+91-44-26431907', 'info@kmc.ac.in', 13.0827, 80.2458, 'open', true),

-- Hyderabad (10 clinics)
('Apollo Hospitals Hyderabad', 'Road No 72, Opp. Bharatiya Vidya Bhavan School, Film Nagar, Hyderabad, Telangana 500033', '+91-40-23607777', 'info@apollohospitals.com', 17.4167, 78.4344, 'open', true),
('Care Hospitals', 'Road No. 1, Banjara Hills, Hyderabad, Telangana 500034', '+91-40-30418888', 'info@carehospitals.com', 17.4062, 78.4564, 'open', true),
('Yashoda Hospitals', 'Alexander Road, Secunderabad, Hyderabad, Telangana 500003', '+91-40-45678888', 'info@yashodahospitals.com', 17.4399, 78.4983, 'open', true),
('Continental Hospitals', 'Plot No. 3, Road No. 2, IT & Financial District, Nanakramguda, Hyderabad, Telangana 500032', '+91-40-67000000', 'info@continentahospitals.com', 17.4062, 78.3347, 'open', true),
('KIMS Hospitals', '123, Patrika Nagar, HITEC City, Hyderabad, Telangana 500081', '+91-40-44885000', 'info@kims.co.in', 17.4474, 78.3767, 'open', true),
('Star Hospitals', '8-2-596/5, Road No. 10, Banjara Hills, Hyderabad, Telangana 500034', '+91-40-44777777', 'info@starhospitals.in', 17.4062, 78.4564, 'open', true),
('Prime Hospitals', 'Plot No. 4, Mythri Nagar, Phase II, Madinaguda, Hyderabad, Telangana 500049', '+91-40-44777777', 'info@primehospitals.in', 17.4933, 78.3889, 'open', true),
('Rainbow Children''s Hospital', 'Road No. 2, Banjara Hills, Hyderabad, Telangana 500034', '+91-40-23311234', 'info@rainbowhospitals.in', 17.4062, 78.4564, 'open', true),
('Nizam''s Institute of Medical Sciences', 'Punjagutta, Hyderabad, Telangana 500082', '+91-40-23489000', 'info@nims.edu.in', 17.4062, 78.4564, 'open', true),
('Gandhi Hospital', 'Padmarao Nagar, Secunderabad, Hyderabad, Telangana 500025', '+91-40-27505566', 'info@gandhihospital.in', 17.4399, 78.4983, 'open', true),

-- Kolkata (10 clinics)
('Apollo Gleneagles Hospitals', '58, Canal Circular Road, Kolkata, West Bengal 700054', '+91-33-23202122', 'info@apollokolkata.com', 22.5726, 88.3639, 'open', true),
('AMRI Hospitals', 'JC-16 & 17, Salt Lake City, Kolkata, West Bengal 700091', '+91-33-66062222', 'info@amrihospitals.in', 22.5761, 88.4089, 'open', true),
('Woodlands Multispeciality Hospital', '8/5, Alipore Road, Kolkata, West Bengal 700027', '+91-33-24557000', 'info@woodlandshospital.in', 22.5267, 88.3347, 'open', true),
('Belle Vue Clinic', '9, Dr. U.N. Brahmachari Street, Kolkata, West Bengal 700017', '+91-33-22832727', 'info@belle-vueclinic.com', 22.5411, 88.3639, 'open', true),
('Medica Superspecialty Hospital', '127, Mukundapur, E.M. Bypass, Kolkata, West Bengal 700099', '+91-33-66520000', 'info@medicahospitals.in', 22.4744, 88.3944, 'open', true),
('Ruby General Hospital', 'Kasba Golpark, E.M. Bypass, Kolkata, West Bengal 700107', '+91-33-66284444', 'info@rubyhospital.com', 22.4744, 88.3944, 'open', true),
('Peerless Hospital', '360, Panchasayar, Kolkata, West Bengal 700094', '+91-33-40111222', 'info@peerlesshospital.com', 22.4744, 88.3944, 'open', true),
('Calcutta Medical Research Institute', '7/2, Diamond Harbour Road, Kolkata, West Bengal 700027', '+91-33-24567000', 'info@cmri.in', 22.5267, 88.3347, 'open', true),
('SSKM Hospital', '242, AJC Bose Road, Kolkata, West Bengal 700020', '+91-33-22041101', 'info@sskm.in', 22.5411, 88.3639, 'open', true),
('RG Kar Medical College', '1, Khudiram Bose Sarani, Kolkata, West Bengal 700004', '+91-33-25557671', 'info@rgkarmc.edu.in', 22.5411, 88.3639, 'open', true),

-- Pune (10 clinics)
('Ruby Hall Clinic', '40, Sassoon Road, Pune, Maharashtra 411001', '+91-20-26163391', 'info@rubyhall.com', 18.5308, 73.8478, 'open', true),
('Sahyadri Hospitals', 'Plot No. 30-C, Erandwane, Karve Road, Pune, Maharashtra 411004', '+91-20-67213000', 'info@sahyadrihospitals.com', 18.5108, 73.8278, 'open', true),
('Jehangir Hospital', '32, Sassoon Road, Pune, Maharashtra 411001', '+91-20-66819999', 'info@jehangirhospital.com', 18.5308, 73.8478, 'open', true),
('Aditya Birla Memorial Hospital', 'Aditya Birla Marg, Chinchwad, Pune, Maharashtra 411033', '+91-20-30717500', 'info@adityabirlahospital.com', 18.6298, 73.7997, 'open', true),
('Columbia Asia Hospital', '22, 2A, Mundhwa, Pune, Maharashtra 411036', '+91-20-67999999', 'info@columbiaasia.com', 18.5308, 73.8478, 'open', true),
('Noble Hospital', '153, Magarpatta City Road, Hadapsar, Pune, Maharashtra 411013', '+91-20-66287777', 'info@noblehospitals.com', 18.5089, 73.9258, 'open', true),
('Deenanath Mangeshkar Hospital', 'Near Mhatre Bridge, Erandwane, Pune, Maharashtra 411004', '+91-20-40151000', 'info@dmhospital.org', 18.5108, 73.8278, 'open', true),
('KEM Hospital', '489, Rasta Peth, Pune, Maharashtra 411011', '+91-20-26058243', 'info@kemhospital.org', 18.5194, 73.8550, 'open', true),
('Poona Hospital', '27, Sadashiv Peth, Pune, Maharashtra 411030', '+91-20-24331111', 'info@poonahospital.org', 18.5108, 73.8478, 'open', true),
('Sassoon General Hospitals', 'Station Road, Pune, Maharashtra 411001', '+91-20-26128000', 'info@sassoonhospital.org', 18.5308, 73.8478, 'open', true),

-- Ahmedabad (5 clinics)
('Apollo Hospitals Ahmedabad', 'Plot No. 1A, Bhat GIDC Estate, Gandhinagar, Gujarat 382428', '+91-79-66776677', 'info@apolloahmedabad.com', 23.2156, 72.6369, 'open', true),
('Sterling Hospital', 'Sterling Hospital Road, Memnagar, Ahmedabad, Gujarat 380052', '+91-79-40011111', 'info@sterlinghospitals.com', 23.0489, 72.5300, 'open', true),
('CIMS Hospital', 'Off Science City Road, Sola, Ahmedabad, Gujarat 380060', '+91-79-27717777', 'info@cims.org', 23.0722, 72.5158, 'open', true),
('Sal Hospital', 'Drive-In Road, Ahmedabad, Gujarat 380052', '+91-79-27551111', 'info@salhospital.com', 23.0489, 72.5300, 'open', true),
('HCG Hospitals', 'S.G. Highway, Ahmedabad, Gujarat 380054', '+91-79-66114444', 'info@hcghospitals.in', 23.0489, 72.5300, 'open', true),

-- Jaipur (5 clinics)
('Santokba Durlabhji Memorial Hospital', 'Near Rambagh Circle, Bhawani Singh Road, Jaipur, Rajasthan 302015', '+91-141-2566251', 'info@sdmh.in', 26.9124, 75.7873, 'open', true),
('Fortis Escorts Hospital', 'Jawaharlal Nehru Marg, Malviya Nagar, Jaipur, Rajasthan 302017', '+91-141-2547000', 'info@fortisjaipur.com', 26.8500, 75.8000, 'open', true),
('EHCC Hospital', 'J.L.N. Marg, Jaipur, Rajasthan 302017', '+91-141-2740303', 'info@ehcc.org', 26.8500, 75.8000, 'open', true),
('Monilek Hospital', 'Sector 4, Jawahar Nagar, Jaipur, Rajasthan 302004', '+91-141-2655000', 'info@monilekhospital.com', 26.9124, 75.7873, 'open', true),
('Jaipur Hospital', 'Gulab Bari, Ajmer Road, Jaipur, Rajasthan 302006', '+91-141-2201800', 'info@jaipurhospital.com', 26.9124, 75.7873, 'open', true),

-- Lucknow (5 clinics)
('Medanta Hospital Lucknow', 'Sector A, Pocket 1, Sushant Golf City, Lucknow, Uttar Pradesh 226030', '+91-522-4505050', 'info@medantalucknow.com', 26.8467, 80.9467, 'open', true),
('Apollo Medics Super Speciality Hospital', 'Sunderpur, Faizabad Road, Lucknow, Uttar Pradesh 226025', '+91-522-6788888', 'info@apollomedicslucknow.com', 26.8467, 80.9467, 'open', true),
('Sahara Hospital', 'Gomti Nagar, Lucknow, Uttar Pradesh 226010', '+91-522-6780000', 'info@saharahospital.com', 26.8467, 80.9467, 'open', true),
('Charak Hospital', 'Hardoi Road, Dubagga, Lucknow, Uttar Pradesh 226003', '+91-522-2730000', 'info@charakhospital.com', 26.8467, 80.9467, 'open', true),
('Era''s Lucknow Medical College', 'Sarfarazganj, Hardoi Road, Lucknow, Uttar Pradesh 226003', '+91-522-2408000', 'info@elmcindia.org', 26.8467, 80.9467, 'open', true);

-- Update some clinics with random wait times and queue sizes
UPDATE clinics SET
  current_wait_time = CASE WHEN random() < 0.7 THEN floor(random() * 120 + 15)::int ELSE NULL END,
  queue_size = CASE WHEN random() < 0.7 THEN floor(random() * 50 + 5)::int ELSE NULL END
WHERE id IN (
  SELECT id FROM clinics ORDER BY random() LIMIT 70
);