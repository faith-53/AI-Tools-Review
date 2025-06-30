import React, { useState } from 'react';
import axios from 'axios';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await axios.post('/api/newsletter', { email });
      setStatus('success');
      setMessage(res.data.message || 'Please check your email to confirm your subscription.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-2 mt-4">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className="px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {status !== 'idle' && (
        <span className={`ml-2 text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</span>
      )}
    </form>
  );
};

export default NewsletterSignup; 