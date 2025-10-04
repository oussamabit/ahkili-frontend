import React, { useState } from 'react';
import { Phone, Clock, MapPin, AlertCircle } from 'lucide-react';

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
    <div>
      {/* Emergency Alert */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
        <div className="flex items-start">
          <AlertCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-red-800 font-semibold mb-1">If you're in crisis</h3>
            <p className="text-red-700 text-sm">
              If you or someone you know is in immediate danger, please call emergency services (911, 112, 999, etc.) or go to the nearest emergency room.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Crisis Hotlines</h1>
        <p className="text-gray-600">
          Free, confidential support available 24/7. You are not alone.
        </p>
      </div>

      {/* Country Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Filter by Country
        </label>
        <select 
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      {/* Hotlines List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHotlines.map(hotline => (
          <div key={hotline.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            {/* Country Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                <MapPin className="w-3 h-3 mr-1" />
                {hotline.country}
              </span>
              <span className="inline-flex items-center text-xs text-gray-600">
                <Clock className="w-3 h-3 mr-1" />
                {hotline.availability}
              </span>
            </div>

            {/* Hotline Info */}
            <h3 className="text-lg font-bold text-gray-800 mb-2">{hotline.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{hotline.description}</p>

            {/* Phone Number */}
            <a 
              href={`tel:${hotline.phone}`}
              className="flex items-center justify-center space-x-2 w-full bg-primary text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold"
            >
              <Phone className="w-5 h-5" />
              <span>{hotline.phone}</span>
            </a>
          </div>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Additional Resources</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• <strong>Befrienders Worldwide:</strong> <a href="https://befrienders.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">befrienders.org</a></li>
          <li>• <strong>International Association for Suicide Prevention:</strong> <a href="https://iasp.info" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">iasp.info</a></li>
          <li>• <strong>Finding help in your country:</strong> <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">findahelpline.com</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Hotlines;