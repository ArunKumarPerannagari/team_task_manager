import React from 'react';
import { AlertCircle } from 'lucide-react';

const EmptyState = ({ icon: Icon = AlertCircle, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-sm animate-fade-in">
      <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 mb-4">
        <Icon size={48} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-8">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
