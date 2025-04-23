import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import '../../styles/Emergency.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EmergencyMedicalPage = ({ embedded = false }) => {
  const hospitals = [
    { id: 1, name: "Oulu University Hospital (OYS)" },
    { id: 2, name: "Finnish Student Health Service(FSHS)" },
    { id: 3, name: "Mehiläinen Oulu Hospital" },
    { id: 4, name: "Tuira Health Care Centre" },
    { id: 5, name: "Terveystalo Oulu" },
  ];

  const [selectedHospital, setSelectedHospital] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [emergencyLevel, setEmergencyLevel] = useState('medium');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [serviceDate, setServiceDate] = useState('');

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!serviceDate) return;

    const times = [];
    const selected = new Date(serviceDate);
    const now = new Date();
    const isToday = selected.toDateString() === now.toDateString();
    const startHour = isToday ? now.getHours() + 1 : 0;

    for (let i = startHour; i < 24; i++) {
      times.push(`${i}:00 - ${i + 1}:00`);
    }

    setAvailableTimes(times);
  }, [serviceDate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedHospital || !phone || !description || !selectedTimeSlot) {
      alert('Please fill in all fields');
      return;
    }

    const startHour = parseInt(selectedTimeSlot.split(':')[0]);
    const serviceTime = serviceDate ? new Date(serviceDate) : new Date();
    serviceTime.setHours(startHour, 0, 0, 0);

    const helsinkiTimeString = serviceTime.toLocaleString("fi-FI", {
      timeZone: "Europe/Helsinki",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    let existingRequests = [];
    try {
      const storedRequests = localStorage.getItem('emergencyRequests');
      existingRequests = storedRequests ? JSON.parse(storedRequests) : [];
    } catch (e) {
      console.error("Error reading from localStorage:", e);
      return;
    }

    const hasDuplicate = existingRequests.some(request => {
      const requestServiceTime = new Date(request.serviceTimeRaw);
      return (
        request.phone === phone &&
        request.hospital === selectedHospital &&
        requestServiceTime.getHours() === serviceTime.getHours() &&
        requestServiceTime.getDate() === serviceTime.getDate() &&
        requestServiceTime.getMonth() === serviceTime.getMonth() &&
        requestServiceTime.getFullYear() === serviceTime.getFullYear()
      );
    });

    if (hasDuplicate) {
      alert(`❌ You have already booked at ${selectedHospital} for ${selectedTimeSlot}`);
      return;
    }

    const confirmation = {
      hospital: selectedHospital,
      phone,
      description,
      emergencyLevel,
      serviceTime: helsinkiTimeString,
      serviceTimeRaw: serviceTime.getTime(),
      caseId: `EM-${Date.now()}`
    };

    try {
      localStorage.setItem('emergencyRequests', JSON.stringify([...existingRequests, confirmation]));
    } catch (e) {
      console.error('Error writing to localStorage:', e);
      return;
    }

    setConfirmationData(confirmation);
    setSubmissionSuccess(true);
    setSelectedHospital('');
    setPhone('');
    setDescription('');
    setEmergencyLevel('medium');
    setSelectedTimeSlot('');
    setServiceDate(null);
  };

  return (
    <div className={`page-layout ${embedded ? "embedded-emergency" : ""}`}>
      {!embedded && <Sidebar />}
      <div className={`main-content emergency-medical-page ${embedded ? "compact" : ""}`}>
        {!embedded && <Header />}

        <h2>🚑 Emergency Medical Services</h2>

        {!submissionSuccess ? (
          <form onSubmit={handleSubmit} className="emergency-form">
            <div className="form-columns">
              <div className="form-left">
                <div className="form-group">
                  <label>Select Hospital/Clinic:</label>
                  <div className="searchable-dropdown">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search for a hospital or clinic"
                    />
                    <select
                      value={selectedHospital}
                      onChange={(e) => setSelectedHospital(e.target.value)}
                      required
                    >
                      <option value="">-- Select a hospital or clinic --</option>
                      {filteredHospitals.map((hospital) => (
                        <option key={hospital.id} value={hospital.name}>
                          {hospital.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number:</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    pattern="[0-9]{10,15}"
                    title="Please enter a valid phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Emergency Level:</label>
                  <div className="emergency-levels">
                    {['low', 'medium', 'high', 'critical'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        className={`level-btn ${emergencyLevel === level ? 'active' : ''} ${level}`}
                        onClick={() => setEmergencyLevel(level)}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Problem Description:</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={embedded ? 4 : 10}
                  />
                </div>
              </div>

              <div className="form-right">
                <div className="form-group">
                  <label>Select Service Date:</label>
                  <DatePicker
                    selected={serviceDate}
                    onChange={(date) => setServiceDate(date)}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>

                <div className="form-group">
                  <label>Available Time Slots:</label>
                  <div className="time-slots">
                    {availableTimes.map((time, index) => (
                      <div key={index} className="time-slot">
                        <input
                          type="radio"
                          id={`time-${index}`}
                          name="serviceTime"
                          value={time}
                          checked={selectedTimeSlot === time}
                          onChange={() => setSelectedTimeSlot(time)}
                          required
                        />
                        <label htmlFor={`time-${index}`}>{time}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Request Emergency Service
            </button>
          </form>
        ) : (
          <div className="confirmation-message">
            <h3>✅ Emergency Request Submitted Successfully!</h3>
            <p><strong>Case ID:</strong> {confirmationData.caseId}</p>
            <p><strong>Hospital:</strong> {confirmationData.hospital}</p>
            <p><strong>Service Time:</strong> {confirmationData.serviceTime}</p>
            <p>We will contact you shortly at {confirmationData.phone}</p>

            <button
              onClick={() => {
                setSubmissionSuccess(false);
                const now = new Date();
                const currentHour = now.getHours();
                const newTimes = Array.from({ length: 6 }, (_, i) => {
                  const hour = (currentHour + i + 1) % 24;
                  return `${hour}:00 - ${hour + 1}:00`;
                });
                setAvailableTimes(newTimes);
              }}
              className="new-request-btn"
            >
              Make Another Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyMedicalPage;