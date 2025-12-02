import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
}

const NoteSkeleton = () => (
  <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-md h-auto animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="h-6 bg-white/20 rounded w-3/4" />
      <div className="h-6 w-6 bg-white/20 rounded" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-white/20 rounded w-full" />
      <div className="h-4 bg-white/20 rounded w-2/3" />
    </div>
    <div className="flex justify-center space-x-2 mb-2">
      <div className="h-8 w-16 bg-white/20 rounded-lg" />
      <div className="h-8 w-16 bg-white/20 rounded-lg" />
    </div>
    <div className="flex gap-2">
      <div className="h-6 w-16 bg-white/20 rounded" />
      <div className="h-6 w-20 bg-white/20 rounded" />
    </div>
  </div>
);

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 6 }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="h-8 bg-white/20 rounded w-48 mb-4 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: count }).map((_, idx) => (
          <NoteSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
