import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../context/PostContext';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const { posts = [], loading, error } = usePosts() || {};
  const [selectedTag, setSelectedTag] = useState('All');

  // Collect all unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])));
  const tagOptions = ['All', ...allTags];

  // Filter posts by selected tag only
  let featuredPosts = posts;
  if (selectedTag !== 'All') {
    featuredPosts = featuredPosts.filter(post =>
      post.tags && post.tags.includes(selectedTag)
    );
  }
  // Show up to 3 featured posts
  featuredPosts = featuredPosts.slice(0, 3);

  return (
    <div className=" min-h-screen bg-gray-50 mx-auto">
      <Helmet>
        <title>ToolWiseAI - Discover the Best AI Tools</title>
        <meta name="description" content="Comprehensive reviews and insights on the latest artificial intelligence tools to help you choose the right solution for your needs." />
        <meta property="og:title" content="ToolWiseAI - Discover the Best AI Tools" />
        <meta property="og:description" content="Comprehensive reviews and insights on the latest artificial intelligence tools to help you choose the right solution for your needs." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=AI+Tools" />
      </Helmet>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Discover the Best AI Tools
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Comprehensive reviews and insights on the latest artificial intelligence tools 
              to help you choose the right solution for your needs.
            </p>
            <Link
              to="/reviews"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              Browse All Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Featured Reviews
          </h2>
          {/* Tag Filter Only (search removed) */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center">
            {/* Search input removed */}
            <div className="flex flex-wrap gap-2 justify-center">
              {tagOptions.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${
                    selectedTag === tag
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          {loading && (
            <div className="text-center text-gray-500">Loading featured posts...</div>
          )}
          {error && (
            <div className="text-center text-red-500">{error}</div>
          )}
          {!loading && !error && featuredPosts.length === 0 && (
            <div className="text-center text-gray-500">No featured posts available.</div>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <div key={post._id || post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {post.category || (post.tags && post.tags.join(', ')) || 'AI'}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-sm text-gray-600">{post.rating || ''}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {post.summary && post.summary.length > 100
                      ? post.summary.slice(0, 100) + '...'
                      : post.summary}
                  </p>
                  <Link
                    to={`/reviews/${post._id || post.id}`}
                    className="text-blue-600 font-medium hover:text-blue-800 transition duration-300"
                  >
                    Read Full Review →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">ToolWiseAI Reviewed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Happy Readers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Expert Analysis</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 