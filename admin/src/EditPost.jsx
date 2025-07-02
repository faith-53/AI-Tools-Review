import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const SECTION_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'heading', label: 'Heading' },
  { value: 'list', label: 'List' },
  { value: 'checklist', label: 'Checklist' },
  { value: 'tool', label: 'Tool Review Block' },
  { value: 'image', label: 'Image' },
];

function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [sections, setSections] = useState([]);
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
      setSections(data.sections || []);
      setLoading(false);
    };
    fetchPost();
  }, [id, token]);

  const handleSectionChange = (idx, field, value) => {
    const newSections = [...sections];
    newSections[idx][field] = value;
    setSections(newSections);
  };

  const handleSectionTypeChange = (idx, type) => {
    const newSections = [...sections];
    newSections[idx] = { type };
    setSections(newSections);
  };

  const handleAddSection = () => setSections([...sections, { type: 'text', content: '' }]);
  const handleRemoveSection = (idx) => setSections(sections.filter((_, i) => i !== idx));

  // For list/checklist
  const handleSectionItemsChange = (idx, items) => {
    const newSections = [...sections];
    newSections[idx].items = items;
    setSections(newSections);
  };

  // For tool
  const handleToolFieldChange = (idx, field, value) => {
    const newSections = [...sections];
    if (!newSections[idx].tool) newSections[idx].tool = {};
    newSections[idx].tool[field] = value;
    setSections(newSections);
  };

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
      formData.append('sections', JSON.stringify(sections));
      await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
    } else {
      // If no new image, send JSON
      await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          summary,
          tags,
          sections
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
          <label className="block font-semibold mb-2">Sections</label>
          {sections.map((section, idx) => (
            <div key={idx} className="border rounded p-3 mb-4 bg-gray-50">
              <div className="flex items-center mb-2">
                <select value={section.type} onChange={e => handleSectionTypeChange(idx, e.target.value)} className="mr-2 p-1 border rounded">
                  {SECTION_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <button type="button" onClick={() => handleRemoveSection(idx)} className="ml-auto text-red-500">Remove</button>
              </div>
              {/* Section fields by type */}
              {section.type === 'text' && (
                <textarea placeholder="Text content" value={section.content || ''} onChange={e => handleSectionChange(idx, 'content', e.target.value)} className="w-full p-2 border rounded" />
              )}
              {section.type === 'heading' && (
                <input type="text" placeholder="Heading" value={section.content || ''} onChange={e => handleSectionChange(idx, 'content', e.target.value)} className="w-full p-2 border rounded" />
              )}
              {(section.type === 'list' || section.type === 'checklist') && (
                <textarea placeholder="One item per line" value={(section.items || []).join('\n')} onChange={e => handleSectionItemsChange(idx, e.target.value.split('\n'))} className="w-full p-2 border rounded" />
              )}
              {section.type === 'tool' && (
                <div className="space-y-2">
                  <input type="text" placeholder="Tool Name" value={section.tool?.name || ''} onChange={e => handleToolFieldChange(idx, 'name', e.target.value)} className="w-full p-2 border rounded" />
                  <input type="text" placeholder="Best For" value={section.tool?.bestFor || ''} onChange={e => handleToolFieldChange(idx, 'bestFor', e.target.value)} className="w-full p-2 border rounded" />
                  <textarea placeholder="Pros (one per line)" value={(section.tool?.pros || []).join('\n')} onChange={e => handleToolFieldChange(idx, 'pros', e.target.value.split('\n'))} className="w-full p-2 border rounded" />
                  <textarea placeholder="Cons (one per line)" value={(section.tool?.cons || []).join('\n')} onChange={e => handleToolFieldChange(idx, 'cons', e.target.value.split('\n'))} className="w-full p-2 border rounded" />
                </div>
              )}
              {section.type === 'image' && (
                <input type="text" placeholder="Image URL or description" value={section.content || ''} onChange={e => handleSectionChange(idx, 'content', e.target.value)} className="w-full p-2 border rounded" />
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddSection} className="px-2 py-1 bg-gray-200 rounded">Add Section</button>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
}

export default EditPost; 