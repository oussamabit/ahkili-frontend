import React from 'react';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const CommunityCard = ({ community }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      {/* Community Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{community.name}</h3>
          <p className="text-sm text-gray-500">{community.members || 0} members</p>
        </div>
      </div>

      {/* Community Description */}
      <p className="text-gray-600 mb-4 line-clamp-3">{community.description}</p>

      {/* View/Join Button */}
      <Link to={`/community/${community.id}`}>
        <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-green-600 transition font-semibold">
          View Community
        </button>
      </Link>
    </div>
  );
};

export default CommunityCard;