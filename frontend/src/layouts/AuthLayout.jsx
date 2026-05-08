import React from 'react';
import { Outlet } from 'react-router-dom';
import { FolderKanban } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Inter',sans-serif]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-primary-600 p-3 rounded-2xl text-white shadow-xl shadow-primary-200 transform hover:scale-105 transition-transform duration-300">
            <FolderKanban size={32} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
          Team Task Manager
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Simplify your team's workflow and boost productivity
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-10 px-6 shadow-2xl shadow-slate-200/50 rounded-3xl border border-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-primary-600"></div>
          <Outlet />
        </div>
        
        <div className="mt-8 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Team Task Manager. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
