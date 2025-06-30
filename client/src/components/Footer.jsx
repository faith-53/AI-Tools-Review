import React from 'react';
import NewsletterSignup from './NewsletterSignup';

const Footer = () => (
  <footer className="bg-gray-100 border-t mt-12 py-8">
    <div className="container mx-auto px-4 text-center">
      <h3 className="text-lg font-semibold mb-2">Subscribe to our Newsletter</h3>
      <p className="text-gray-600 mb-2">Get the latest AI tool reviews and updates straight to your inbox.</p>
      <NewsletterSignup />
      <div className="mt-6 text-xs text-gray-500">&copy; {new Date().getFullYear()} ToolWiseAI. All rights reserved.</div>
    </div>
  </footer>
);

export default Footer; 