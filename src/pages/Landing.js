import React from 'react';
import { Heart, Users, MessageCircle, Shield, Zap, ArrowRight, CheckCircle, Sparkles, Brain, Clock, Phone, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/logo/ahkili-01.png" alt="Ahkili" className="h-12 w-auto" />
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-5 py-2 text-[#ff7f50] border-2 border-[#ff7f50] rounded-full hover:bg-orange-50 transition font-medium"
            >
              Login
            </Link>

            <Link
              to="/login"
              className="px-5 py-2 bg-[#ff7f50] text-white rounded-full hover:shadow-lg hover:scale-105 transition font-medium"
            >
              Get Started
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Mental Health Support,
              <span className="text-[#ff7f50]"> Right Here</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect with supportive communities, access verified mental health professionals, 
              and find crisis support all in one safe space.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <button className="px-8 py-4 bg-[#ff7f50] text-white rounded-full hover:shadow-xl hover:scale-105 transition font-semibold flex items-center space-x-2 text-lg">
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full hover:border-[#10b981] hover:text-[#10b981] transition font-semibold">
                Learn More
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-[#10b981] flex-shrink-0" />
                <span className="text-gray-700">Free to join and easy to use</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-[#10b981] flex-shrink-0" />
                <span className="text-gray-700">24/7 crisis support available</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-[#10b981] flex-shrink-0" />
                <span className="text-gray-700">Verified mental health professionals</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="absolute -top-6 -right-6 w-28 h-28 bg-[#ff7f50]/20 rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-[#10b981]/20 rounded-full opacity-70 animate-pulse" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute top-1/2 -right-8 w-16 h-16 bg-[#ff7f50]/15 rounded-full opacity-60 animate-pulse" style={{animationDelay: '0.8s'}}></div>
            <div className="relative bg-gradient-to-br from-orange-50 to-emerald-50 rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border border-gray-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <img src="/photos/doctor consultation.webp" alt="Mental Health Support" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Ahkili Section */}
      <section className="bg-gray-50 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Image Left */}
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#ff7f50]/20 rounded-full opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-[#10b981]/20 rounded-full opacity-70 animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/3 -left-4 w-12 h-12 bg-[#ff7f50]/15 rounded-full opacity-60 animate-pulse" style={{animationDelay: '2s'}}></div>
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] border border-gray-100">
                <img src="/photos/shear experiances.jpg" alt="Community Support" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Content Right */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose Ahkili?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#ff7f50]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-[#ff7f50]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-1">Supportive Communities</h4>
                    <p className="text-gray-600">Join communities focused on anxiety, depression, stress management, and more. Share your experiences in a safe space.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#ff7f50]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-[#ff7f50]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-1">Peer-to-Peer Support</h4>
                    <p className="text-gray-600">Connect with people who truly understand what you're going through and build meaningful relationships.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#ff7f50]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-[#ff7f50]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-1">Open Conversations</h4>
                    <p className="text-gray-600">Express yourself freely in a judgment-free environment where everyone supports each other.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Left, Image Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Verified Professional Support
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#10b981]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-[#10b981]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-1">Licensed Professionals</h4>
                    <p className="text-gray-600">Get advice from verified psychiatrists, psychologists, and therapists who are credentialed and experienced.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#10b981]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-[#10b981]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-1">Expert Guidance</h4>
                    <p className="text-gray-600">Access professional mental health guidance and resources whenever you need them most.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#10b981]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-[#10b981]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-1">Compassionate Care</h4>
                    <p className="text-gray-600">Professionals who truly care about your wellbeing and are committed to helping you thrive.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Right */}
            <div className="relative order-1 lg:order-2">
              <div className="absolute -top-6 -right-6 w-28 h-28 bg-[#10b981]/20 rounded-full opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-[#ff7f50]/20 rounded-full opacity-70 animate-pulse" style={{animationDelay: '1.2s'}}></div>
              <div className="absolute bottom-1/3 -right-4 w-14 h-14 bg-[#10b981]/15 rounded-full opacity-60 animate-pulse" style={{animationDelay: '2.5s'}}></div>
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] border border-gray-100">
                <img src="/photos/privecy.jpg" alt="Professional Support" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for your mental health journey in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Service 1 - Community Support */}
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border border-gray-100 hover:scale-105 transform duration-300 group">
          <div className="w-24 h-24 flex items-center justify-center mx-auto mb-6 overflow-hidden rounded-full">
            <img
              src="/photos/Community Support.webp"
              alt="Community"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Community Support
          </h3>
          <p className="text-gray-600 leading-relaxed text-center">
            Join supportive communities and connect with others who understand your journey. Share, learn, and grow together.
          </p>
        </div>

        {/* Service 2 - Professional Help */}
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border border-gray-100 hover:scale-105 transform duration-300 group">
          <div className="w-24 h-24 flex items-center justify-center mx-auto mb-6 overflow-hidden rounded-full">
            <img
              src="/photos/Professional Help.jpeg"
              alt="Professional"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Professional Help
          </h3>
          <p className="text-gray-600 leading-relaxed text-center">
            Access verified mental health professionals including psychiatrists, psychologists, and licensed therapists.
          </p>
        </div>

        {/* Service 3 - Crisis Support */}
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border border-gray-100 hover:scale-105 transform duration-300 group">
          <div className="w-24 h-24 flex items-center justify-center mx-auto mb-6 overflow-hidden rounded-full">
            <img
              src="/photos/Crisis Support.avif"
              alt="Crisis"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Crisis Support
          </h3>
          <p className="text-gray-600 leading-relaxed text-center">
            Immediate access to emergency hotlines and crisis resources available 24/7 when you need help most.
          </p>
        </div>
      </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-[#ff7f50] to-[#10b981] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <p className="text-5xl font-bold mb-2">10K+</p>
              <p className="text-xl opacity-90">Active Members</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">50+</p>
              <p className="text-xl opacity-90">Support Communities</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">24/7</p>
              <p className="text-xl opacity-90">Crisis Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What People Are Saying
            </h2>
            <p className="text-xl text-gray-600">Real stories from our community members</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition hover:scale-105 transform duration-300 border border-gray-100">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "Ahkili has been a game-changer for me. The supportive community and access 
                to professionals have helped me navigate my anxiety."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#ff7f50] rounded-full flex items-center justify-center text-white font-bold">
                  SM
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Sarah M.</p>
                  <p className="text-sm text-gray-500">Member since 2024</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition hover:scale-105 transform duration-300 border border-gray-100">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "The sense of community here is incredible. Knowing I'm not alone has made 
                all the difference in my mental health journey."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#10b981] rounded-full flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div>
                  <p className="font-semibold text-gray-800">James D.</p>
                  <p className="text-sm text-gray-500">Member since 2024</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition hover:scale-105 transform duration-300 border border-gray-100">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "As a verified therapist, I love how Ahkili brings together professional 
                support with peer support. It's creating real impact."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#ff7f50] rounded-full flex items-center justify-center text-white font-bold">
                  MK
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Dr. Maria K.</p>
                  <p className="text-sm text-gray-500">Verified Professional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crisis Support Section with Hotline Image */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#ff7f50]/20 rounded-full opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-[#10b981]/20 rounded-full opacity-70 animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/4 -left-4 w-16 h-16 bg-[#ff7f50]/15 rounded-full opacity-60 animate-pulse" style={{animationDelay: '2.2s'}}></div>
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <img src="/photos/hotline.webp" alt="Crisis Support" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Crisis Support When You Need It Most
              </h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Our 24/7 crisis support line connects you immediately with trained professionals who can help during difficult moments.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#ff7f50]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#ff7f50]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-1">Immediate Response</h4>
                    <p className="text-gray-600">Get connected to a crisis counselor within minutes, any time of day or night.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#10b981]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-[#10b981]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-1">Confidential & Safe</h4>
                    <p className="text-gray-600">All conversations are completely confidential and handled with care.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#ff7f50]/10 to-[#10b981]/10">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-5xl font-bold mb-6 text-gray-900">
            Ready to Start Your Mental Health Journey?
          </h2>
          <p className="text-xl mb-8 text-gray-600">
            Join thousands of people who are finding support, community, and hope on Ahkili.
          </p>
          <button className="px-10 py-5 bg-gradient-to-r from-[#ff7f50] to-[#10b981] text-white rounded-full hover:shadow-xl hover:scale-105 transition font-bold text-lg">
            Join Ahkili Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo/ahkili-02.png" alt="Ahkili" className="h-10 w-auto" />
              </div>
              <p>Mental health support for everyone.</p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#ff7f50] transition">Communities</a></li>
                <li><a href="#" className="hover:text-[#ff7f50] transition">Crisis Support</a></li>
                <li><a href="#" className="hover:text-[#ff7f50] transition">For Professionals</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#10b981] transition">Help Center</a></li>
                <li><a href="#" className="hover:text-[#10b981] transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-[#10b981] transition">Report Issue</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#ff7f50] transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#ff7f50] transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#10b981] transition">Community Guidelines</a></li>
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