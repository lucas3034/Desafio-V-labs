import { useState } from 'react';

export const useForm = (initialValues, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const rule = validationRules[name];
    if (!rule) return;

    let error = '';

    if (rule.required && !value.trim()) {
      error = rule.requiredMessage || 'Este campo é obrigatório';
    } else if (rule.minLength && value.length < rule.minLength) {
      error = rule.minLengthMessage || `Mínimo de ${rule.minLength} caracteres`;
    } else if (rule.maxLength && value.length > rule.maxLength) {
      error = rule.maxLengthMessage || `Máximo de ${rule.maxLength} caracteres`;
    } else if (rule.pattern && !rule.pattern.test(value)) {
      error = rule.patternMessage || 'Formato inválido';
    } else if (rule.custom) {
      error = rule.custom(value, values) || '';
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    return error === '';
  };

  const validateAll = () => {
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const value = values[field] || '';
      const fieldValid = validateField(field, value);
      if (!fieldValid) {
        isValid = false;
      }
    });

    setTouched(
      Object.keys(validationRules).reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {})
    );

    return isValid;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    setValues
  };
};
