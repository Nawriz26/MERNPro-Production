// Signup.jsx
// Registration page.
// - Uses AuthContext.signup to create a new user
// - Shows spinner for a short time, then success check + toast
// - On success, navigates to /dashboard

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Signup() {
  // Single form object for username / email / password
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const nav = useNavigate();
  const { signup } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Call backend to create account
      await signup(form);

      // Spinner display time
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        toast.success('Account created successfully!');

        // Short pause to show success then go to dashboard
        setTimeout(() => {
          nav('/dashboard');
        }, 800);
      }, 1000);
    } catch {
      setTimeout(() => {
        setLoading(false);
        setError('Signup failed (user may already exist).');
        toast.error('Signup failed – please try again.');
      }, 1000);
    }
  };

  return (
    <div
      className="container py-4 page-transition"
      style={{ maxWidth: 450, alignContent: 'center', height: '100vh' }}
    >
      <form
        className="container text-center page-transition p-4 border border-secondary rounded"
        onSubmit={submit}
      >
        <h2 className="mb-3">Create Account</h2>

        {/* Username */}
        <div className="mb-2">
          <input
            placeholder="Username"
            className="form-control p-3"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-2">
          <input
            type="email"
            placeholder="Email"
            className="form-control p-3"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-2">
          <input
            type="password"
            placeholder="Password"
            className="form-control p-3"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        {/* Error message */}
        {error && <div className="alert alert-danger mt-2">{error}</div>}

        {/* Submit button with spinner / success icon */}
        <button className="btn btn-success mt-3" disabled={loading}>
          {loading && !success && (
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
          )}

          {success && !loading && (
            <i className="bi bi-check-circle-fill text-success me-2"></i>
          )}

          {loading && !success && 'Signing up...'}
          {!loading && success && 'Success!'}
          {!loading && !success && 'Sign Up'}
        </button>

        {/* Link to login */}
        <p className="text-center mt-3 pt-2">
          Already Registered?{' '}
          <Link to="/login">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
