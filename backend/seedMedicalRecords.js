const mongoose = require('mongoose');
const MedicalRecord = require('./models/MedicalRecord');

const MONGODB_URI = 'mongodb+srv://pankajchakrabarty22:P%40nkaj2025@superplatform-backend.u6aoy.mongodb.net/superplatform-backend?retryWrites=true&w=majority';

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    console.log('✅ Connected to MongoDB');
    
   
    await MedicalRecord.deleteMany({});
    
   
    const sampleRecords = [
      {
        SSN: '101',
        recordType: 'lab_result',
        title: 'Complete Blood Count',
        date: new Date('2023-10-15'),
        values: {
          hemoglobin: 13.5,
          wbc: 6.2,
          platelets: 250,
          result: 'Normal'
        },
        provider: 'LabCorp'
      },
      {
        SSN: '101',
        recordType: 'vital_sign',
        title: 'Blood Pressure',
        date: new Date('2023-11-01'),
        values: {
          systolic: 138,
          diastolic: 88
        },
        flags: ['elevated'],
        provider: 'Dr. Smith'
      }
    ];

    await MedicalRecord.insertMany(sampleRecords);
    console.log('✅ Successfully seeded medical records');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedData();