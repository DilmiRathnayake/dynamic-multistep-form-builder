// create input field

import React, { forwardRef } from 'react';

//Every input field

const FormField = forwardRef(({ field, value, error, onChange }, ref) => { //props
  // Used in FormField
  const handleChange = (e) => {
    const newValue = field.type === 'checkbox' ? e.target.checked : e.target.value;
    onChange(field.name, newValue); //call parent
  };

  const commonProps = {
    id: field.name,
    name: field.name,
    value: field.type === 'checkbox' ? undefined : value,
    checked: field.type === 'checkbox' ? value : undefined,
    onChange: handleChange,
    required: field.required,
    className: `form-field ${error ? 'error' : ''}`,
    ref: ref
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            {...commonProps}
            type={field.type}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            min={field.min}
            max={field.max}
          />
        );

      case 'textarea':
        return (
          <textarea
            {...commonProps}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            rows={4}
          />
        );

      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select {field.label}</option>
            {field.options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="radio-group">
            {field.options.map(option => (
              <label key={option} className="radio-option">
                <input
                  type="radio"
                  name={field.name}
                  value={option}
                  checked={value === option}
                  onChange={handleChange}
                  required={field.required}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <label className="checkbox-option">
            <input
              {...commonProps}
              type="checkbox"
            />
            <span>{field.label}</span>
          </label>
        );

      default:
        return <input {...commonProps} type="text" />;
    }
  };

  return (
    <div className="form-field-container">
      {field.type !== 'checkbox' && (
        <label htmlFor={field.name} className="field-label">
          {field.label}
          {field.required && <span className="required">*</span>}
        </label>
      )}
      
      {renderField()}
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;