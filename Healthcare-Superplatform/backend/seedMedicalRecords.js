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
        SSN: '1',
        recordType: 'lab_result',
        title: 'Malaria Detection',
        date: new Date(),
        values: {
          result: 'Malaria',
          hemoglobin: 12.1,
          wbc: 4.5
        },
        provider: 'Apollo Diagnostics',
        flags: ['abnormal']
      },
      {
        SSN: '1',
        recordType: 'vital_sign',
        title: 'Blood Pressure',
        date: new Date(),
        values: {
          systolic: 140,
          diastolic: 90,
          result: 'Hypertension'
        },
        provider: 'Family Clinic',
        flags: ['elevated']
      },
      {
        SSN: '1',
        recordType: 'treatment_plan',
        title: 'Malaria Medication',
        date: new Date(),
        values: {
          medicine: 'Artemisinin',
          dosage: '2 tablets daily',
          result: 'Malaria'
        },
        provider: 'Dr. Sharma'
      },
      {
        SSN: '2',
        recordType: 'vital_sign',
        title: 'Blood Pressure',
        date: new Date('2023-11-01'),
        values: {
          systolic: 138,
          diastolic: 88,
          result: 'COVID-19'
        },
        flags: ['elevated'],
        provider: 'Dr. Smith'
      },
      {
        SSN: '3',
        recordType: 'lab_result',
        title: 'Schizophrenia',
        date: new Date('2023-11-01'),
        values: {
          systolic: 138,
          diastolic: 88,
          result: 'Cholera'
        },
        flags: ['abnormal'],
        provider: 'Dr. K'
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
