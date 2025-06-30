import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Reviews from './components/Reviews';
import ReviewDetail from './components/ReviewDetail';
import About from './components/About';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import Register from './components/Register';
import { HelmetProvider } from 'react-helmet-async';
import { PostProvider } from './context/PostContext';
import { AuthProvider } from './context/AuthContext';
import NewsletterConfirm from './components/NewsletterConfirm';
import Contact from './components/Contact';
import Layout from './components/Layout';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <PostProvider>
          
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/reviews/:id" element={<ReviewDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/user/:id" element={<UserProfile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/newsletter-confirm" element={<NewsletterConfirm />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
              </Routes>
            </Layout>
          </Router>
          
        </PostProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
