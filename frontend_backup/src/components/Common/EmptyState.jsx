import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  actionLink, 
  actionIcon: ActionIcon 
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-12 text-center">
      {Icon && <Icon className="w-20 h-20 text-gray-400 mx-auto mb-4" />}
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      {actionText && actionLink && (
        <Link 
          to={actionLink} 
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition transform hover:scale-105"
        >
          {ActionIcon && <ActionIcon className="w-5 h-5" />}
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
