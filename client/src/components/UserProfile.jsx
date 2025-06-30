import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const UserProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user profile
        const profileRes = await api.get(`/api/users/${id}`);
        setProfile(profileRes.data);
        
        // Fetch user's posts (reviews they've written)
        const postsRes = await api.get(`/api/users/${id}/posts`);
        setUserPosts(postsRes.data);
        
        // Fetch user's comments
        const commentsRes = await api.get(`/api/users/${id}/comments`);
        setUserComments(commentsRes.data);
      } catch (error) {
        setError(`Failed to load user profile: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 rounded-full p-4">
              <span className="text-2xl">
                {profile.email[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.email}</h1>
              <p className="text-gray-500">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* User's Reviews */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Reviews</h2>
          {userPosts.length === 0 ? (
            <p className="text-gray-500">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {userPosts.map(post => (
                <div key={post._id} className="border-b pb-4">
                  <Link 
                    to={`/reviews/${post._id}`}
                    className="text-lg font-medium text-blue-600 hover:text-blue-800"
                  >
                    {post.title}
                  </Link>
                  <p className="text-gray-600 mt-1">{post.content.substring(0, 150)}...</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{post.likes?.length || 0} likes</span>
                    <span className="mx-2">•</span>
                    <span>{post.comments?.length || 0} comments</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User's Comments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Comments</h2>
          {userComments.length === 0 ? (
            <p className="text-gray-500">No comments yet</p>
          ) : (
            <div className="space-y-4">
              {userComments.map(comment => (
                <div key={comment._id} className="border-b pb-4">
                  <p className="text-gray-600">{comment.text}</p>
                  <div className="flex items-center mt-2 text-sm">
                    <Link 
                      to={`/reviews/${comment.postId}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Review
                    </Link>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-gray-500">
                      {new Date(comment.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 