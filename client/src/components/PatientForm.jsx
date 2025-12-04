// PatientForm.jsx
// ---------------
// Controlled form for creating/editing a patient.
// Validations:
// - email: required, valid email
// - phone: required, format xxx-xxx-xxxx
// - dateOfBirth: required, must be before today
// - address: required

import { useState, useEffect } from 'react';

export default function PatientForm({ onSubmit, initial }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  // Set max for DOB (today) in yyyy-mm-dd
  const todayStr = new Date().toISOString().slice(0, 10);

  // Initialize form when editing
  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || '',
        email: initial.email || '',
        phone: initial.phone || '',
        dateOfBirth: initial.dateOfBirth
          ? initial.dateOfBirth.slice(0, 10)
          : '',
        address: initial.address || '',
        notes: initial.notes || '',
      });
    } else {
      setForm({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        notes: '',
      });
    }
  }, [initial]);

  const validate = () => {
    const errs = {};

    if (!form.name.trim()) errs.name = 'Name is required';

    // Email required + simple regex
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        errs.email = 'Please enter a valid email';
      }
    }

    // Phone required + xxx-xxx-xxxx
    if (!form.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else {
      const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
      if (!phoneRegex.test(form.phone)) {
        errs.phone = 'Phone format must be xxx-xxx-xxxx';
      }
    }

    // DOB required + < today
    if (!form.dateOfBirth) {
      errs.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(form.dateOfBirth);
      const today = new Date(todayStr); // ignore time of day
      if (dob >= today) {
        errs.dateOfBirth = 'Date of birth must be before today';
      }
    }

    // Address required
    if (!form.address.trim()) {
      errs.address = 'Address is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);

    // Only reset form after creating a new patient
    if (!initial) {
      setForm({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        notes: '',
      });
      setErrors({});
    }
  };

  const field = (key, type = 'text', label = null, extraProps = {}) => (
    <div className="mb-2">
      <label className="form-label">{label ?? key}</label>
      <input
        type={type}
        className={`form-control ${errors[key] ? 'is-invalid' : ''}`}
        value={form[key] ?? ''}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        {...extraProps}
      />
      {errors[key] && <div className="invalid-feedback">{errors[key]}</div>}
    </div>
  );

  return (
    <form onSubmit={submit}>
      {field('name', 'text', 'Name', { required: true })}
      {field('email', 'email', 'Email', {
        required: true,
        placeholder: 'user@example.com',
      })}
      {field('phone', 'text', 'Phone', {
        required: true,
        placeholder: '123-456-7890',
      })}
      {field('dateOfBirth', 'date', 'Date of Birth', {
        required: true,
        max: todayStr,
      })}

      <div className="mb-2">
        <label className="form-label">Address</label>
        <input
          className={`form-control ${errors.address ? 'is-invalid' : ''}`}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />
        {errors.address && (
          <div className="invalid-feedback">{errors.address}</div>
        )}
      </div>

      <div className="mb-2">
        <label className="form-label">Notes</label>
        <textarea
          className="form-control"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={2}
        />
      </div>

      <button className="btn btn-primary mt-3 float-end">
        {initial ? 'Update' : 'Save'}
      </button>
    </form>
  );
}
