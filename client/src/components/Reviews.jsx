import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../context/PostContext';

const Reviews = () => {
  const { posts, loading, error } = usePosts();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique categories from posts
  const categories = ['All', ...Array.from(new Set(posts.flatMap(post => post.tags || [])))];

  const filteredReviews = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || (post.tags && post.tags.includes(selectedCategory));
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.summary && post.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            AI Tool Reviews
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive reviews of the latest AI tools to help you make informed decisions
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredReviews.length} of {posts.length} reviews
          </div>
        </div>

        {loading && <div className="text-center text-gray-500">Loading reviews...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReviews.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {post.tags && post.tags.join(', ')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {post.summary && post.summary.length > 100
                    ? post.summary.slice(0, 100) + '...'
                    : post.summary || (post.content && post.content.replace(/<[^>]+>/g, '').slice(0, 100) + '...')}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{post.date ? new Date(post.date).toLocaleDateString() : ''}</span>
                </div>
                <Link
                  to={`/reviews/${post._id}`}
                  className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
                >
                  Read Full Review
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No reviews found matching your criteria.
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews; 