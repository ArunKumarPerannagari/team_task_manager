import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <h1 className="text-[12rem] font-black text-slate-200 leading-none select-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-primary-600 p-6 rounded-3xl shadow-2xl shadow-primary-200 rotate-12">
            <Search size={64} className="text-white" />
          </div>
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-slate-900 mb-4 font-['Outfit',sans-serif]">Page Not Found</h2>
      <p className="text-slate-500 max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved. 
        Let's get you back on track.
      </p>
      
      <Link to="/" className="btn btn-primary px-8 py-3 text-lg gap-2 shadow-xl shadow-primary-200">
        <Home size={20} />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
