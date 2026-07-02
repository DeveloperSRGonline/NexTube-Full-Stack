'use client';

import { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'avatar') {
      setAvatar(e.target.files[0]);
    } else if (e.target.name === 'coverImage') {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!avatar) {
      setMessage({ type: 'error', text: 'Avatar image is required.' });
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('avatar', avatar);
    
    if (coverImage) {
      data.append('coverImage', coverImage);
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/users/register', {
        method: 'POST',
        body: data,
      });
      console.log(response)

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message || 'Registration successful!' });
        setFormData({ fullName: '', username: '', email: '', password: '' });
        setAvatar(null);
        setCoverImage(null);
        // Reset file inputs manually
        document.getElementById('avatar-input').value = '';
        const coverInput = document.getElementById('cover-input');
        if (coverInput) coverInput.value = '';
      } else {
        setMessage({ type: 'error', text: result.message || 'Something went wrong.' });
      }
    } catch (error) {
      console.error('Registration Error:', error);
      setMessage({ type: 'error', text: 'Failed to connect to the backend server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <div>
          <h2 className="title">NexTube</h2>
          <p className="subtitle">Create your dark-mode account</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g., John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g., johndoe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., john@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="avatar-input">Avatar Image *</label>
            <input
              type="file"
              id="avatar-input"
              name="avatar"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cover-input">Cover Image (Optional)</label>
            <input
              type="file"
              id="cover-input"
              name="coverImage"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
