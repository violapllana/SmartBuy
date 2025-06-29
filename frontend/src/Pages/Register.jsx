import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Components/api';  // Make sure this path and case are correct

const Register = () => {
  const [formData, setFormData] = useState({
    UserName: '',
    Email: '',
    Password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('http://localhost:5108/register', formData);
      if (response.status === 200) {
        alert('Registration completed successfully! Welcome.');
        setError('');
        setFormData({
          UserName: '',
          Email: '',
          Password: '',
        });
        navigate('/');  // Redirect home
      } else {
        throw new Error('Registration failed!');
      }
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      setError('Registration failed. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 relative overflow-hidden flex items-center justify-center">
      {/* Background elements, omitted here for brevity */}

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:scale-105">
          <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 px-8 py-10 text-center relative overflow-hidden">
            {/* Header background pattern (omitted) */}
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-emerald-100">Join us and start your journey today</p>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label htmlFor="UserName" className="block text-sm font-semibold text-emerald-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="UserName"
                  name="UserName"
                  value={formData.UserName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Choose a username"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="Email" className="block text-sm font-semibold text-emerald-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="Email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="Password" className="block text-sm font-semibold text-emerald-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="Password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Create a strong password"
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 text-red-700">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-semibold transition"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
