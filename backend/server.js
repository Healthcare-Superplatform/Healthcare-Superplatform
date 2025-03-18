const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); // Import axios for making HTTP requests to OpenFDA
const User = require('./models/User');
const MedicalList = require('./models/MedicalList');
const OwnMedical = require('./models/OwnMedical');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/superplatform-backend', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB!');
  console.log('Connected to database:', mongoose.connection.name);
})
.catch((err) => console.log('Error connecting to MongoDB:', err));

// API endpoint to fetch all users
app.get('/users', (req, res) => {
  User.find({})
    .then((users) => {
      console.log('Users retrieved:', users);
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log('Error retrieving users:', err);
      res.status(500).json({ message: 'Error retrieving users', error: err });
    });
});

// API endpoint to fetch medical list items based on Location
app.get('/medical_list', (req, res) => {
  const { location } = req.query;
  if (location) {
    MedicalList.find({ Location: location })
      .then((medicalList) => {
        if (medicalList.length === 0) {
          return res.status(200).json([]);
        }
        res.status(200).json(medicalList);
      })
      .catch((err) => {
        console.log('Error retrieving medical list:', err);
        res.status(500).json({ message: 'Error retrieving medical list', error: err });
      });
  } else {
    MedicalList.find({})
      .then((medicalList) => {
        res.status(200).json(medicalList);
      })
      .catch((err) => {
        res.status(500).json({ message: 'Error retrieving medical list', error: err });
      });
  }
});

// API endpoint to fetch own medical items based on SSN
app.get('/own_medical', (req, res) => {
  const { ssn } = req.query;
  console.log('Fetching data from own_medical collection for SSN:', ssn);
  const query = ssn ? { SSN: String(ssn) } : {};
  OwnMedical.find(query)
    .then((ownMedical) => {
      console.log('Fetched Own Medical:', ownMedical);
      if (ownMedical.length === 0) {
        console.log('No data found for this SSN');
        return res.status(200).json([]);
      }
      res.status(200).json(ownMedical);
    })
    .catch((err) => {
      console.log('Error retrieving own medical data:', err);
      res.status(500).json({ message: 'Error retrieving own medical data', error: err });
    });
});

// API endpoint to search for medicines related to a disease from OpenFDA

app.get('/search_medicine', async (req, res) => {
    const { disease } = req.query;  

    console.log('Received disease:', disease); 

    if (!disease) {
        return res.status(400).json({ message: 'Disease name is required' });
    }

    try {
        const query = `https://api.fda.gov/drug/label.json?search=indications_and_usage:${encodeURIComponent(disease)}&limit=5`;
        console.log('Query being sent to OpenFDA:', query); 

        const response = await axios.get(query);
        console.log('Full API Response:', response.data); // Debugging: log full response

        if (response.data.results && response.data.results.length > 0) {
            const medicines = response.data.results.map(item => ({
                name: item.openfda?.brand_name?.[0] || 'N/A',
                manufacturer: item.openfda?.manufacturer_name?.[0] || 'N/A',
                substance_name: item.openfda?.substance_name?.[0] || 'N/A',
                description: item.description || 'N/A',
            }));

            return res.status(200).json(medicines);
        } else {
            console.log('No medicines found for this disease');
            return res.status(404).json({ message: 'No medicines found for this disease' });
        }
    } catch (error) {
        console.error('Error fetching medicine data from OpenFDA:', error.response ? error.response.data : error.message);
        return res.status(500).json({ message: 'Error fetching data from OpenFDA' });
    }
});


  
  

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
