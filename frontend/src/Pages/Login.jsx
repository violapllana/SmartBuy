import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../Components/api';  // Correct import for default export
import Cookies from 'js-cookie';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Access the location object

  // Get the previous path or default to '/'
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('http://localhost:5108/login', { username, password });
      const data = response.data;
      console.log('Server response:', data);

      // Save the token in cookies
      Cookies.set('AuthToken', data.token, { secure: true, sameSite: 'strict' });

      // Log login success
      console.log('Login successful');
      const loggedInUsername = username;
      console.log('Logged in as:', loggedInUsername);

      // Call the onLogin function if provided
      if (onLogin) {
        onLogin(loggedInUsername, password);
      } else {
        console.warn('onLogin function is not defined!');
      }

      // Clear password for security
      setPassword('');

      // Redirect to the previous page or default to home
      navigate(from);
    } catch (error) {
      console.error('Kyqja dështoi:', error.response?.data?.message || error.message);
      setError('Emri i përdoruesit ose fjalëkalimi është i pasaktë. Ju lutem kontrolloni të dhënat dhe provoni përsëri.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Log in</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <button
  type="submit"
  className="w-full bg-gradient-to-r from-green-300 via-green-400 to-green-500 text-white font-semibold py-2 rounded-md transition duration-300 ease-in-out hover:opacity-90"
>
  Kyqu
</button>


        </form>
        <div className="mt-4 text-center">
          <span>Don't have an account?</span>
          <Link to="/register" className="text-blue-500 hover:underline ml-1">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
