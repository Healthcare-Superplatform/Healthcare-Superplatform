const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const User = require('./models/User');
const MedicalList = require('./models/MedicalList');
const OwnMedical = require('./models/OwnMedical');
const MedicalRecord = require('./models/MedicalRecord');
const feedbackRoutes = require('./routes/feedback');
const mockApi = require('./mockApiRoutes');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/feedback', feedbackRoutes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/superplatform-backend', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Healthcare Superplatform API',
    version: '1.0.0',
    availableRoutes: [
      '/api/health',
      '/api/users',
      '/api/medical_list',
      '/api/own_medical',
      '/api/search_medicine',
      '/api/recommendations/:ssn',
    ],
    documentation: 'https://github.com/Healthcare-Superplatform/Healthcare-Superplatform',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
});

app.get('/api/medical_list', async (req, res) => {
  try {
    const { location } = req.query;
    const query = location ? { Location: location } : {};
    const medicalList = await MedicalList.find(query);
    res.status(200).json(medicalList);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving medical list', error });
  }
});

app.get('/api/own_medical', async (req, res) => {
  try {
    let { ssn } = req.query;
    if (!ssn || ssn.trim() === '') {
      const allRecords = await OwnMedical.find({});
      return res.status(200).json(allRecords);
    }
    ssn = ssn.toString().trim();
    const ownMedical = await OwnMedical.find({ SSN: ssn });
    if (!ownMedical.length) {
      return res.status(404).json({ message: 'No medical records found' });
    }
    res.status(200).json(ownMedical);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving own medical data', error });
  }
});

app.use('/api', mockApi);

app.get('/api/search_medicine', async (req, res) => {
  try {
    const { disease } = req.query;
    if (!disease) return res.status(400).json({ message: 'Disease name is required' });
    const query = `https://api.fda.gov/drug/label.json?search=indications_and_usage:"${encodeURIComponent(disease)}"&limit=5`;
    const response = await axios.get(query);
    if (!response.data.results || response.data.results.length === 0) {
      return res.status(404).json({ message: 'No medicines found for this disease' });
    }
    const medicines = response.data.results.map(item => ({
      name: item.openfda?.brand_name?.[0] || item.openfda?.generic_name?.[0] || 'N/A',
      manufacturer: item.openfda?.manufacturer_name?.[0] || 'N/A',
      substance_name: item.openfda?.substance_name?.[0] || 'N/A',
      description: item.indications_and_usage?.[0] || 'Description not available.',
    }));
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from OpenFDA' });
  }
});

app.patch('/api/records/:id/archive', async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      { archived: true },
      { new: true }
    );
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error archiving record' });
  }
});

app.get('/api/records/:ssn', async (req, res) => {
  try {
    const records = await MedicalRecord.find({ SSN: req.params.ssn, archived: false }).sort('-date');
    const categorized = records.reduce((acc, record) => {
      if (!acc[record.recordType]) acc[record.recordType] = [];
      acc[record.recordType].push(record);
      return acc;
    }, {});
    res.json(categorized);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching records' });
  }
});

app.get('/api/recommendations/:ssn', async (req, res) => {
  try {
    const records = await MedicalRecord.find({ SSN: req.params.ssn });
    const recommendations = generateRecommendations(records);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error generating recommendations' });
  }
});

function generateRecommendations(records) {
  const recommendations = [];
  const abnormalLabs = records.filter(r => r.recordType === 'lab_result' && r.flags?.includes('abnormal'));
  abnormalLabs.forEach(lab => {
    recommendations.push({
      type: 'lab_result',
      priority: 'high',
      message: `Abnormal ${lab.title} result detected`,
      action: 'Please consult your healthcare provider',
    });
  });
  return recommendations;
}

app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      '/',
      '/api/health',
      '/api/users',
      '/api/medical_list',
      '/api/own_medical',
      '/api/search_medicine',
      '/api/recommendations/:ssn'
    ]
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
