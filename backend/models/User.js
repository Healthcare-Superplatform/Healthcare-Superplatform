const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    SSN: { type: String, required: true, unique: true, _id: true },  // Set SSN as the _id (unique identifier)
    Name: { type: String, required: true },
    Age: { type: Number, required: true },
    "Height(cm)": { type: Number, required: true },
    "Weight(kg)": { type: Number, required: true },
    Location: { type: String, required: true },
    Occupation: { type: String, required: true },
    Language: { type: String, required: true },
  }
);

// Create the User model using the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
