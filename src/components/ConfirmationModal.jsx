//last confirmation popup

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const ConfirmationModal = ({ formData, formConfig, onConfirm, onCancel }) => { //props
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onCancel]);

  const renderFieldValue = (field, value) => {
    if (!value && value !== 0) return 'Not provided';
    
    if (field.type === 'checkbox') {
      return value ? 'Yes' : 'No';
    }
    
    return value.toString();
  };

  const modalContent = (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Confirm Submission</h2>
          <button onClick={onCancel} className="close-button">&times;</button>
        </div>
        
        <div className="modal-body">
          <p>Please review your information before submitting:</p>
          
          <div className="confirmation-data">
            {formConfig.steps.map(step => (
              <div key={step.id} className="confirmation-section">
                <h3>{step.label}</h3>
                {step.fields.map(field => {
                  if (field.visibleIf) {
                    const { field: dependentField, value: expectedValue } = field.visibleIf;
                    if (formData[dependentField] !== expectedValue) {
                      return null;
                    }
                  }
                  
                  return (
                    <div key={field.name} className="confirmation-field">
                      <strong>{field.label}:</strong>
                      <span>{renderFieldValue(field, formData[field.name])}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        <div className="modal-footer">
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-primary">
            Confirm Submission
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById('modal-root') || document.body
  );
};

export default ConfirmationModal;