import React from 'react';
import { cn } from './LoadingSpinner';

const SkeletonLoader = ({ className }) => {
  return (
    <div className={cn("animate-pulse bg-slate-200 rounded-lg", className)} />
  );
};

export const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
    <div className="flex justify-between items-start">
      <SkeletonLoader className="h-6 w-2/3" />
      <SkeletonLoader className="h-6 w-16" />
    </div>
    <SkeletonLoader className="h-4 w-full" />
    <SkeletonLoader className="h-4 w-5/6" />
    <div className="flex justify-between items-center pt-4">
      <SkeletonLoader className="h-8 w-8 rounded-full" />
      <SkeletonLoader className="h-4 w-24" />
    </div>
  </div>
);

export default SkeletonLoader;
