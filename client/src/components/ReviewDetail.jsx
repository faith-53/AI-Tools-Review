import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePosts } from '../context/PostContext';
import { getComments as fetchCommentsApi, addComment as addCommentApi, editComment as editCommentApi, deleteComment as deleteCommentApi, likePost as likePostApi, unlikePost as unlikePostApi } from '../services/api';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';

const ReviewDetail = () => {
  const { id } = useParams();
  const { getPost, posts, loading, error } = usePosts();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
  const { user } = useAuth();
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const data = await getPost(id);
      if (data) {
        setPost(data);
        setNotFound(false);
        setLikeCount(data.likes ? data.likes.length : 0);
        if (user && data.likes) {
          setLiked(data.likes.includes(user._id || user.id));
        } else {
          setLiked(false);
        }
      } else {
        setNotFound(true);
      }
    };
    fetch();
    // eslint-disable-next-line
  }, [id, user]);

  // Fetch comments from backend
  useEffect(() => {
    const fetchComments = async () => {
      setCommentsLoading(true);
      setCommentsError(null);
      try {
        const res = await fetchCommentsApi(id);
        setComments(res.data);
      } catch (error) {
        setCommentsError(`Failed to load comments: ${error.message}`);
      } finally {
        setCommentsLoading(false);
      }
    };
    if (id) fetchComments();
  }, [id]);

  // Find related reviews by tags (excluding current post)
  let relatedReviews = [];
  if (post && post.tags && post.tags.length > 0) {
    relatedReviews = posts.filter(
      p => p._id !== post._id && p.tags && p.tags.some(tag => post.tags.includes(tag))
    ).slice(0, 3);
  }

  // Add comment to backend
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (commentInput.trim()) {
      try {
        setCommentsLoading(true);
        setCommentsError(null);
        await addCommentApi(id, { text: commentInput });
        // Refresh comments
        const res = await fetchCommentsApi(id);
        setComments(res.data);
        setCommentInput('');
      } catch (error) {
        setCommentsError(`Failed to add comment: ${error.message}`);
      } finally {
        setCommentsLoading(false);
      }
    }
  };

  // Add handlers for edit/delete (stubs)
  const handleEditComment = (commentId, oldText) => {
    setEditingCommentId(commentId);
    setEditingCommentText(oldText);
  };
  const handleEditCommentSave = async (commentId) => {
    try {
      setCommentsLoading(true);
      await editCommentApi(id, commentId, editingCommentText);
      const res = await fetchCommentsApi(id);
      setComments(res.data);
      setEditingCommentId(null);
      setEditingCommentText('');
    } catch (error) {
      setCommentsError(`Failed to edit comment: ${error.message}`);
    } finally {
      setCommentsLoading(false);
    }
  };
  const handleEditCommentCancel = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
  };
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      setCommentsLoading(true);
      await deleteCommentApi(id, commentId);
      const res = await fetchCommentsApi(id);
      setComments(res.data);
    } catch (error) {
      setCommentsError(`Failed to delete comment: ${error.message}`);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!user) {
      alert('You must be logged in to like this review.');
      return;
    }
    setLikeLoading(true);
    try {
      if (liked) {
        const res = await unlikePostApi(id);
        setLikeCount(res.data.likes);
        setLiked(false);
      } else {
        const res = await likePostApi(id);
        setLikeCount(res.data.likes);
        setLiked(true);
      }
    } catch {
      alert('Failed to update like.');
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading review...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }
  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Review Not Found</h1>
          <p className="text-gray-600 mb-6">The review you're looking for doesn't exist.</p>
          <Link
            to="/reviews"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Back to Reviews
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{post ? `${post.title} - ToolWiseAI` : 'Review - ToolWiseAI'}</title>
        <meta name="description" content={post ? (post.excerpt || post.content?.slice(0, 150) || 'AI tool review') : 'AI tool review'} />
        <meta property="og:title" content={post ? post.title : 'AI Tool Review'} />
        <meta property="og:description" content={post ? (post.excerpt || post.content?.slice(0, 150) || 'AI tool review') : 'AI tool review'} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={post && post.image ? post.image : 'https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=AI+Tool'} />
      </Helmet>
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link
                to="/reviews"
                className="text-blue-600 hover:text-blue-800 transition duration-300"
              >
                ← Back to Reviews
              </Link>
            </div>
            <div className="mb-6">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {post.category || (post.tags && post.tags.join(', ')) || 'AI'}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {post.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {post.excerpt || (post.content && post.content.slice(0, 150) + '...')}
            </p>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {post.author && <span>By {post.author}</span>}
                {post.date && <><span>•</span><span>{new Date(post.date).toLocaleDateString()}</span></>}
                {post.readTime && <><span>•</span><span>{post.readTime}</span></>}
              </div>
              <div className="flex items-center">
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={handleLikeToggle}
                    disabled={likeLoading}
                    className={`flex items-center px-3 py-1 rounded-full border transition ${liked ? 'bg-blue-100 text-blue-600 border-blue-400' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                    title={liked ? 'Unlike' : 'Like'}
                  >
                    <span className="mr-2">👍</span>
                    <span>{likeCount}</span>
                    <span className="ml-1 text-xs">{liked ? 'Liked' : 'Like'}</span>
                  </button>
                </div>
                <span className="text-yellow-400 text-xl">★</span>
                <span className="ml-2 text-lg font-semibold text-gray-800">{post.rating || ''}</span>
              </div>
            </div>
            <img 
              src={post.image ? `http://localhost:5000/uploads/${post.image}` : 'https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=AI+Tool'} 
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
            {/* Pros and Cons */}
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div>
                <h3 className="text-2xl font-bold text-green-600 mb-4">Pros</h3>
                <ul className="space-y-2">
                  {(post.pros || []).map((pro, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-600 mb-4">Cons</h3>
                <ul className="space-y-2">
                  {(post.cons || []).map((con, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Pricing */}
            {post.pricing && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-blue-600 mb-4">Pricing</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {typeof post.pricing === 'object' ? (
                    Object.entries(post.pricing).map(([tier, price]) => (
                      <li key={tier}><strong>{tier}:</strong> {price}</li>
                    ))
                  ) : (
                    <li>{post.pricing}</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Related Reviews */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Reviews</h2>
            {relatedReviews.length === 0 ? (
              <div className="text-gray-500 text-center">No related reviews found.</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedReviews.map(rp => (
                  <div key={rp._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
                    <img
                      src={rp.image ? `http://localhost:5000/uploads/${rp.image}` : 'https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=AI+Tool'}
                      alt={rp.title}
                      className="w-full h-40 object-cover"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {rp.category || (rp.tags && rp.tags.join(', ')) || 'AI'}
                      </span>
                      <h3 className="text-lg font-semibold mt-2 mb-2 text-gray-800">
                        {rp.title}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {rp.excerpt || rp.content?.slice(0, 80) + '...'}
                      </p>
                      <Link
                        to={`/reviews/${rp._id}`}
                        className="text-blue-600 font-medium hover:text-blue-800 transition duration-300"
                      >
                        Read Full Review →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Comments</h2>
            <form onSubmit={handleAddComment} className="mb-6">
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Add a comment..."
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                disabled={commentsLoading}
              />
              <button
                type="submit"
                className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                disabled={commentsLoading}
              >
                {commentsLoading ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
            {commentsError && <div className="text-red-500 mb-2">{commentsError}</div>}
            {commentsLoading && comments.length === 0 ? (
              <div className="text-gray-500">Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="text-gray-500">No comments yet. Be the first to comment!</div>
            ) : (
              <ul className="space-y-4">
                {comments.map((c, idx) => {
                  const isAuthor = user && (user._id === c.author || user.id === c.author);
                  const isAdmin = user && (user.role === 'admin');
                  return (
                    <li key={idx} className="bg-gray-100 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-1">
                        {editingCommentId === (c._id || c.id) ? (
                          <>
                            <input
                              className="border rounded px-2 py-1 text-sm w-2/3"
                              value={editingCommentText}
                              onChange={e => setEditingCommentText(e.target.value)}
                              disabled={commentsLoading}
                            />
                            <span className="flex gap-2 ml-2">
                              <button
                                className="text-green-600 hover:underline text-xs"
                                onClick={() => handleEditCommentSave(c._id || c.id)}
                                disabled={commentsLoading}
                              >Save</button>
                              <button
                                className="text-gray-600 hover:underline text-xs"
                                onClick={handleEditCommentCancel}
                                disabled={commentsLoading}
                              >Cancel</button>
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-col">
                              <span className="text-gray-800">{c.text}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">By</span>
                                <Link to={`/user/${c.author}`} className="text-xs text-blue-600 hover:underline">
                                  {c.authorEmail || 'Anonymous'}
                                </Link>
                                <span className="text-xs text-gray-500">{new Date(c.date).toLocaleString()}</span>
                              </div>
                            </div>
                            {(isAuthor || isAdmin) && (
                              <span className="flex gap-2">
                                <button
                                  className="text-blue-600 hover:underline text-xs"
                                  onClick={() => handleEditComment(c._id || c.id, c.text)}
                                  disabled={commentsLoading}
                                >Edit</button>
                                <button
                                  className="text-red-600 hover:underline text-xs"
                                  onClick={() => handleDeleteComment(c._id || c.id)}
                                  disabled={commentsLoading}
                                >Delete</button>
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail; 