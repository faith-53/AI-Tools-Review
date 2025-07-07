import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getComments as fetchCommentsApi, addComment as addCommentApi, editComment as editCommentApi, deleteComment as deleteCommentApi } from '../services/api';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import ReactMarkdown from 'react-markdown';

function cleanListParagraphs(html) {
  return html.replace(/<li><p>(.*?)<\/p><\/li>/g, '<li>$1</li>');
}

const ReviewDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
  const { user } = useAuth();
  const { getPost} = usePosts();
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPost(id);
        if (!data) throw new Error('Post not found');
        setPost(data);
        setNotFound(false);
      } catch (err) {
        setError(err.message);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetch();
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
        <meta name="description" content={post ? (post.summary || 'AI tool review') : 'AI tool review'} />
        <meta property="og:title" content={post ? post.title : 'AI Tool Review'} />
        <meta property="og:description" content={post ? (post.summary || 'AI tool review') : 'AI tool review'} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={post && post.image ? post.image : 'https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=AI+Tool'} />
      </Helmet>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-12 mb-8">
        <div className="container  px-4">
          <div className="max-w-3xl mx-auto ">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">{post.title}</h1>
            {post.summary && (
              <p className="text-xl text-blue-100 mb-0 prose prose-invert  w-full max-w-none">{post.summary}</p>
            )}
          </div>
        </div>
      </div>
      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <article className="prose w-full max-w-none">
          <div dangerouslySetInnerHTML={{ __html: cleanListParagraphs(post.content) }} />
        </article>
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
  );
};

export default ReviewDetail; 