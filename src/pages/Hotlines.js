import React, { useState } from 'react';
import { Phone, Clock, MapPin, AlertCircle, Heart, Globe } from 'lucide-react';

const Hotlines = () => {
  const [selectedCountry, setSelectedCountry] = useState('All');

  const hotlines = [
    {
      id: 1,
      name: 'National Suicide Prevention Lifeline',
      country: 'USA',
      phone: '988',
      availability: '24/7',
      description: 'Free and confidential support for people in distress.'
    },
    {
      id: 2,
      name: 'Crisis Text Line',
      country: 'USA',
      phone: 'Text HOME to 741741',
      availability: '24/7',
      description: 'Free, 24/7 support via text message.'
    },
    {
      id: 3,
      name: 'Samaritans',
      country: 'UK',
      phone: '116 123',
      availability: '24/7',
      description: 'Confidential support for anyone in emotional distress.'
    },
    {
      id: 4,
      name: 'Lifeline',
      country: 'Australia',
      phone: '13 11 14',
      availability: '24/7',
      description: 'Crisis support and suicide prevention services.'
    },
    {
      id: 5,
      name: 'Kids Help Phone',
      country: 'Canada',
      phone: '1-800-668-6868',
      availability: '24/7',
      description: 'Support for young people in Canada.'
    },
    {
      id: 6,
      name: 'Befrienders Worldwide',
      country: 'International',
      phone: 'Visit website for local numbers',
      availability: 'Varies',
      description: 'Global network of emotional support centers.'
    },
    {
      id: 7,
      name: 'Numéro National de Prévention du Suicide',
      country: 'France',
      phone: '3114',
      availability: '24/7',
      description: 'Service national de prévention du suicide.'
    },
    {
      id: 8,
      name: 'Telefonseelsorge',
      country: 'Germany',
      phone: '0800 111 0 111',
      availability: '24/7',
      description: 'Anonymous counseling and crisis intervention.'
    }
  ];

  const countries = ['All', ...new Set(hotlines.map(h => h.country))];

  const filteredHotlines = selectedCountry === 'All' 
    ? hotlines 
    : hotlines.filter(h => h.country === selectedCountry);

  return (
    <div className="min-h-screen">
      {/* Decorative Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 right-10 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Emergency Alert Banner */}
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-xl" />
        <div className="relative bg-gradient-to-r from-red-50 to-orange-50 backdrop-blur-sm border-l-4 border-red-500 p-6 rounded-2xl shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <AlertCircle className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-red-800 font-bold text-xl mb-2 flex items-center gap-2">
                If you're in crisis
                <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
              </h3>
              <p className="text-red-700 leading-relaxed">
                If you or someone you know is in immediate danger, please call emergency services (911, 112, 999, etc.) or go to the nearest emergency room.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 to-primary/10 rounded-3xl blur-2xl" />
        <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500/20 to-primary/20 rounded-full flex items-center justify-center">
                <Phone className="w-7 h-7 text-red-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Crisis Hotlines
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Free, confidential support available 24/7. You are not alone.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Country Filter */}
      <div className="mb-12 flex flex-col items-center">
        <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Filter by Country
        </label>

        <div className="relative w-full md:w-80">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-5 py-3 bg-white/70 backdrop-blur-md border border-gray-300 rounded-2xl text-gray-700 text-base font-medium shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer hover:shadow-md"
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          {/* Dropdown Icon */}
          <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" />
        </div>
      </div>


      {/* Hotlines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {filteredHotlines.map((hotline, index) => (
          <div 
            key={hotline.id}
            className="group relative"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.5s ease-out forwards',
              opacity: 0
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
              {/* Header with badges */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500/20 to-primary/20 text-blue-800 border border-blue-200">
                  <MapPin className="w-4 h-4" />
                  {hotline.country}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 font-medium px-3 py-1.5 bg-gray-100 rounded-full">
                  <Clock className="w-4 h-4" />
                  {hotline.availability}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors">
                  {hotline.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {hotline.description}
                </p>
              </div>

              {/* Call Button */}
              <a 
                href={`tel:${hotline.phone}`}
                className="relative flex items-center justify-center gap-3 w-full bg-gradient-to-r from-primary to-primary/80 text-white py-4 rounded-2xl hover:shadow-xl transition-all duration-300 font-bold text-lg group/btn overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <Phone className="w-6 h-6 relative z-10 group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-transform" />
                <span className="relative z-10">{hotline.phone}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-primary/10 rounded-3xl blur-2xl" />
        <div className="relative bg-gradient-to-br from-blue-50 to-primary/5 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-primary rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Additional Resources</h3>
          </div>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start gap-3 group">
              <span className="text-primary font-bold mt-1">•</span>
              <div>
                <strong className="text-gray-800 group-hover:text-primary transition-colors">Befrienders Worldwide:</strong>{' '}
                <a 
                  href="https://befrienders.org" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:text-primary/80 hover:underline font-medium transition-all"
                >
                  befrienders.org
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3 group">
              <span className="text-primary font-bold mt-1">•</span>
              <div>
                <strong className="text-gray-800 group-hover:text-primary transition-colors">International Association for Suicide Prevention:</strong>{' '}
                <a 
                  href="https://iasp.info" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:text-primary/80 hover:underline font-medium transition-all"
                >
                  iasp.info
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3 group">
              <span className="text-primary font-bold mt-1">•</span>
              <div>
                <strong className="text-gray-800 group-hover:text-primary transition-colors">Finding help in your country:</strong>{' '}
                <a 
                  href="https://findahelpline.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:text-primary/80 hover:underline font-medium transition-all"
                >
                  findahelpline.com
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Hotlines;