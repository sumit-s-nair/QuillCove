import React from "react";

const LoadingSkeleton = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8 animate-fade-in">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-48 bg-gray-800/40 rounded-lg animate-pulse" />
        <div className="h-10 w-64 bg-gray-800/40 rounded-full animate-pulse" />
      </div>

      {/* Filter tabs skeleton */}
      <div className="flex gap-2 mb-8">
        <div className="h-10 w-28 bg-gray-800/40 rounded-full animate-pulse" />
        <div className="h-10 w-24 bg-gray-800/40 rounded-full animate-pulse" />
        <div className="h-10 w-32 bg-gray-800/40 rounded-full animate-pulse" />
      </div>

      {/* Notes grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="p-4 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex justify-between mb-3">
              <div className="h-6 w-6 bg-gray-700/50 rounded-lg" />
              <div className="h-6 w-6 bg-gray-700/50 rounded-lg" />
            </div>
            <div className="h-6 w-3/4 bg-gray-700/50 rounded mb-2" />
            <div className="h-4 w-full bg-gray-700/50 rounded mb-1" />
            <div className="h-4 w-5/6 bg-gray-700/50 rounded mb-3" />
            <div className="flex gap-1.5">
              <div className="h-5 w-16 bg-gray-700/50 rounded-full" />
              <div className="h-5 w-12 bg-gray-700/50 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
