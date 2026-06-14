import React from 'react';

export const SkeletonCard = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`}>
    <div className="h-full w-full"></div>
  </div>
);

export const SkeletonStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white rounded-xl p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonJobCard = () => (
  <div className="bg-white rounded-xl p-6 border border-gray-200">
    <div className="flex justify-between items-start">
      <div className="flex-1 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
        <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="w-28 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
  </div>
);

export const SkeletonApplicationCard = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-5">
    <div className="space-y-3">
      <div className="flex justify-between">
        <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-2 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

export default SkeletonCard;
