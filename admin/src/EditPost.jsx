import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuth();
  const [pros, setPros] = useState(['']);
  const [cons, setCons] = useState(['']);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setTitle(data.title);
      setContent(data.content);
      setTags(data.tags?.join(', ') || '');
      setPros(data.pros && data.pros.length ? data.pros : ['']);
      setCons(data.cons && data.cons.length ? data.cons : ['']);
      setLoading(false);
    };
    fetchPost();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('tags', tags);
    if (image) formData.append('image', image);
    formData.append('pros', JSON.stringify(pros.filter(p => p.trim() !== '')));
    formData.append('cons', JSON.stringify(cons.filter(c => c.trim() !== '')));
    await fetch(`http://localhost:5000/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });
    setLoading(false);
    navigate('/');
  };

  const handleProsChange = (idx, value) => {
    const newPros = [...pros];
    newPros[idx] = value;
    setPros(newPros);
  };
  const handleAddPro = () => setPros([...pros, '']);
  const handleRemovePro = (idx) => setPros(pros.filter((_, i) => i !== idx));

  const handleConsChange = (idx, value) => {
    const newCons = [...cons];
    newCons[idx] = value;
    setCons(newCons);
  };
  const handleAddCon = () => setCons([...cons, '']);
  const handleRemoveCon = (idx) => setCons(cons.filter((_, i) => i !== idx));

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
        <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} className="w-full p-2 border rounded" />
        <input type="file" onChange={e => setImage(e.target.files[0])} className="w-full" accept="image/*" />
        <label className="block font-semibold">Pros</label>
        {pros.map((pro, idx) => (
          <div key={idx} className="flex mb-2">
            <input type="text" value={pro} onChange={e => handleProsChange(idx, e.target.value)} className="w-full p-2 border rounded" placeholder={`Pro #${idx+1}`} />
            {pros.length > 1 && <button type="button" onClick={() => handleRemovePro(idx)} className="ml-2 text-red-500">Remove</button>}
          </div>
        ))}
        <button type="button" onClick={handleAddPro} className="mb-2 px-2 py-1 bg-gray-200 rounded">Add another pro</button>
        <label className="block font-semibold mt-4">Cons</label>
        {cons.map((con, idx) => (
          <div key={idx} className="flex mb-2">
            <input type="text" value={con} onChange={e => handleConsChange(idx, e.target.value)} className="w-full p-2 border rounded" placeholder={`Con #${idx+1}`} />
            {cons.length > 1 && <button type="button" onClick={() => handleRemoveCon(idx)} className="ml-2 text-red-500">Remove</button>}
          </div>
        ))}
        <button type="button" onClick={handleAddCon} className="mb-2 px-2 py-1 bg-gray-200 rounded">Add another con</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
}

export default EditPost; 