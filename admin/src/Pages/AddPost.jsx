import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function AddPost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('tags', tags);
    if (image) formData.append('image', image);
    formData.append('content', content);
    await fetch('https://ai-tools-review.onrender.com/api/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
        <textarea placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} className="w-full p-2 border rounded" />
        <input type="file" onChange={e => setImage(e.target.files[0])} className="w-full" accept="image/*" />
        <div className="mt-6">
          <label className="block font-semibold mb-2">Content</label>
          <ReactQuill theme="snow" value={content} onChange={setContent} className="bg-white" />
        </div>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded" disabled={loading}>{loading ? 'Adding...' : 'Add Post'}</button>
      </form>
    </div>
  );
}

export default AddPost; 