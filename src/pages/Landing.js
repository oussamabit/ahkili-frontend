import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, MessageCircle, Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-gray-800">Ahkili</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition"
            >
              Login
            </Link>
            <Link 
              to="/login" 
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Mental Health Support,
          <span className="text-primary"> Right Here</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Connect with supportive communities, access verified mental health professionals, 
          and find crisis support all in one safe space.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
          <Link 
            to="/login"
            className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-green-600 transition font-semibold flex items-center space-x-2 text-lg"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a 
            href="#features"
            className="px-8 py-4 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition font-semibold"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
          Why Choose Ahkili?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition">
            <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Supportive Communities
            </h3>
            <p className="text-gray-600">
              Join communities focused on anxiety, depression, stress management, and more. 
              Share your experiences and support others.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition">
            <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Verified Professionals
            </h3>
            <p className="text-gray-600">
              Get advice from verified mental health professionals including psychiatrists, 
              psychologists, and therapists.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition">
            <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Crisis Support
            </h3>
            <p className="text-gray-600">
              Quick access to emergency hotlines and crisis resources when you need them most. 
              Help is always available.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition">
            <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mb-6">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Open Conversations
            </h3>
            <p className="text-gray-600">
              Express yourself freely in a judgment-free environment. Comment, reply, 
              and connect with others authentically.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition">
            <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Always Available
            </h3>
            <p className="text-gray-600">
              Available on all devices, 24/7. Your mental health support 
              is always just a click away.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition">
            <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Private & Safe
            </h3>
            <p className="text-gray-600">
              Your privacy is our priority. All conversations are secure 
              and moderated to keep the community safe.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 bg-gray-50 rounded-lg my-20">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Create Account</h3>
            <p className="text-gray-600">Sign up with your email and create your profile</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Join Communities</h3>
            <p className="text-gray-600">Find communities that match your interests</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Share & Connect</h3>
            <p className="text-gray-600">Post, comment, and connect with others</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              4
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Get Support</h3>
            <p className="text-gray-600">Receive guidance from verified professionals</p>
          </div>
        </div>
      </section>

      {/* Community Stats Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-primary mb-2">10K+</p>
            <p className="text-xl text-gray-600">Active Members</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-2">50+</p>
            <p className="text-xl text-gray-600">Support Communities</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-2">24/7</p>
            <p className="text-xl text-gray-600">Crisis Support Available</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
          What People Are Saying
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              "Ahkili has been a game-changer for me. The supportive community and access 
              to professionals have helped me navigate my anxiety in ways I never thought possible."
            </p>
            <p className="font-semibold text-gray-800">Sarah M.</p>
            <p className="text-sm text-gray-500">Member since 2024</p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              "The sense of community here is incredible. Knowing I'm not alone in my struggles 
              has made all the difference in my mental health journey."
            </p>
            <p className="font-semibold text-gray-800">James D.</p>
            <p className="text-sm text-gray-500">Member since 2024</p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              "As a verified therapist, I love how Ahkili brings together professional 
              support with peer support. It's creating real impact."
            </p>
            <p className="font-semibold text-gray-800">Dr. Maria K.</p>
            <p className="text-sm text-gray-500">Verified Professional</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-green-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Mental Health Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of people who are finding support, community, and hope on Ahkili.
          </p>
          <Link 
            to="/login"
            className="inline-block px-8 py-4 bg-white text-primary rounded-lg hover:bg-gray-100 transition font-semibold text-lg"
          >
            Join Ahkili Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold text-white">Ahkili</span>
              </div>
              <p>Mental health support for everyone.</p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/communities" className="hover:text-white">Communities</Link></li>
                <li><Link to="/hotlines" className="hover:text-white">Crisis Support</Link></li>
                <li><Link to="/doctor-verification" className="hover:text-white">For Professionals</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Report Issue</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Community Guidelines</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p>&copy; 2024 Ahkili. All rights reserved. Taking care of mental health together.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;