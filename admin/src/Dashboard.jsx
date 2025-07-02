import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchPosts = async () => {
    setLoading(true);
    const res = await fetch('https://ai-tools-review.onrender.com/api/posts', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await fetch(`https://ai-tools-review.onrender.com/api/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    fetchPosts();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Posts</h2>
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post._id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{post.title}</div>
              <div className="text-sm text-gray-500">{post.tags?.join(', ')}</div>
            </div>
            <div className="flex gap-2">
              <Link to={`/edit/${post._id}`} className="px-3 py-1 bg-blue-500 text-white rounded">Edit</Link>
              <button onClick={() => handleDelete(post._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard; 