import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NewsletterConfirm = () => {
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const email = params.get('email');
    if (!token || !email) {
      setStatus('error');
      setMessage('Invalid confirmation link.');
      return;
    }
    axios.get(`/api/newsletter/confirm?token=${token}&email=${encodeURIComponent(email)}`)
      .then(res => {
        setStatus('success');
        setMessage(res.data.message || 'Subscription confirmed!');
      })
      .catch(err => {
        setStatus('error');
        if (err.response && err.response.data && err.response.data.message) {
          setMessage(err.response.data.message);
        } else {
          setMessage('Confirmation failed. Please try again.');
        }
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Newsletter Confirmation</h2>
        <div className={status === 'success' ? 'text-green-600' : 'text-red-600'}>{message}</div>
      </div>
    </div>
  );
};

export default NewsletterConfirm; 