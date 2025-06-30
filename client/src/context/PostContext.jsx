import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // List all posts
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('api/posts');
      setPosts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching posts');
    } finally {
      setLoading(false);
    }
  };

  // Get a single post by ID
  const getPost = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`api/posts/${id}`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching post');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add a new post
  const addPost = async (postData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('api/posts', postData);
      setPosts((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding post');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Edit a post
  const editPost = async (id, postData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put(`api/posts/${id}`, postData);
      setPosts((prev) => prev.map((post) => (post._id === id ? res.data : post)));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error editing post');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a post
  const deletePost = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`api/posts/${id}`);
      setPosts((prev) => prev.filter((post) => post._id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting post');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        error,
        fetchPosts,
        getPost,
        addPost,
        editPost,
        deletePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => useContext(PostContext);
