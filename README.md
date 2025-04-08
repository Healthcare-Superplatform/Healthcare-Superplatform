# Healthcare-Superplatform (Yiming Branch)

This branch enhances the platform with medical record archiving, categorization, and personalized health recommendations functionality.

## Features

### Core Features
- 🗃️ **Medical Record Archiving System**  
  Enables the archiving of medical records for easy retrieval and management.
  
- 🏷️ **Automatic Record Categorization**  
  Categorizes records into predefined types such as lab results, vital signs, prescriptions, and more.
  
- 💡 **AI-Powered Health Recommendations**  
  Provides personalized health recommendations based on medical data and patterns.
  
- 🔍 **Integrated with Existing AI Assistant**  
  Enhances the AI assistant with the ability to manage medical records and provide health-related advice.
  
- 🚨 **Proactive Health Monitoring Alerts**  
  Sends alerts for overdue checkups, abnormal results, and other health concerns.

## Setup

### Prerequisites
To set up the project, make sure you have the following:

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB instance
- Git
- VS Code (recommended)

### Installation

1. Clone the repository and install dependencies:
    ```bash
    git clone https://github.com/Healthcare-Superplatform/Healthcare-Superplatform.git
    cd Healthcare-Superplatform
    git checkout yiming
    npm install
    ```

2. **Configure the environment:**
    Create a `.env` file in the root directory with the following content:

    ```env
    MONGODB_URI=mongodb+srv://<username>:<password>@your-cluster.mongodb.net/superplatform-backend?retryWrites=true&w=majority
    PORT=5001
    ```

3. **Seed sample data:**
    To seed the sample medical records, run:

    ```bash
    node seedMedicalRecords.js
    ```

    Expected output: 
    ```
    Sample medical records seeded successfully!
    ```

### Running the Application

1. **Start the Backend Server:**
    ```bash
    node server.js
    ```

2. **Start the Frontend (in a separate terminal):**
    ```bash
    npm start
    ```

3. **Access URLs:**

    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend API: [http://localhost:5001](http://localhost:5001)

## Testing

### 1. Medical Records Interface
Navigate to: [http://localhost:3000/medical-records](http://localhost:3000/medical-records)

- Verify categorized records (Lab Results, Vital Signs, etc.)
- Test the archiving functionality using the "Archive" button.

### 2. Health Recommendations
Check the "Health Recommendations" section. Recommendations will appear based on:

1. Abnormal test results
2. Due vaccinations
3. Annual checkup reminders

### 3. AI Assistant Integration
Open: [http://localhost:3000/ai-health-assistant](http://localhost:3000/ai-health-assistant)

Try the following test commands:

- `show records`
- `What vaccinations do I need?`
- `Do I have any abnormal test results?`
- `When was my last checkup?`

### 4. API Endpoint Testing

- **Get Categorized Records:**
    ```bash
    curl http://localhost:5001/api/records/101
    ```

- **Archive a Record (replace :id with actual record ID):**
    ```bash
    curl -X PATCH http://localhost:5001/api/records/:id/archive
    ```

- **Get Recommendations:**
    ```bash
    curl http://localhost:5001/api/recommendations/101
    ```

### Test Data

Two test users are available:

#### User 101
- Elevated blood pressure (138/88)
- Overdue flu shot (last October 2022)
- Normal blood work

#### User 102
- High cholesterol (LDL 140)
- Recent annual checkup (January 2023)

## Troubleshooting

| **Issue**                           | **Solution**                                                       |
|-------------------------------------|--------------------------------------------------------------------|
| **MongoDB connection errors**       | Verify connection string in `.env`                                 |
| **No recommendations appearing**    | Ensure sample data was seeded correctly                           |
| **AI command issues**               | Check network requests in browser dev tools for errors            |

## Development Notes

### Key Architecture:
- **Medical records** are stored in the `medical_records` collection.
- **Archived records** use the `isArchived: true` flag.
- **Recommendation engine** triggers based on:
  1. Abnormal value detection (e.g., abnormal lab results)
  2. Temporal patterns (e.g., overdue checkups, vaccinations)
  3. Clinical guideline compliance (e.g., reminder for annual checkup)
