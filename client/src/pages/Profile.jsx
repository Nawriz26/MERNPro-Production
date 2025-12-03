// Profile.jsx
// "My Profile" page (protected).
// - Uses AuthContext.user as initial values
// - Sends PUT /api/users/profile to update username/email
// - On success, calls updateUserFromProfile so Navbar shows new username

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';


export default function Profile() {
  const { user, updateUserFromProfile } = useAuth();

  // Local form state initialized from current user
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  const [loading, setLoading] = useState(false);

  // If user is not logged in, show simple message
  if (!user) {
    return (
      <div className="container py-4 page-transition" style={{ maxWidth: 500 }}>
        <h2>My Profile</h2>
        <p>Please log in.</p>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend route: PUT /api/users/profile
      const { data } = await api.put('/users/profile', form);

      // Depending on response shape, we support either { user } or plain user
      updateUserFromProfile(data.user || data);

      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 page-transition" style={{ maxWidth: 500 }}>
      <h2>My Profile</h2>

      <form onSubmit={submit} className="mt-3">
        {/* Username */}
        <div className="mb-2">
          <label className="form-label">Username</label>
          <input
            className="form-control"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            required
          />
        </div>

        {/* Email */}
        <div className="mb-2">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <button className="btn btn-primary mt-2" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
