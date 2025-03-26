const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); // Import axios for making HTTP requests to OpenFDA
const User = require('./models/User');
const MedicalList = require('./models/MedicalList');
const OwnMedical = require('./models/OwnMedical');
const feedbackRoutes = require('./routes/feedback');


const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
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

const mockApi = require("./mockApiRoutes"); 

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
  

// ✅ Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
