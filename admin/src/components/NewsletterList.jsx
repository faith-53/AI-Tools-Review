import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NewsletterList = () => {
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState('');

  const fetchSignups = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/newsletter/all');
      setSignups(res.data);
    } catch (err) {
      setError('Failed to fetch signups', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignups();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this signup?')) return;
    setDeleting(id);
    try {
      await axios.delete(`/api/newsletter/${id}`);
      setSignups(signups.filter(s => s._id !== id));
    } catch {
      alert('Failed to delete signup');
    } finally {
      setDeleting('');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Newsletter Signups</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : signups.length === 0 ? (
        <div>No signups found.</div>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="p-2 border-b">Email</th>
              <th className="p-2 border-b">Date</th>
              <th className="p-2 border-b">Confirmed</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {signups.map(s => (
              <tr key={s._id}>
                <td className="p-2 border-b">{s.email}</td>
                <td className="p-2 border-b">{new Date(s.date).toLocaleString()}</td>
                <td className="p-2 border-b">{s.confirmed ? 'Yes' : 'No'}</td>
                <td className="p-2 border-b">
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(s._id)}
                    disabled={deleting === s._id}
                  >
                    {deleting === s._id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NewsletterList; 