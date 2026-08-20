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
    <div className="border border-dashed border-slate-200 rounded p-12 text-center">
      {Icon && <Icon className="w-16 h-16 text-slate-400 mx-auto mb-4" strokeWidth={1.25} />}
      <h3 className="font-display text-2xl font-normal text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6 max-w-md mx-auto">{description}</p>
      {actionText && actionLink && (
        <Link 
          to={actionLink} 
          className="inline-flex items-center gap-2 btn-primary"
        >
          {ActionIcon && <ActionIcon className="w-5 h-5" />}
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
