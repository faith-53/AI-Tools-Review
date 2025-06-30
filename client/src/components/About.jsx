import React from 'react';

const About = () => {
  return (
    <div className=" bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              About ToolWiseAI
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Your trusted source for comprehensive, unbiased reviews of the latest artificial intelligence tools and technologies.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                In the rapidly evolving world of artificial intelligence, it can be overwhelming to choose the right tools for your needs. 
                Our mission is to provide detailed, honest, and comprehensive reviews of AI tools to help you make informed decisions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Unbiased Reviews</h3>
                <p className="text-gray-600">
                  We provide honest, objective reviews based on thorough testing and real-world usage.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Up-to-Date Information</h3>
                <p className="text-gray-600">
                  We regularly update our reviews to reflect the latest features and changes in AI tools.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Community Driven</h3>
                <p className="text-gray-600">
                  We value feedback from our community and incorporate user experiences into our reviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Our Team
              </h2>
              <p className="text-lg text-gray-600">
                We're a team of AI enthusiasts, developers, and technology experts passionate about helping others navigate the AI landscape.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">J</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">John</h3>
                <p className="text-blue-600 mb-2">Lead AI Researcher</p>
                <p className="text-gray-600 text-sm">
                  Expert in machine learning and AI technologies with 8+ years of experience in the field.
                </p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">A</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Alice</h3>
                <p className="text-blue-600 mb-2">Product Analyst</p>
                <p className="text-gray-600 text-sm">
                  Specializes in evaluating user experience and product usability across various AI platforms.
                </p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">F</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Faith</h3>
                <p className="text-blue-600 mb-2">Technical Writer</p>
                <p className="text-gray-600 text-sm">
                  Creates comprehensive, easy-to-understand reviews that help users make informed decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Our Values
              </h2>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Transparency</h3>
                <p className="text-gray-600 leading-relaxed">
                  We believe in complete transparency in our review process. We clearly disclose our testing methodology, 
                  criteria, and any potential conflicts of interest. Our readers deserve to know exactly how we evaluate 
                  each AI tool and what factors influence our recommendations.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Accuracy</h3>
                <p className="text-gray-600 leading-relaxed">
                  We strive for accuracy in all our reviews. Our team thoroughly tests each AI tool, verifies claims, 
                  and cross-references information from multiple sources. We regularly update our content to ensure 
                  it reflects the current state of each tool.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">User-Focused</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our reviews are written with the user in mind. We focus on practical applications, real-world use cases, 
                  and actionable insights that help readers understand whether a tool is right for their specific needs. 
                  We consider factors like ease of use, learning curve, and value for money.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Have Questions or Suggestions?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have feedback on our reviews, 
            suggestions for new tools to review, or just want to say hello.
          </p>
          <a
            href="/contact"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
};

export default About; 