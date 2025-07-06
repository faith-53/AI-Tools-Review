import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`https://ai-tools-review.onrender.com/api/posts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setTitle(data.title);
      setSummary(data.summary || '');
      setTags(data.tags?.join(', ') || '');
      setContent(data.content || '');
      setLoading(false);
    };
    fetchPost();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (image) {
      // If a new image is selected, use FormData
      const formData = new FormData();
      formData.append('title', title);
      formData.append('summary', summary);
      formData.append('tags', tags);
      formData.append('image', image);
      formData.append('content', content);
      await fetch(`https://ai-tools-review.onrender.com/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
    } else {
      // If no new image, send JSON
      await fetch(`https://ai-tools-review.onrender.com/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          summary,
          tags,
          content
        })
      });
    }
    setLoading(false);
    navigate('/');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
        <textarea placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} className="w-full p-2 border rounded" />
        <input type="file" onChange={e => setImage(e.target.files[0])} className="w-full" accept="image/*" />
        <div className="mt-6">
          <label className="block font-semibold mb-2">Content</label>
          <ReactQuill theme="snow" value={content} onChange={setContent} className="bg-white" />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
}

export default EditPost; 