import React from 'react';
import PropTypes from 'prop-types';
import '../styles/RecordCategoryTabs.css';

const RecordCategoryTabs = ({ categories, activeTab, onTabChange }) => {
  return (
    <div className="record-tabs-container">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`tab-button ${activeTab === category.id ? 'active' : ''}`}
          onClick={() => onTabChange(category.id)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

RecordCategoryTabs.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired
};

export default RecordCategoryTabs;