// render step by step

import React, { useRef, useEffect } from 'react';
import FormField from './FormField';

//Each step

const FormStep = ({ step, formData, errors, updateFormData, isFieldVisible }) => { //props
  const autoFocusRef = useRef(null);

  useEffect(() => {
    if (autoFocusRef.current && step.autoFocusField) {
      autoFocusRef.current.focus();
    }
  }, [step.autoFocusField]);

  return (
    <div className="form-step">
      <h2 className="step-title">{step.label}</h2>
      <div className="fields-container">
        {step.fields.map((field) => {
          const isVisible = isFieldVisible(field);
          const isAutoFocus = field.name === step.autoFocusField;
          
          return (
            <div
              key={field.name}
              className={`field-wrapper ${!isVisible ? 'hidden' : ''}`}
            >
 

              <FormField // Passing to Child (FormField) & Fields dynamic render
                field={field}
                value={formData[field.name]}
                error={errors[field.name]}
                onChange={updateFormData} // Parent function
                ref={isAutoFocus ? autoFocusRef : null}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormStep;