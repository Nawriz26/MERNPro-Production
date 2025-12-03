/**
 * PatientForm Component
 * ---------------------
 * - Handles creation and editing of patient records
 * - Uses controlled inputs
 * - When editing, preloads selected patient data into form
 * - Calls onSubmit() with form payload
 */

import { useState, useEffect } from 'react';

export default function PatientForm({ onSubmit, initial }) {
  // Default patient object
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    notes: '',
  });

  // Populate form when editing an existing patient
  useEffect(() => {
    if (initial) {
      setForm(initial); // Fill with editing data
    } else {
      // Reset for new patient
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

  // Handle form submission
  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);

    // Reset form only if adding a NEW patient
    if (!initial) {
      setForm({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        notes: '',
      });
    }
  };

  // Reusable field generator
  const field = (key, type = 'text', label = null) => (
    <div className="mb-2">
      <label className="form-label">{label ?? key}</label>
      <input
        type={type}
        className="form-control"
        value={form[key] ?? ''}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <form onSubmit={submit}>
      {field('name', 'text', 'Name')}
      {field('email', 'email', 'Email')}
      {field('phone', 'text', 'Phone')}
      {field('dateOfBirth', 'date', 'Date of Birth')}
      {field('address', 'text', 'Address')}
      {field('notes', 'text', 'Notes')}

      <button className="btn btn-primary mt-3 float-end">
        {initial ? 'Update' : 'Save'}
      </button>
    </form>
  );
}
