import fs from 'fs';

const specialties = [
  'General Medicine', 'Cardiology', 'Dermatology', 'Orthopedics', 'Pediatrics',
  'Gynecology', 'Ophthalmology', 'Dentistry', 'Psychiatry', 'Neurology',
  'ENT', 'Urology', 'Radiology', 'Pathology', 'Emergency Medicine', 'Oncology'
];

const firstNames = ['Rajesh', 'Priya', 'Amit', 'Meera', 'Vikram', 'Sunita', 'Karan', 'Arjun', 'Kavita', 'Rohan', 'Nisha', 'Manoj', 'Deepak', 'Anjali', 'Suresh', 'Lakshmi', 'Saravanan', 'Priya', 'Rajendr', 'Fatima'];
const lastNames = ['Kumar', 'Sharma', 'Singh', 'Patel', 'Rao', 'Gupta', 'Jain', 'Desai', 'Joshi', 'Shah', 'Agarwal', 'Babu', 'Menon', 'Narayanan', 'Prasad', 'Khan', 'Reddy', 'Chandra', 'Banerjee', 'Das'];

let inserts = [];
let doctorCounter = 0;

for (let i = 0; i < 500; i++) {
  const clinicName = `Suruchi Eye Centre Nerul Branch ${i + 1}`; // Adjust based on actual names, but for simplicity, use a pattern
  // Actually, the clinics are varied, but to simplify, I'll assume they are named sequentially or use a loop.

  // Since the clinics are generated with different names, I need to match them. For simplicity, I'll generate doctors for each clinic assuming the names are known.

  // To make it work, I'll generate doctors for the first 500 clinics, but since names are varied, perhaps generate generic.

  // Better: since the SQL has names like 'DY Patil Hospital Rabale Branch 1', etc., I can generate doctors for each.

  // But to avoid complexity, I'll create doctors for each clinic by assuming the clinic name is known.

  // Let's say for each clinic, add 2-4 doctors.

  const numDoctors = Math.floor(Math.random() * 3) + 2; // 2-4 doctors

  for (let j = 0; j < numDoctors; j++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}${doctorCounter}@example.com`;
    const phone = `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`;
    const specialization = specialties[Math.floor(Math.random() * specialties.length)];
    const experience = Math.floor(Math.random() * 25) + 5; // 5-30 years
    const rating = (Math.random() * 0.5 + 4.5).toFixed(1); // 4.5-5.0
    const isAvailable = Math.random() > 0.3; // 70% available
    const fee = Math.floor(Math.random() * 500) + 500; // 500-1000
    const bio = `Experienced ${specialization.toLowerCase()} specialist with ${experience} years of practice.`;

    // For clinic_id, use subquery
    inserts.push(`('${name}', '${email}', '${phone}', (SELECT id FROM clinics WHERE name LIKE '%Branch ${i + 1}%' LIMIT 1), '${specialization}', ${experience}, ${rating}, true, ${isAvailable}, ${fee}, '${bio}')`);
    doctorCounter++;
  }
}

const sql = `INSERT INTO doctors (name, email, phone, clinic_id, specialization, experience_years, rating, is_active, is_available_today, consultation_fee, bio) VALUES\n${inserts.join(',\n')};`;

fs.writeFileSync('populate_doctors_navi_mumbai.sql', sql);