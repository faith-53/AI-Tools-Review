import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resetPassword } from '../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      // TODO: Implement API call for resetting password
      await resetPassword(token, password);
      setMessage('Your password has been reset. You can now log in.');
    } catch (err) {
        console.log(err)
      setError('Failed to reset password. The link may be invalid or expired.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md w-full space-y-8 mx-auto">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset Password
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="New password"
            />
          </div>
          <div>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Confirm new password"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>
      </form>
      <div className="text-center text-sm text-gray-600">
        <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
      </div>
    </div>
  );
};

export default ResetPassword; 