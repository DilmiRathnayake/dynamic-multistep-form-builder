//this form is the parent/container - Managing the entire form (like brain)

import  { useState, useRef, useEffect } from 'react';
import FormStep from './FormStep';
import ConfirmationModal from './ConfirmationModal';
import '../styles/MultiStepForm.css';

 //Dynamic Rendering - auto create JSON
const formConfig = {
  "title": "Employee Onboarding Form",
  "description": "A dynamic multi-step form for new employee registration.",
  "steps": [
    {
      "id": "personal-info",
      "label": "Personal Information",
      "autoFocusField": "firstName",
      "fields": [
        {
          "name": "firstName",
          "label": "First Name",
          "type": "text",
          "placeholder": "John",
          "required": true,
          "maxLength": 40
        },
        {
          "name": "lastName",
          "label": "Last Name",
          "type": "text",
          "placeholder": "Doe",
          "required": true,
          "maxLength": 40
        },
        {
          "name": "age",
          "label": "Age",
          "type": "number",
          "required": true,
          "min": 18,
          "max": 65
        },
        {
          "name": "gender",
          "label": "Gender",
          "type": "select",
          "options": ["Male", "Female", "Other"],
          "required": false
        }
      ]
    },

    {
      "id": "contact",
      "label": "Contact Details",
      "autoFocusField": "email",
      "fields": [
        {
          "name": "email",
          "label": "Email Address",
          "type": "email",
          "required": true
        },
        {
          "name": "phone",
          "label": "Phone Number",
          "type": "text",
          "placeholder": "+94 771234567",
          "required": true,
          "pattern": "^\\+?[0-9]{9,15}$"
        },
        {
          "name": "address",
          "label": "Address",
          "type": "textarea",
          "required": false,
          "maxLength": 200
        }
      ]
    },
    {
      "id": "employment",
      "label": "Employment Details",
      "autoFocusField": "position",
      "fields": [
        {
          "name": "position",
          "label": "Position",
          "type": "select",
          "options": ["Developer", "Designer", "QA Engineer", "HR Manager"],
          "required": true
        },
        {
          "name": "experience",
          "label": "Years of Experience",
          "type": "number",
          "min": 0,
          "max": 40,
          "required": true
        },
        {
          "name": "hasLaptop",
          "label": "Company Laptop Needed?",
          "type": "radio",
          "options": ["Yes", "No"],
          "required": true
        },
        {
          "name": "laptopModel",
          "label": "Preferred Laptop Model",
          "type": "select",
          "options": ["MacBook Pro", "Dell XPS 15", "ThinkPad X1 Carbon"],
          "required": false,
          "visibleIf": {
            "field": "hasLaptop",
            "value": "Yes"
          }
        }
      ]
    },
    {
      "id": "final",
      "label": "Confirmation",
      "fields": [
        {
          "name": "confirm",
          "type": "checkbox",
          "label": "I confirm that all information provided is accurate.",
          "required": true
        }
      ]
    }
  ]
};

// ui components parts were divided
 
const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);  
  const [formData, setFormData] = useState({});// All states are in one place - State Management & Lifting State Up
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const formRef = useRef(null);

  const currentStepConfig = formConfig.steps[currentStep];

  useEffect(() => {
    const initialData = {};
    formConfig.steps.forEach(step => {
      step.fields.forEach(field => {
        if (field.type === 'radio') {
          initialData[field.name] = '';
        } else if (field.type === 'checkbox') {
          initialData[field.name] = false;
        } else {
          initialData[field.name] = '';
        }
      });
    });
    setFormData(initialData);
  }, []);

  // The function in Parent - Lifting State Up 

  const updateFormData = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = () => {
    const stepErrors = {};
    const currentFields = currentStepConfig.fields;

    currentFields.forEach(field => {

      if (field.visibleIf && !isFieldVisible(field)) {
        return;
      }

      const value = formData[field.name];
      
      if (field.required) {
        if (field.type === 'checkbox' && !value) {
          stepErrors[field.name] = 'This field is required';
        } else if (field.type !== 'checkbox' && (!value || value.toString().trim() === '')) {
          stepErrors[field.name] = 'This field is required';
        }
      }

      if (value && field.pattern && !new RegExp(field.pattern).test(value)) {
        stepErrors[field.name] = 'Invalid format';
      }


      if (value && field.min !== undefined && Number(value) < field.min) {
        stepErrors[field.name] = `Minimum value is ${field.min}`;
      }

      if (value && field.max !== undefined && Number(value) > field.max) {
        stepErrors[field.name] = `Maximum value is ${field.max}`;
      }


      if (value && field.maxLength && value.length > field.maxLength) {
        stepErrors[field.name] = `Maximum length is ${field.maxLength} characters`;
      }
    });

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const isFieldVisible = (field) => { //Conditional field 
    if (!field.visibleIf) return true;
    
    const { field: dependentField, value: expectedValue } = field.visibleIf;
    return formData[dependentField] === expectedValue;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep()) {
      setShowModal(true);
    }
  };

  const handleConfirm = () => {
    console.log('Form submitted:', formData);
    setShowModal(false);
    alert('Form submitted successfully!');
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const isLastStep = currentStep === formConfig.steps.length - 1;

  return (
    <div className="multi-step-form" ref={formRef}>
      <div className="form-header">
        <h1>{formConfig.title}</h1>
        <p>{formConfig.description}</p>
      </div>

      {}
      <div className="step-indicator">
        {formConfig.steps.map((step, index) => ( // Steps dynamic render
          <div
            key={step.id}
            className={`step ${index === currentStep ? 'active' : ''} ${
              index < currentStep ? 'completed' : ''
            }`}
          >
            <div className="step-number">{index + 1}</div>
            <span className="step-label">{step.label}</span>
          </div>
        ))}
      </div>

      {}
      <FormStep
        step={currentStepConfig}
        formData={formData}
        errors={errors}
        updateFormData={updateFormData}
        isFieldVisible={isFieldVisible}
      />

      {}
      <div className="form-navigation">
        {currentStep > 0 && (
          <button type="button" onClick={handlePrevious} className="btn btn-secondary">
            Previous
          </button>
        )}
        
        {!isLastStep ? (
          <button type="button" onClick={handleNext} className="btn btn-primary">
            Next
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} className="btn btn-primary">
            Submit
          </button>
        )}
      </div>

      {}
      {showModal && (
        <ConfirmationModal
          formData={formData}
          formConfig={formConfig}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default MultiStepForm;