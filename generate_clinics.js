import fs from 'fs';

const hospitals = [
  'Apollo Hospitals',
  'Fortis Hiranandani Hospital',
  'MGM Hospital',
  'DY Patil Hospital',
  'Terna Sahyadri Hospital',
  'Reliance Hospital',
  'MPCT Hospital',
  'Suruchi Eye Centre',
  'Asha Hospital',
  'Dr. Ghaisas Hospital',
  'New Bombay Hospital',
  'Sanjeevani Hospital',
  'Icon Hospital',
  'NMMC General Hospital',
  'Shree Hospital',
  'Life Line Hospital',
  'Harish Hospital',
  'Mangal Hospital',
  'Universal Hospital',
  'Neurogen Brain and Spine Institute'
];

const areas = ['Vashi', 'Nerul', 'CBD Belapur', 'Kopar Khairane', 'Sanpada', 'Mahape', 'Airoli', 'Ghansoli', 'Rabale', 'Turbhe'];

let inserts = [];

for (let i = 0; i < 500; i++) {
  const hospital = hospitals[Math.floor(Math.random() * hospitals.length)];
  const area = areas[Math.floor(Math.random() * areas.length)];
  const name = `${hospital} ${area} Branch ${i + 1}`;
  const address = `Plot ${Math.floor(Math.random() * 100) + 1}, Sector ${Math.floor(Math.random() * 50) + 1}, ${area}, Navi Mumbai, Maharashtra ${400600 + Math.floor(Math.random() * 100)}`;
  const phone = `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`;
  const email = `info@${hospital.toLowerCase().replace(/\s+/g, '')}${i}@example.com`;
  const lat = 19.0 + Math.random() * 0.5; // approximate lat for Navi Mumbai
  const lng = 73.0 + Math.random() * 0.5; // approximate lng
  inserts.push(`('${name}', '${address}', '${phone}', '${email}', ${lat}, ${lng}, 'open', true)`);
}

const sql = `INSERT INTO clinics (name, address, phone, email, latitude, longitude, status, is_active) VALUES\n${inserts.join(',\n')};`;

fs.writeFileSync('populate_clinics_navi_mumbai.sql', sql);