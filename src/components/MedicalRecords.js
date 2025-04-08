import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import '../styles/MedicalRecords.css';

const transformRecords = (rawData, filter) => {
  if (!rawData) return [];

  return Object.entries(rawData).reduce((acc, [category, items]) => {
    if (filter === 'all' || category.includes(filter)) {
      return [
        ...acc,
        ...items.map(item => ({
          ...item,
          category,
        })),
      ];
    }
    return acc;
  }, []);
};

const MedicalRecords = ({ userId, filter }) => {
  const [transformedRecords, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/records/${userId}`);

        if (!response.data || typeof response.data !== 'object') {
          throw new Error('Invalid data format received');
        }

        setRecords(transformRecords(response.data, filter));
      } catch (err) {
        setError({
          message: err.response?.data?.message || err.message,
          status: err.response?.status,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, filter]);

  const renderRecord = record => (
    <div key={record.id || record._id} className="record-card">
      <div className="record-header">
        <h3>{record.title || 'Untitled Record'}</h3>
        <span className="record-category">{record.category}</span>
      </div>
      <div className="record-body">
        {record.date && (
          <p className="record-date">
            {new Date(record.date).toLocaleDateString()}
          </p>
        )}
        {record.values &&
          Object.entries(record.values).map(([key, val]) => (
            <div key={key} className="record-value">
              <strong>{key}:</strong>
              <span>{typeof val === 'object' ? JSON.stringify(val) : val}</span>
            </div>
          ))}
      </div>
    </div>
  );

  if (loading) return <div className="loading-spinner">Loading records...</div>;
  if (error) return <div className="error-alert">Error: {error.message}</div>;

  return (
    <div className="records-grid">
      {transformedRecords.length > 0 ? (
        transformedRecords.map(renderRecord)
      ) : (
        <div className="no-records">No records found for this category</div>
      )}
    </div>
  );
};

MedicalRecords.propTypes = {
  userId: PropTypes.string.isRequired,
  filter: PropTypes.string.isRequired,
};

export default MedicalRecords;

