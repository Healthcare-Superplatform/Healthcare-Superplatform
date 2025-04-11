const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios'); // Import axios for making HTTP requests to OpenFDA
const User = require('./models/User');
const MedicalList = require('./models/MedicalList');
const MedicalRecord = require('./models/MedicalRecord');
const OwnMedical = require('./models/OwnMedical');
const feedbackRoutes = require('./routes/feedback');
const mockApi = require('./mockApiRoutes');

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH'],
  credentials: true
}));
app.use(express.json());

// Feedback routes
app.use('/api/feedback', feedbackRoutes);

// Connect to MongoDB
// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://pankajchakrabarty22:P%40nkaj2025@superplatform-backend.u6aoy.mongodb.net/superplatform-backend?retryWrites=true&w=majority&appName=superplatform-backend', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB!');
  console.log('🗄 Database Name:', mongoose.connection.name);
})
.catch((err) => {
  console.error('❌ Error connecting to MongoDB:', err);

});
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


// ✅ Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

// ✅ Fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    console.log('📌 Users retrieved:', users.length);
    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Error retrieving users:', error);
    res.status(500).json({ message: 'Error retrieving users', error });
  }
});

// ✅ Fetch medical list based on location
app.get('/medical_list', async (req, res) => {
  try {
    const { location } = req.query;
    const query = location ? { Location: location } : {};
    const medicalList = await MedicalList.find(query);

    console.log(`📍 Retrieved ${medicalList.length} medical facilities`);
    res.status(200).json(medicalList);
  } catch (error) {
    console.error('❌ Error retrieving medical list:', error);
    res.status(500).json({ message: 'Error retrieving medical list', error });
  }
});

// ✅ Fetch own medical items based on SSN
app.get('/own_medical', async (req, res) => {
    try {
        let { ssn } = req.query;

        if (!ssn || ssn.trim() === "") {
            console.log('📌 No SSN provided. Returning all medical records...');
            const allRecords = await OwnMedical.find({});
            return res.status(200).json(allRecords);
        }

        // Ensure SSN is a string
        ssn = ssn.toString().trim();
        console.log(`🔍 Searching medical records for SSN: ${ssn}`);

        // Find specific SSN
        const ownMedical = await OwnMedical.find({ SSN: ssn });

        if (!ownMedical || ownMedical.length === 0) {
            console.log('❌ No data found for this SSN');
            return res.status(404).json({ message: 'No medical records found' });
        }

        console.log(`✅ Found ${ownMedical.length} medical records`);
        res.status(200).json(ownMedical);
    } catch (error) {
        console.error('❌ Error retrieving own medical data:', error);
        res.status(500).json({ message: 'Error retrieving own medical data', error });
    }
});

// Fetch routes for symtom checker

console.log("🚀 Setting up mock API routes...");
app.use("/api", mockApi);


// ✅ Search for medicines related to a disease from OpenFDA
app.get('/search_medicine', async (req, res) => {
    try {
      const { disease } = req.query;
      if (!disease) {
        console.log('❌ No disease provided');
        return res.status(400).json({ message: 'Disease name is required' });
      }
  
      console.log(`🩺 Searching medicines for disease: "${disease}"`);
      
      // ✅ Corrected search query (note the quotation marks around disease)
      const query = `https://api.fda.gov/drug/label.json?search=indications_and_usage:"${encodeURIComponent(disease)}"&limit=5`;
  
      console.log('🔗 Sending request to OpenFDA:', query);
      const response = await axios.get(query);
  
      console.log('📩 OpenFDA Response:', JSON.stringify(response.data, null, 2));
  
      if (!response.data.results || response.data.results.length === 0) {
        console.log('❌ No medicines found for this disease');
        return res.status(404).json({ message: 'No medicines found for this disease' });
      }
  
      const medicines = response.data.results.map(item => ({
        name: item.openfda?.brand_name?.[0] 
              || item.openfda?.generic_name?.[0] 
              || item.package_label_principal_display_panel?.[0] 
              || "N/A",
    
        manufacturer: item.openfda?.manufacturer_name?.[0] 
              || "N/A",
    
        substance_name: item.openfda?.substance_name?.[0] 
              || item.active_ingredient?.[0]
              || item.openfda?.generic_name?.[0] 
              || "N/A",
    
        description: item.indications_and_usage?.[0] 
              || item.purpose?.[0]
              || "Description not available."
    }));
    
  
      console.log(`✅ Found ${medicines.length} medicines`);
      res.status(200).json(medicines);
  
    } catch (error) {
      console.error('❌ Error fetching medicine data from OpenFDA:', error.response?.data || error.message);
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
      const ssn = req.params.ssn.toString().trim();
      console.log("🔍 Fetching records for SSN:", ssn);
  
      const records = await MedicalRecord.find({ SSN: ssn });
      console.log("📄 Found records:", records);
  
      if (records.length === 0) {
        return res.status(404).json({ message: `No records found for SSN: ${ssn}` });
      }
  
      const categorized = records.reduce((acc, record) => {
        if (!acc[record.recordType]) acc[record.recordType] = [];
        acc[record.recordType].push(record);
        return acc;
      }, {});
  
      res.status(200).json(categorized);
    } catch (error) {
      console.error('❌ Error fetching records:', error);
      res.status(500).json({ message: 'Error fetching records', error });
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
  

// ✅ Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
