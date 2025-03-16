const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Import CORS
const User = require('./models/User');  // Import the User model
const MedicalList = require('./models/MedicalList'); // Import the MedicalList model
const OwnMedical = require('./models/OwnMedical'); // Import the OwnMedical model

const app = express();
app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // For parsing application/json

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/superplatform-backend', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB!');
  console.log('Connected to database:', mongoose.connection.name);  // Debugging
})
.catch((err) => console.log('Error connecting to MongoDB:', err));

// API endpoint to fetch all users
app.get('/users', (req, res) => {
  User.find({})
    .then((users) => {
      console.log('Users retrieved:', users);  // Debugging
      res.status(200).json(users);  // Return users as JSON
    })
    .catch((err) => {
      console.log('Error retrieving users:', err);
      res.status(500).json({ message: 'Error retrieving users', error: err });
    });
});

// API endpoint to fetch medical list items based on Location
app.get('/medical_list', (req, res) => {
    const { location } = req.query; // Get the location from query parameters
    if (location) {
      MedicalList.find({ Location: location }) // Match the location in the medical_list collection
        .then((medicalList) => {
          if (medicalList.length === 0) {
            return res.status(200).json([]);
          }
          res.status(200).json(medicalList);  // Return the data as JSON
        })
        .catch((err) => {
          console.log('Error retrieving medical list:', err);
          res.status(500).json({ message: 'Error retrieving medical list', error: err });
        });
    } else {
      // If no location is provided, return all data
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
    const { ssn } = req.query;  // Get SSN from query parameters
    console.log('Fetching data from own_medical collection for SSN:', ssn);  // Debugging log
  
    // Ensure that SSN is treated as a string and perform the query
    const query = ssn ? { SSN: String(ssn) } : {};  // Match SSN as string
  
    OwnMedical.find(query)
      .then((ownMedical) => {
        console.log('Fetched Own Medical:', ownMedical);  // Log the fetched data
        if (ownMedical.length === 0) {
          console.log('No data found for this SSN');
          return res.status(200).json([]);  // Return empty array if no data
        }
        res.status(200).json(ownMedical);  // Return the data as JSON
      })
      .catch((err) => {
        console.log('Error retrieving own medical data:', err);
        res.status(500).json({ message: 'Error retrieving own medical data', error: err });
      });
  });

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
